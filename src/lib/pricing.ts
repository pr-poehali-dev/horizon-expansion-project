export type PriceList = {
  proflist_m2: number;
  shtaket_m: number;
  post_60x60: number;
  lag_m: number;
  gate_mech_price: number;
  gate_auto_price: number;
  wicket_price: number;
  work_install_fence_m: number;
  work_install_gate: number;
  work_install_wicket: number;
  margin_coeff: number;
};

export const DEFAULT_PRICES: PriceList = {
  // 1. Полотна и металлопрокат
  proflist_m2: 650,
  shtaket_m: 120,
  post_60x60: 900,
  lag_m: 160,
  // 2. Каркасы проемов
  gate_mech_price: 45000,
  gate_auto_price: 65000,
  wicket_price: 12000,
  // 3. Базовые ставки работ для монтажников
  work_install_fence_m: 500,
  work_install_gate: 8000,
  work_install_wicket: 3000,
  // 4. Коэффициент наценки
  margin_coeff: 1.5,
};

const STORAGE_KEY = 'steel_group_pricelist_v2';

export function loadPrices(): PriceList {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PRICES, ...JSON.parse(raw) };
  } catch (e) {
    /* ignore */
  }
  return DEFAULT_PRICES;
}

export function savePrices(prices: PriceList): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prices));
}

export const PRICE_LABELS: Record<keyof PriceList, string> = {
  proflist_m2: 'Профлист, ₽ за м²',
  shtaket_m: 'Штакетник (планка), ₽ за пог. м',
  post_60x60: 'Столб 60×60, ₽ за шт.',
  lag_m: 'Лага (труба 40×20), ₽ за пог. м',
  gate_mech_price: 'Ворота откатные (механика), ₽',
  gate_auto_price: 'Ворота откатные (автоматика), ₽',
  wicket_price: 'Калитка в раме, ₽',
  work_install_fence_m: 'Монтаж забора, ₽ за метр (база)',
  work_install_gate: 'Монтаж ворот, ₽ (база)',
  work_install_wicket: 'Монтаж калитки, ₽ (база)',
  margin_coeff: 'Коэффициент наценки',
};

export function formatRub(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(Math.round(value)) + ' ₽';
}

// ====== Математическая модель 1С (Обработка.АРМ_РасчетЗаборов) ======

export type CalcInput = {
  total_meters: number;
  height: number;
  filling_type: 'proflist' | 'shtaket' | 'gitter';
  lags_rows: number;
  gates_count: number;
  gates_width: number;
  gates_has_auto: boolean;
  wickets_count: number;
  wickets_width: number;
  generator_needed: boolean;
  dismantle_meters: number;
};

export type MaterialLine = {
  label: string;
  qty: string;
  unit: string;
  cost: number;
};

export type CalcResult = {
  meta: {
    clean_fence_length: number;
    posts_count: number;
    lags_total_m: number;
  };
  materials_list: MaterialLine[];
  client_view: {
    materials_sum: number;
    works_sum: number;
    grand_total: number;
  };
};

