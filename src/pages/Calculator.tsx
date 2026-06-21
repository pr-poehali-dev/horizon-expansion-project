import { useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { loadPrices, formatRub, calculate1C, CalcInput } from '@/lib/pricing';

const WEBHOOK_URL = 'https://example.com/webhook';
const PHONE = '+79999802464';

const HEIGHTS = [1.5, 1.8, 2.0, 2.2];

const FILLINGS = [
  { id: 'proflist', label: 'Профлист', icon: 'Layers', desc: 'Сплошное полотно' },
  { id: 'shtaket', label: 'Евроштакетник', icon: 'AlignJustify', desc: 'С зазором' },
  { id: 'gitter', label: '3D-сетка Гиттер', icon: 'Grid3x3', desc: 'Сварная сетка' },
] as const;

type FillingId = CalcInput['filling_type'];

const FILLING_LABELS: Record<FillingId, string> = {
  proflist: 'Профлист',
  shtaket: 'Евроштакетник',
  gitter: '3D-сетка Гиттер',
};

const Calculator = () => {
  const prices = useMemo(() => loadPrices(), []);

  const [totalMeters, setTotalMeters] = useState(50);
  const [gatesCount, setGatesCount] = useState(1);
  const [gatesWidth, setGatesWidth] = useState(4);
  const [gatesHasAuto, setGatesHasAuto] = useState(true);
  const [wicketsCount, setWicketsCount] = useState(1);
  const [wicketsWidth, setWicketsWidth] = useState(1);
  const [height, setHeight] = useState(2.0);
  const [fillingType, setFillingType] = useState<FillingId>('proflist');
  const [lagsRows, setLagsRows] = useState(2);
  const [generatorNeeded, setGeneratorNeeded] = useState(false);
  const [dismantleMeters, setDismantleMeters] = useState(0);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);
  const [smetaNo, setSmetaNo] = useState('');
  const [sending, setSending] = useState(false);

  const input: CalcInput = {
    total_meters: totalMeters,
    height,
    filling_type: fillingType,
    lags_rows: lagsRows,
    gates_count: gatesCount,
    gates_width: gatesWidth,
    gates_has_auto: gatesHasAuto,
    wickets_count: wicketsCount,
    wickets_width: wicketsWidth,
    generator_needed: generatorNeeded,
    dismantle_meters: dismantleMeters,
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const result = useMemo(() => calculate1C(input, prices), [
    totalMeters, height, fillingType, lagsRows, gatesCount, gatesWidth,
    gatesHasAuto, wicketsCount, wicketsWidth, generatorNeeded, dismantleMeters,
  ]);

  const { meta, materials_list, client_view } = result;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSending(true);

    const no = String(Math.floor(10000 + Math.random() * 90000));
    setSmetaNo(no);

    const mat_text = materials_list
      .map((m) => `  • ${m.label}: ${m.qty} ${m.unit} — ${formatRub(m.cost)}`)
      .join('\n');

    const report =
      `🔧 СМЕТА №${no} — Сталь Групп\n\n` +
      `Имя: ${name}\nТелефон: ${phone}\n\n` +
      `📐 Параметры:\n` +
      `  Периметр: ${totalMeters} м\n` +
      `  Высота: ${height} м\n` +
      `  Заполнение: ${FILLING_LABELS[fillingType]}\n` +
      `  Ряды лаг: ${lagsRows}\n` +
      `  Ворота: ${gatesCount} шт × ${gatesWidth} м (${gatesHasAuto ? 'автоматика' : 'механика'})\n` +
      `  Калитки: ${wicketsCount} шт × ${wicketsWidth} м\n` +
      (generatorNeeded ? `  Генератор: да\n` : '') +
      (dismantleMeters > 0 ? `  Демонтаж: ${dismantleMeters} м\n` : '') +
      `\n📏 Чистая длина полотна: ${meta.clean_fence_length} м.\n` +
      `   Столбов: ${meta.posts_count} шт\n\n` +
      `🧱 Спецификация материалов:\n${mat_text}\n\n` +
      `💰 Материалы: ${formatRub(client_view.materials_sum)}\n` +
      `🔨 Монтаж:    ${formatRub(client_view.works_sum)}\n` +
      `✅ ИТОГО под ключ: ${formatRub(client_view.grand_total)}`;

    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, smeta_no: no, report, input, result }),
      });
    } catch (_) { /* заглушка */ }

    setSending(false);
    setSuccess(true);
    setName('');
    setPhone('');
  };

  const numInput = (value: number, setter: (v: number) => void, step = 1, min = 0) => (
    <Input
      type="number" value={value} min={min} step={step}
      onChange={(e) => setter(Math.max(min, Number(e.target.value)))}
      className="rounded-md bg-background"
    />
  );

  return (
    <Layout>
      <section className="border-b border-border blueprint-grid">
        <div className="container py-12">
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight md:text-5xl">
            Инженерный калькулятор
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Расчёт строго по алгоритму 1С. Смета обновляется мгновенно.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-8 lg:grid-cols-3">

          {/* ── Форма ── */}
          <div className="space-y-6 lg:col-span-2">

            {/* Шаг 1 */}
            <div className="rounded-md border border-border bg-card p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-display font-bold text-primary-foreground">1</span>
                <h2 className="font-display text-xl font-semibold uppercase tracking-wide">Геометрия участка</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-1.5 block text-sm">Общая длина периметра, м</Label>
                  {numInput(totalMeters, setTotalMeters)}
                </div>
                <div className="flex items-center gap-3 rounded-md border border-primary/30 bg-primary/5 px-4 py-2">
                  <Icon name="Ruler" size={20} className="shrink-0 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Чистая длина полотна</div>
                    <div className="font-display text-2xl font-bold text-primary">{meta.clean_fence_length.toFixed(1)} м</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-1.5 block text-sm">Ворота, шт</Label>
                    {numInput(gatesCount, setGatesCount)}
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm">Ширина ворот, м</Label>
                    {numInput(gatesWidth, setGatesWidth, 0.1)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-1.5 block text-sm">Калитки, шт</Label>
                    {numInput(wicketsCount, setWicketsCount)}
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm">Ширина калитки, м</Label>
                    {numInput(wicketsWidth, setWicketsWidth, 0.1)}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Label className="mb-2 block text-sm">Тип ворот</Label>
                  <div className="flex gap-2">
                    {[false, true].map((auto) => (
                      <button key={String(auto)} type="button"
                        onClick={() => setGatesHasAuto(auto)}
                        className={`flex-1 rounded-md border py-2.5 font-display text-sm font-medium transition-colors ${
                          gatesHasAuto === auto
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background hover:border-primary'
                        }`}>
                        {auto ? 'С автоматикой' : 'Механика'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Шаг 2 */}
            <div className="rounded-md border border-border bg-card p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-display font-bold text-primary-foreground">2</span>
                <h2 className="font-display text-xl font-semibold uppercase tracking-wide">Параметры материалов</h2>
              </div>

              <Label className="mb-2 block text-sm">Высота забора</Label>
              <div className="mb-5 flex flex-wrap gap-2">
                {HEIGHTS.map((h) => (
                  <button key={h} type="button" onClick={() => setHeight(h)}
                    className={`rounded-md border px-4 py-2 font-display font-medium transition-colors ${
                      height === h ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-primary'
                    }`}>
                    {h} м
                  </button>
                ))}
              </div>

              <Label className="mb-2 block text-sm">Тип заполнения</Label>
              <div className="mb-5 grid gap-3 sm:grid-cols-3">
                {FILLINGS.map((f) => (
                  <button key={f.id} type="button" onClick={() => setFillingType(f.id)}
                    className={`flex flex-col items-start rounded-md border p-4 text-left transition-colors ${
                      fillingType === f.id ? 'border-primary bg-primary/10' : 'border-border bg-background hover:border-primary'
                    }`}>
                    <Icon name={f.icon} size={22} className={fillingType === f.id ? 'text-primary' : 'text-muted-foreground'} />
                    <span className="mt-2 font-display font-semibold">{f.label}</span>
                    <span className="text-xs text-muted-foreground">{f.desc}</span>
                  </button>
                ))}
              </div>

              <Label className="mb-2 block text-sm">Ряды лаг (поперечины)</Label>
              <div className="mb-5 flex gap-2">
                {[2, 3].map((r) => (
                  <button key={r} type="button" onClick={() => setLagsRows(r)}
                    className={`rounded-md border px-5 py-2 font-display font-medium transition-colors ${
                      lagsRows === r ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-primary'
                    }`}>
                    {r} ряда
                  </button>
                ))}
              </div>

              <Label className="mb-2 block text-sm">Дополнительные услуги</Label>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-background p-3">
                  <Checkbox checked={generatorNeeded} onCheckedChange={(v) => setGeneratorNeeded(!!v)} />
                  <span className="flex-1 text-sm">Генератор на участок</span>
                  <span className="text-sm text-muted-foreground">+2 000 ₽</span>
                </label>
                <div className="flex items-center gap-3 rounded-md border border-border bg-background p-3">
                  <span className="flex-1 text-sm">Демонтаж старого забора, м</span>
                  <div className="w-24">{numInput(dismantleMeters, setDismantleMeters)}</div>
                  <span className="text-sm text-muted-foreground">300 ₽/м</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Live-Смета ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-md border border-primary/40 bg-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <Icon name="Receipt" size={18} className="text-primary" />
                <h3 className="font-display text-base font-semibold uppercase tracking-wider">Live-Смета</h3>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2 rounded-md bg-secondary/50 p-3 text-xs">
                <div>
                  <div className="text-muted-foreground">Чистая длина</div>
                  <div className="font-display font-bold">{meta.clean_fence_length.toFixed(1)} м</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Столбов</div>
                  <div className="font-display font-bold">{meta.posts_count} шт</div>
                </div>
              </div>

              {/* Детализация */}
              <div className="mb-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Спецификация материалов
                </div>
                <div className="space-y-2.5">
                  {materials_list.map((m) => (
                    <div key={m.label} className="flex items-start justify-between gap-2 border-b border-border/50 pb-2 last:border-0">
                      <div className="min-w-0 flex-1">
                        <div className="text-xs leading-snug">{m.label}</div>
                        <div className="text-xs text-primary/80">{m.qty} {m.unit}</div>
                      </div>
                      <div className="shrink-0 font-display text-sm font-bold">{formatRub(m.cost)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 border-t border-border pt-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Материалы итого</span>
                  <span className="font-display font-semibold">{formatRub(client_view.materials_sum)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Монтаж</span>
                  <span className="font-display font-semibold">{formatRub(client_view.works_sum)}</span>
                </div>
              </div>

              <div className="mt-4 rounded-md bg-primary/10 px-4 py-3">
                <div className="text-xs text-muted-foreground">Итоговая сумма под ключ</div>
                <div className="font-display text-3xl font-bold text-primary">{formatRub(client_view.grand_total)}</div>
              </div>

              <form onSubmit={handleSubmit} className="mt-4 space-y-2">
                <Input placeholder="Ваше имя" value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-md bg-background" required />
                <Input placeholder="Телефон" type="tel" value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-md bg-background" required />
                <Button type="submit" className="w-full rounded-md" disabled={sending}>
                  <Icon name="Send" size={16} className="mr-2" />
                  {sending ? 'Отправляем…' : 'Отправить смету инженеру'}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Или позвоните:{' '}
                  <a href={`tel:${PHONE}`} className="font-medium text-primary">{PHONE}</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={success} onOpenChange={setSuccess}>
        <DialogContent className="rounded-md">
          <DialogHeader>
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-md bg-primary/15">
              <Icon name="CheckCircle2" size={32} className="text-primary" />
            </div>
            <DialogTitle className="text-center font-display text-2xl uppercase">
              Смета зафиксирована
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Смета №<strong className="text-foreground">{smetaNo}</strong> зафиксирована и отправлена.<br />
              Инженер перезвонит вам через <strong className="text-foreground">7 минут</strong>.
            </DialogDescription>
          </DialogHeader>
          <Button className="rounded-md" onClick={() => setSuccess(false)}>Отлично</Button>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Calculator;
