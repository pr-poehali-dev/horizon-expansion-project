import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const FENCE_IMG =
  'https://cdn.poehali.dev/projects/d9a2a61a-27e8-4f29-8dfd-d16bff5e4078/files/04d4062c-cfcd-4408-a0f4-326b1e12a8aa.jpg';
const CANOPY_IMG =
  'https://cdn.poehali.dev/projects/d9a2a61a-27e8-4f29-8dfd-d16bff5e4078/files/0b16faa7-5bb4-4bca-979f-0d3c116f05ad.jpg';

const ITEMS = [
  { img: FENCE_IMG, title: 'Забор из профлиста, h=2.0м', specs: ['Профлист С8', 'Столбы 60×60', 'Оцинковка'], price: 'от 1 450 ₽/м' },
  { img: FENCE_IMG, title: 'Евроштакетник двусторонний', specs: ['Зазор 20 мм', 'RAL по выбору', 'Высота 1.8м'], price: 'от 1 700 ₽/м' },
  { img: CANOPY_IMG, title: 'Откатные ворота с автоматикой', specs: ['Привод CAME', 'Пульт 2 шт', 'Ширина 4–6м'], price: 'от 65 000 ₽' },
  { img: CANOPY_IMG, title: 'Навес для авто', specs: ['Поликарбонат 8 мм', 'Профиль 60×60', 'На 1–2 машины'], price: 'от 4 500 ₽/м²' },
  { img: FENCE_IMG, title: '3D-сетка Гиттер', specs: ['Пруток 4 мм', 'Полимер RAL 6005', 'Антивандальная'], price: 'от 1 200 ₽/м' },
  { img: CANOPY_IMG, title: 'Площадка под авто', specs: ['Дренаж', 'Геотекстиль', 'Брусчатка / бетон'], price: 'от 2 800 ₽/м²' },
];

const Catalog = () => (
  <Layout>
    <section className="border-b border-border blueprint-grid">
      <div className="container py-14">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight md:text-5xl">Каталог решений</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Готовые конфигурации с типовыми ценами. Точную смету под ваш участок посчитает калькулятор.
        </p>
      </div>
    </section>

    <section className="container py-14">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((it, i) => (
          <div key={i} className="group flex flex-col overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-primary">
            <div className="aspect-video overflow-hidden">
              <img src={it.img} alt={it.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-lg font-semibold">{it.title}</h3>
              <ul className="mt-3 flex-1 space-y-1.5 text-sm text-muted-foreground">
                {it.specs.map((s) => (
                  <li key={s} className="flex items-center gap-2">
                    <Icon name="Check" size={15} className="text-primary" /> {s}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-display text-xl font-bold text-primary">{it.price}</span>
                <Button asChild size="sm" className="rounded-md">
                  <Link to="/calculator">Рассчитать</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default Catalog;