export function calculate1C(input: CalcInput, prices: PriceList): CalcResult {
  // ШАГ 1. Вычет проемов (Критическая логика 1С)
  const total_gates_width = input.gates_count * input.gates_width;
  const total_wickets_width = input.wickets_count * input.wickets_width;

  const clean_length = Math.max(
    0,
    input.total_meters - total_gates_width - total_wickets_width,
  );

  // ШАГ 2. Физический подсчет «железа»
  const posts_needed = clean_length > 0 ? Math.ceil(clean_length / 2.5) + 1 : 0;
  const total_lags_meters = clean_length * input.lags_rows;

  let filling_cost = 0;
  if (input.filling_type === 'proflist') {
    const total_area_m2 = clean_length * input.height;
    filling_cost = total_area_m2 * prices.proflist_m2;
  } else if (input.filling_type === 'shtaket') {
    const total_planks_meters = clean_length * 7 * input.height;
    filling_cost = total_planks_meters * prices.shtaket_m;
  }

  const fence_materials_cost =
    filling_cost +
    posts_needed * prices.post_60x60 +
    total_lags_meters * prices.lag_m;

  const gates_items_cost =
    input.gates_count *
    (input.gates_has_auto ? prices.gate_auto_price : prices.gate_mech_price);
  const wickets_items_cost = input.wickets_count * prices.wicket_price;

  const ALL_MATERIALS_TOTAL =
    fence_materials_cost + gates_items_cost + wickets_items_cost;

  // ШАГ 3. Ценообразование РАБОТ для клиента (margin_coeff)
  const client_rate_fence = prices.work_install_fence_m * prices.margin_coeff;
  const client_rate_gate = prices.work_install_gate * prices.margin_coeff;
  const client_rate_wicket = prices.work_install_wicket * prices.margin_coeff;

  const fence_work_cost = clean_length * client_rate_fence;
  const gates_work_cost = input.gates_count * client_rate_gate;
  const wickets_work_cost = input.wickets_count * client_rate_wicket;

  let extra_work_cost = 0;
  if (input.generator_needed) extra_work_cost += 2000;
  if (input.dismantle_meters > 0) extra_work_cost += input.dismantle_meters * 300;

  const ALL_WORKS_TOTAL =
    fence_work_cost + gates_work_cost + wickets_work_cost + extra_work_cost;

  // ШАГ 4. Детализированный список материалов
  const materials_list: MaterialLine[] = [];

  // Столбы
  const posts_cost = posts_needed * prices.post_60x60;
  materials_list.push({
    label: 'Столбы металлические 60×60',
    qty: String(posts_needed),
    unit: 'шт.',
    cost: posts_cost,
  });

  // Лаги
  const lags_cost = total_lags_meters * prices.lag_m;
  materials_list.push({
    label: 'Лаги профиль 40×20',
    qty: total_lags_meters.toFixed(1),
    unit: 'пог. м',
    cost: lags_cost,
  });

  // Полотно
  if (input.filling_type === 'proflist') {
    const area = clean_length * input.height;
    materials_list.push({
      label: `Профнастил (h=${input.height} м)`,
      qty: area.toFixed(1),
      unit: 'м²',
      cost: area * prices.proflist_m2,
    });
  } else if (input.filling_type === 'shtaket') {
    const planks = Math.round(clean_length * 7);
    materials_list.push({
      label: `Евроштакетник (h=${input.height} м)`,
      qty: String(planks),
      unit: 'шт.',
      cost: planks * input.height * prices.shtaket_m,
    });
  } else {
    const area = clean_length * input.height;
    materials_list.push({
      label: `3D-сетка Гиттер (h=${input.height} м)`,
      qty: area.toFixed(1),
      unit: 'м²',
      cost: area * prices.proflist_m2 * 0.95,
    });
  }

  // Ворота
  if (input.gates_count > 0) {
    const gate_price = input.gates_has_auto ? prices.gate_auto_price : prices.gate_mech_price;
    materials_list.push({
      label: input.gates_has_auto ? 'Откатные ворота с автоматикой' : 'Откатные ворота (механика)',
      qty: String(input.gates_count),
      unit: 'шт.',
      cost: input.gates_count * gate_price,
    });
  }

  // Калитки
  if (input.wickets_count > 0) {
    materials_list.push({
      label: 'Калитка в раме',
      qty: String(input.wickets_count),
      unit: 'шт.',
      cost: input.wickets_count * prices.wicket_price,
    });
  }

  // ШАГ 5. Финальная сборка
  return {
    meta: {
      clean_fence_length: clean_length,
      posts_count: posts_needed,
      lags_total_m: total_lags_meters,
    },
    materials_list,
    client_view: {
      materials_sum: Math.round(ALL_MATERIALS_TOTAL),
      works_sum: Math.round(ALL_WORKS_TOTAL),
      grand_total: Math.round(ALL_MATERIALS_TOTAL + ALL_WORKS_TOTAL),
    },
  };
}