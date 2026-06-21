export type PriceList = {
  price_proflist_m2: number;
  price_shtaket_m: number;
  price_post_60x60: number;
  price_gate_auto: number;
  work_rate_base: number;
  margin_coeff: number;
};

export const DEFAULT_PRICES: PriceList = {
  price_proflist_m2: 650,
  price_shtaket_m: 120,
  price_post_60x60: 900,
  price_gate_auto: 65000,
  work_rate_base: 500,
  margin_coeff: 1.5,
};

const STORAGE_KEY = 'steel_group_pricelist';

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
  price_proflist_m2: 'Профлист, ₽ за м²',
  price_shtaket_m: 'Евроштакетник, ₽ за метр',
  price_post_60x60: 'Столб 60×60, ₽ за шт.',
  price_gate_auto: 'Откатные ворота (авто), ₽',
  work_rate_base: 'Ставка монтажа, ₽ за метр',
  margin_coeff: 'Коэффициент наценки',
};

export function formatRub(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(Math.round(value)) + ' ₽';
}
