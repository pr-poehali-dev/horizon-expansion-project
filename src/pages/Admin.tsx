import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  loadPrices,
  savePrices,
  PRICE_LABELS,
  DEFAULT_PRICES,
  PriceList,
} from '@/lib/pricing';

const ADMIN_PASSWORD = '2026';

const GROUPS: { title: string; keys: (keyof PriceList)[] }[] = [
  {
    title: 'Полотна и металлопрокат',
    keys: ['proflist_m2', 'shtaket_m', 'post_60x60', 'lag_m'],
  },
  {
    title: 'Каркасы проёмов',
    keys: ['gate_mech_price', 'gate_auto_price', 'wicket_price'],
  },
  {
    title: 'Ставки работ (себестоимость)',
    keys: ['work_install_fence_m', 'work_install_gate', 'work_install_wicket'],
  },
  {
    title: 'Коэффициент наценки',
    keys: ['margin_coeff'],
  },
];

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [prices, setPrices] = useState<PriceList>(loadPrices());
  const [saved, setSaved] = useState(false);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) { setAuthed(true); setError(false); }
    else setError(true);
  };

  const handleSave = () => {
    savePrices(prices);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setPrices(DEFAULT_PRICES);
    savePrices(DEFAULT_PRICES);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (key: keyof PriceList, val: string) =>
    setPrices((p) => ({ ...p, [key]: Number(val) }));

  if (!authed) {
    return (
      <Layout>
        <section className="container flex min-h-[60vh] items-center justify-center py-16">
          <form onSubmit={login} className="w-full max-w-sm rounded-md border border-border bg-card p-8">
            <div className="mb-6 flex flex-col items-center text-center">
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Icon name="Lock" size={24} />
              </span>
              <h1 className="font-display text-2xl font-bold uppercase">Админ-панель</h1>
              <p className="text-sm text-muted-foreground">Управление прайс-листом · Сталь Групп</p>
            </div>
            <Label className="mb-1.5 block">Пароль</Label>
            <Input
              type="password" value={pass} autoFocus
              onChange={(e) => { setPass(e.target.value); setError(false); }}
              className="rounded-md bg-background"
            />
            {error && <p className="mt-2 text-sm text-destructive">Неверный пароль</p>}
            <Button type="submit" className="mt-5 w-full rounded-md">Войти</Button>
          </form>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="border-b border-border blueprint-grid">
        <div className="container py-10">
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight">Управление прайс-листом</h1>
          <p className="mt-1 text-muted-foreground">
            Изменения сохраняются локально и мгновенно применяются в калькуляторе.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="max-w-2xl space-y-8">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                {group.title}
              </h2>
              <div className="space-y-2">
                {group.keys.map((key) => (
                  <div key={key}
                    className="flex items-center gap-4 rounded-md border border-border bg-card px-4 py-3">
                    <Label className="flex-1 text-sm font-medium">{PRICE_LABELS[key]}</Label>
                    <Input
                      type="number"
                      step={key === 'margin_coeff' ? 0.05 : 10}
                      value={prices[key]}
                      onChange={(e) => set(key, e.target.value)}
                      className="w-36 rounded-md bg-background text-right font-display font-semibold"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button onClick={handleSave} className="rounded-md">
            <Icon name="Save" size={16} className="mr-2" /> Сохранить изменения
          </Button>
          <Button onClick={handleReset} variant="outline" className="rounded-md">
            <Icon name="RotateCcw" size={16} className="mr-2" /> Сбросить по умолчанию
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 font-medium text-primary animate-fade-in">
              <Icon name="CheckCircle2" size={16} /> Сохранено успешно
            </span>
          )}
        </div>

        <div className="mt-10 rounded-md border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Как работает наценка: </span>
          ставка монтажника × margin_coeff = цена для клиента.
          Например: {prices.work_install_fence_m} × {prices.margin_coeff} ={' '}
          <span className="font-semibold text-primary">
            {(prices.work_install_fence_m * prices.margin_coeff).toFixed(0)} ₽/м для клиента
          </span>.
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
