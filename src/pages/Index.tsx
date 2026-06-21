import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { REVIEWS } from '@/data/reviews';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/d9a2a61a-27e8-4f29-8dfd-d16bff5e4078/files/04d4062c-cfcd-4408-a0f4-326b1e12a8aa.jpg';

const SERVICES = [
  { icon: 'Fence', title: 'Заборы', desc: 'Профлист, евроштакетник, 3D-сетка', from: 'от 1 200 ₽/м' },
  { icon: 'DoorOpen', title: 'Откатные ворота', desc: 'Автоматика, монтаж под ключ', from: 'от 65 000 ₽' },
  { icon: 'Warehouse', title: 'Навесы', desc: 'Для авто, террас и зон отдыха', from: 'от 4 500 ₽/м²' },
  { icon: 'SquareParking', title: 'Площадки для авто', desc: 'Основание, дренаж, покрытие', from: 'от 2 800 ₽/м²' },
];

const ADVANTAGES = [
  { icon: 'Factory', title: 'Своё производство', desc: 'Металлобаза в г. Люберцы' },
  { icon: 'BadgeCheck', title: 'Гарантия 5 лет', desc: 'На конструкции и монтаж' },
  { icon: 'Truck', title: '25 км от МКАД', desc: 'Бесплатный замер в зоне выезда' },
  { icon: 'CalendarClock', title: 'Срок от 3 дней', desc: 'Собственные монтажные бригады' },
];

const US_ROWS = [
  ['Своя металлобаза в Люберцах', 'Закупают у посредников'],
  ['Цена зафиксирована в договоре', 'Цена «плавает» по ходу работ'],
  ['Без скрытых доплат', 'Накрутка 25–40% сверху сметы'],
  ['Сроки прописаны, штраф за нарушение', 'Плавающие сроки без ответственности'],
  ['Квитанция КО-1 из 1С при оплате', 'Расчёт «на карту» без документов'],
];

const JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Сталь Групп',
  telephone: '+79999802464',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Люберцы',
    addressRegion: 'Московская область',
    addressCountry: 'RU',
  },
  url: 'https://stalgrupp.ru',
  description: 'Прямой производитель заборов, откатных ворот, навесов и площадок под ключ. Радиус 25 км от МКАД.',
  openingHours: 'Mo-Su 09:00-20:00',
  priceRange: '₽₽',
});

