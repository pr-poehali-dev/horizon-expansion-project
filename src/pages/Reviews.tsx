import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { REVIEWS, Review } from '@/data/reviews';

const ReviewCard = ({ r }: { r: Review }) => (
  <article className="flex flex-col rounded-md border border-border bg-card overflow-hidden">
    {/* Фото-заглушка */}
    <div className="relative flex h-48 items-center justify-center bg-secondary">
      <Icon name="Camera" size={40} className="text-muted-foreground/30" />
      <span className="absolute bottom-3 right-3 rounded-md bg-background/70 px-2 py-1 text-xs text-muted-foreground backdrop-blur">
        Фото объекта
      </span>
    </div>

    <div className="flex flex-1 flex-col p-5">
      {/* Бейдж-гарант */}
      <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-sm bg-green-500/15 px-2.5 py-1 text-xs font-semibold text-green-400">
        <Icon name="ShieldCheck" size={13} />
        Проверенный объект по договору №{r.contract}
      </span>

      {/* Звёзды */}
      <div className="mb-2 flex items-center gap-1">
        {Array.from({ length: r.stars }).map((_, i) => (
          <span key={i} className="text-yellow-400 text-base">★</span>
        ))}
      </div>

      {/* Имя и локация */}
      <h3 className="font-display text-lg font-semibold">{r.name}</h3>
      <p className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon name="MapPin" size={12} /> {r.location}
      </p>

      {/* Что построено */}
      <p className="mb-3 rounded-md bg-secondary/60 px-3 py-2 text-xs font-medium text-foreground/80">
        🔧 {r.built}
      </p>

      {/* Текст отзыва */}
      <p className="flex-1 text-sm text-muted-foreground leading-relaxed">{r.text}</p>
    </div>
  </article>
);

const Reviews = () => (
  <Layout>
    <Helmet>
      <title>Отзывы клиентов — Сталь Групп | Заборы и ворота под ключ</title>
      <meta name="description" content="Реальные отзывы о работе Сталь Групп с проверенных объектов по договору. Заборы, ворота, навесы в Москве и МО." />
    </Helmet>

    <section className="border-b border-border blueprint-grid">
      <div className="container py-12">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight md:text-5xl">
          Отзывы с объектов
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Каждый отзыв подкреплён номером договора. Мы не публикуем «звёзды» без реального объекта.
        </p>
      </div>
    </section>

    <section className="container py-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r) => (
          <ReviewCard key={r.id} r={r} />
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 rounded-md border border-primary/40 bg-gradient-to-r from-primary/15 to-background p-8 text-center">
        <h2 className="font-display text-2xl font-bold uppercase">Хотите стать следующим?</h2>
        <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
          Рассчитайте стоимость своего забора прямо сейчас — смета формируется за 1 минуту.
        </p>
        <Button asChild size="lg" className="mt-5 rounded-md">
          <Link to="/calculator">
            <Icon name="Calculator" size={18} className="mr-2" /> Рассчитать смету
          </Link>
        </Button>
      </div>
    </section>
  </Layout>
);

export default Reviews;
