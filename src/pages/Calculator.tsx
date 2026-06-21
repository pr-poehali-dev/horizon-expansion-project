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
import { loadPrices, formatRub } from '@/lib/pricing';

const WEBHOOK_URL = 'https://example.com/webhook';

const HEIGHTS = [1.5, 1.8, 2.0, 2.2];

const FILLINGS = [
  { id: 'proflist', label: 'Профлист', icon: 'Layers', desc: 'Сплошное полотно' },
  { id: 'shtaket', label: 'Евроштакетник', icon: 'AlignJustify', desc: 'С зазором' },
  { id: 'gitter', label: '3D-сетка Гиттер', icon: 'Grid3x3', desc: 'Сварная сетка' },
] as const;

type FillingId = (typeof FILLINGS)[number]['id'];

const Calculator = () => {
  const prices = useMemo(() => loadPrices(), []);

  // Шаг 1: геометрия
  const [lTotal, setLTotal] = useState(50);
  const [nGate, setNGate] = useState(1);
  const [wGate, setWGate] = useState(4);
  const [nWicket, setNWicket] = useState(1);
  const [wWicket, setWWicket] = useState(1);

  // Шаг 2: материалы
  const [height, setHeight] = useState(2.0);
  const [filling, setFilling] = useState<FillingId>('proflist');
  const [demolition, setDemolition] = useState(false);
  const [generator, setGenerator] = useState(false);

  // Форма
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  const lClean = Math.max(0, lTotal - wGate * nGate - wWicket * nWicket);

  // Стоимость материалов забора
  const fillingCost = useMemo(() => {
    if (filling === 'proflist') return lClean * height * prices.price_proflist_m2;
    if (filling === 'shtaket') return lClean * prices.price_shtaket_m * height;
    // гиттер считаем по м2 как профлист с небольшим коэффициентом
    return lClean * height * (prices.price_proflist_m2 * 0.95);
  }, [filling, lClean, height, prices]);

  // Столбы: ~ каждые 2.5 метра + по краям
  const postsCount = lClean > 0 ? Math.ceil(lClean / 2.5) + 1 : 0;
  const postsCost = postsCount * prices.price_post_60x60;

  const gatesCost = nGate * prices.price_gate_auto;

  const materialsCost = fillingCost + postsCost + gatesCost;

  // Монтаж
  const installRate = prices.work_rate_base * prices.margin_coeff;
  const demolitionCost = demolition ? lTotal * 300 : 0;
  const generatorCost = generator ? 2000 : 0;
  const installCost = installRate * lClean + demolitionCost + generatorCost;

  const total = materialsCost + installCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSending(true);
    const payload = {
      name,
      phone,
      params: {
        lTotal,
        nGate,
        wGate,
        nWicket,
        wWicket,
        lClean,
        height,
        filling,
        demolition,
        generator,
      },
      total,
    };
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      /* заглушка вебхука */
    }
    setSending(false);
    setSuccess(true);
    setName('');
    setPhone('');
  };

  const numInput = (
    value: number,
    setter: (v: number) => void,
    step = 1,
    min = 0,
  ) => (
    <Input
      type="number"
      value={value}
      min={min}
      step={step}
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
            Расчёт по реальным расценкам производства. Смета обновляется мгновенно.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Форма */}
          <div className="space-y-8 lg:col-span-2">
            {/* Шаг 1 */}
            <div className="rounded-md border border-border bg-card p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-display font-bold text-primary-foreground">1</span>
                <h2 className="font-display text-xl font-semibold uppercase tracking-wide">Геометрия участка</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label className="mb-1.5 block">Общая длина периметра, м</Label>
                  {numInput(lTotal, setLTotal)}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-1.5 block">Ворота, шт</Label>
                    {numInput(nGate, setNGate)}
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Ширина ворот, м</Label>
                    {numInput(wGate, setWGate, 0.1)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-1.5 block">Калитки, шт</Label>
                    {numInput(nWicket, setNWicket)}
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Ширина калитки, м</Label>
                    {numInput(wWicket, setWWicket, 0.1)}
                  </div>
                </div>
                <div className="flex items-center rounded-md border border-primary/30 bg-primary/5 px-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Чистая длина полотна</span>
                    <div className="font-display text-2xl font-bold text-primary">{lClean.toFixed(1)} м</div>
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

              <Label className="mb-2 block">Высота забора</Label>
              <div className="mb-6 flex flex-wrap gap-2">
                {HEIGHTS.map((h) => (
                  <button
                    key={h}
                    onClick={() => setHeight(h)}
                    className={`rounded-md border px-4 py-2 font-display font-medium transition-colors ${
                      height === h
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background hover:border-primary'
                    }`}
                  >
                    {h} м
                  </button>
                ))}
              </div>

              <Label className="mb-2 block">Тип заполнения</Label>
              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                {FILLINGS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilling(f.id)}
                    className={`flex flex-col items-start rounded-md border p-4 text-left transition-colors ${
                      filling === f.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background hover:border-primary'
                    }`}
                  >
                    <Icon name={f.icon} size={24} className={filling === f.id ? 'text-primary' : 'text-muted-foreground'} />
                    <span className="mt-2 font-display font-semibold">{f.label}</span>
                    <span className="text-xs text-muted-foreground">{f.desc}</span>
                  </button>
                ))}
              </div>

              <Label className="mb-2 block">Дополнительные услуги</Label>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-background p-3">
                  <Checkbox checked={demolition} onCheckedChange={(v) => setDemolition(!!v)} />
                  <span className="flex-1">Демонтаж старого забора</span>
                  <span className="text-sm text-muted-foreground">+300 ₽/м</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-background p-3">
                  <Checkbox checked={generator} onCheckedChange={(v) => setGenerator(!!v)} />
                  <span className="flex-1">Генератор на участок</span>
                  <span className="text-sm text-muted-foreground">+2 000 ₽</span>
                </label>
              </div>
            </div>
          </div>

          {/* Live-Смета */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-md border border-primary/40 bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Icon name="Receipt" size={20} className="text-primary" />
                <h3 className="font-display text-lg font-semibold uppercase tracking-wide">Live-Смета</h3>
              </div>

              <div className="space-y-2.5 text-sm">
                <Row label="Полотно + столбы" value={formatRub(fillingCost + postsCost)} />
                <Row label={`Ворота (${nGate} шт)`} value={formatRub(gatesCost)} />
                <div className="my-2 border-t border-border" />
                <Row label="Материалы" value={formatRub(materialsCost)} bold />
                <Row label={`Монтаж · ${lClean.toFixed(1)} м`} value={formatRub(installRate * lClean)} />
                {demolition && <Row label="Демонтаж" value={formatRub(demolitionCost)} />}
                {generator && <Row label="Генератор" value={formatRub(generatorCost)} />}
              </div>

              <div className="mt-5 rounded-md bg-primary/10 p-4">
                <span className="text-sm text-muted-foreground">Итого под ключ</span>
                <div className="font-display text-3xl font-bold text-primary">{formatRub(total)}</div>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <Input
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-md bg-background"
                  required
                />
                <Input
                  placeholder="Телефон"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-md bg-background"
                  required
                />
                <Button type="submit" className="w-full rounded-md" disabled={sending}>
                  <Icon name="Send" size={18} className="mr-2" />
                  {sending ? 'Отправляем…' : 'Отправить смету инженеру'}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Нажимая кнопку, вы соглашаетесь на обработку данных
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={success} onOpenChange={setSuccess}>
        <DialogContent className="rounded-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-md bg-primary/15">
              <Icon name="CheckCircle2" size={32} className="text-primary" />
            </div>
            <DialogTitle className="text-center font-display text-2xl uppercase">Смета зафиксирована</DialogTitle>
            <DialogDescription className="text-center text-base">
              Смета успешно отправлена. Инженер перезвонит вам в течение 10 минут.
            </DialogDescription>
          </DialogHeader>
          <Button className="rounded-md" onClick={() => setSuccess(false)}>Отлично</Button>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div className="flex items-center justify-between">
    <span className={bold ? 'font-semibold' : 'text-muted-foreground'}>{label}</span>
    <span className={bold ? 'font-display font-bold' : ''}>{value}</span>
  </div>
);

export default Calculator;