const Index = () => (
  <Layout>
    <Helmet>
      <title>Заборы, откатные ворота и навесы под ключ в Москве и МО — Сталь Групп</title>
      <meta name="description" content="Прямой производитель заборов, откатных ворот и навесов. Производство в Люберцах, монтаж в радиусе 25 км от МКАД. Смета за 1 минуту." />
      <script type="application/ld+json">{JSON_LD}</script>
    </Helmet>

    {/* Hero */}
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="Забор и ворота Сталь Групп" className="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" />
      </div>
      <div className="container relative grid gap-10 py-20 md:py-28 lg:grid-cols-2">
        <div className="animate-fade-in">
          <span className="mb-4 inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-1 font-display text-sm uppercase tracking-wider text-primary">
            <Icon name="Factory" size={15} /> Прямой производитель · Люберцы
          </span>
          <h1 className="font-display text-4xl font-bold uppercase leading-tight tracking-tight md:text-6xl">
            Заборы, ворота и навесы <span className="text-primary">под ключ</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Проектируем, производим и монтируем металлоконструкции в радиусе 25 км от МКАД.
            Точная смета за 1 минуту — без скрытых доплат.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" className="rounded-md">
              <Link to="/calculator">
                <Icon name="Calculator" size={18} className="mr-2" /> Рассчитать стоимость
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-md">
              <Link to="/catalog">Смотреть каталог</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* Услуги */}
    <section className="container py-16">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">Наши услуги</h2>
        <p className="mt-2 text-muted-foreground">Полный цикл: от замера до акта приёма-передачи</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s) => (
          <div key={s.title}
            className="group flex flex-col rounded-md border border-border bg-card p-6 transition-colors hover:border-primary">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon name={s.icon} size={26} />
            </span>
            <h3 className="font-display text-xl font-semibold">{s.title}</h3>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{s.desc}</p>
            <div className="mt-4 font-display text-lg font-bold text-primary">{s.from}</div>
            <Button asChild variant="ghost" className="mt-3 justify-start px-0 hover:bg-transparent hover:text-primary">
              <Link to="/calculator">Рассчитать <Icon name="ArrowRight" size={16} className="ml-1" /></Link>
            </Button>
          </div>
        ))}
      </div>
    </section>

    {/* МЫ vs ПОСРЕДНИКИ */}
    <section className="border-y border-border bg-card">
      <div className="container py-14">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">
            Мы против посредников
          </h2>
          <p className="mt-2 text-muted-foreground">Почему прямой производитель — это всегда выгоднее</p>
        </div>
        <div className="overflow-hidden rounded-md border border-border">
          {/* Заголовки */}
          <div className="grid grid-cols-3 border-b border-border bg-secondary/30">
            <div className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Критерий</div>
            <div className="border-x border-border bg-primary/10 p-3 text-center font-display text-sm font-bold uppercase text-primary">
              ✓ Сталь Групп
            </div>
            <div className="p-3 text-center font-display text-sm font-bold uppercase text-muted-foreground">Посредник</div>
          </div>
          {US_ROWS.map(([us, them], i) => (
            <div key={i} className={`grid grid-cols-3 border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-secondary/10'}`}>
              <div className="hidden p-3 text-xs text-muted-foreground sm:block">
                {['Металл', 'Цена', 'Доплаты', 'Сроки', 'Документы'][i]}
              </div>
              <div className="border-x border-border bg-primary/5 p-3">
                <span className="flex items-start gap-1.5 text-sm">
                  <Icon name="Check" size={16} className="mt-0.5 shrink-0 text-primary" />
                  {us}
                </span>
              </div>
              <div className="p-3">
                <span className="flex items-start gap-1.5 text-sm text-muted-foreground">
                  <Icon name="X" size={16} className="mt-0.5 shrink-0 text-destructive" />
                  {them}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Преимущества */}
    <section className="container py-14">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ADVANTAGES.map((a) => (
          <div key={a.title} className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon name={a.icon} size={24} />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold">{a.title}</h3>
              <p className="text-sm text-muted-foreground">{a.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Отзывы-превью */}
    <section className="border-t border-border bg-card">
      <div className="container py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">Реальные отзывы</h2>
            <p className="mt-2 text-muted-foreground">С проверенных объектов по договору</p>
          </div>
          <Button asChild variant="outline" className="hidden rounded-md sm:flex">
            <Link to="/reviews">Все отзывы <Icon name="ArrowRight" size={16} className="ml-1" /></Link>
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {REVIEWS.slice(0, 3).map((r) => (
            <ReviewCard key={r.id} r={r} />
          ))}
        </div>
        <Button asChild variant="outline" className="mt-6 w-full rounded-md sm:hidden">
          <Link to="/reviews">Смотреть все отзывы</Link>
        </Button>
      </div>
    </section>

    {/* CTA */}
    <section className="container py-20">
      <div className="overflow-hidden rounded-md border border-primary/40 bg-gradient-to-r from-primary/15 to-background p-10 text-center md:p-16">
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">
          Узнайте точную цену под ключ
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Инженерный калькулятор рассчитает стоимость материалов и монтажа по алгоритму нашей производственной системы.
        </p>
        <Button asChild size="lg" className="mt-7 rounded-md">
          <Link to="/calculator">
            <Icon name="Calculator" size={20} className="mr-2" /> Открыть калькулятор
          </Link>
        </Button>
      </div>
    </section>
  </Layout>
);

const ReviewCard = ({ r }: { r: (typeof REVIEWS)[0] }) => (
  <div className="flex flex-col rounded-md border border-border bg-background p-5">
    <div className="mb-3 flex h-36 items-center justify-center rounded-md bg-secondary text-muted-foreground">
      <Icon name="Camera" size={36} className="opacity-40" />
    </div>
    <div className="mb-2 flex items-center gap-2">
      <span className="text-sm text-yellow-400">{'★'.repeat(r.stars)}</span>
      <span className="rounded-sm bg-primary/10 px-2 py-0.5 text-xs text-primary">
        ✓ Объект по договору №{r.contract}
      </span>
    </div>
    <h3 className="font-display font-semibold">{r.name}</h3>
    <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
      <Icon name="MapPin" size={12} /> {r.location}
    </div>
    <p className="text-xs text-muted-foreground/80">{r.built}</p>
    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{r.text}</p>
  </div>
);

export default Index;
