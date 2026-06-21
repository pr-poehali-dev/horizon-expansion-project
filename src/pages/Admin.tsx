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

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [prices, setPrices] = useState<PriceList>(loadPrices());
  const [saved, setSaved] = useState(false);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) {
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
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
              <p className="text-sm text-muted-foreground">Введите пароль для доступа</p>
            </div>
            <Label className="mb-1.5 block">Пароль</Label>
            <Input
              type="password"
              value={pass}
              onChange={(e) => { setPass(e.target.value); setError(false); }}
              className="rounded-md bg-background"
              autoFocus
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
      <section className="container py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-tight">Управление прайс-листом</h1>
            <p className="text-muted-foreground">Изменения мгновенно применяются в калькуляторе</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-primary">
            <Icon name="Settings" size={22} />
          </span>
        </div>

        <div className="grid max-w-2xl gap-5">
          {(Object.keys(prices) as (keyof PriceList)[]).map((key) => (
            <div key={key} className="grid grid-cols-1 items-center gap-2 rounded-md border border-border bg-card p-4 sm:grid-cols-2">
              <Label className="font-medium">{PRICE_LABELS[key]}</Label>
              <Input
                type="number"
                step={key === 'margin_coeff' ? 0.1 : 10}
                value={prices[key]}
                onChange={(e) => setPrices({ ...prices, [key]: Number(e.target.value) })}
                className="rounded-md bg-background"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button onClick={handleSave} className="rounded-md">
            <Icon name="Save" size={18} className="mr-2" /> Сохранить
          </Button>
          <Button onClick={handleReset} variant="outline" className="rounded-md">
            <Icon name="RotateCcw" size={18} className="mr-2" /> Сбросить по умолчанию
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 font-medium text-primary">
              <Icon name="Check" size={18} /> Сохранено
            </span>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
