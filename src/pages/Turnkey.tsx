import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const STEPS = [
  { icon: 'FileText', title: 'Заявка', desc: 'Оставляете данные или считаете смету в калькуляторе' },
  { icon: 'Ruler', title: 'Замер', desc: 'Инженер выезжает на участок бесплатно в радиусе 25 км' },
  { icon: 'FileSignature', title: 'Договор', desc: 'Фиксируем цену, сроки и спецификацию материалов' },
  { icon: 'Factory', title: 'Производство', desc: 'Изготавливаем конструкции на собственном цехе' },
  { icon: 'Wrench', title: 'Монтаж', desc: 'Собственные бригады, срок от 3 дней' },
  { icon: 'ClipboardCheck', title: 'Акт приёма', desc: 'Сдаём объект, выдаём гарантию 5 лет' },
];

const Turnkey = () => (
  <Layout>
    <section className="border-b border-border blueprint-grid">
      <div className="container py-14">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight md:text-5xl">Работаем под ключ</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Прозрачный процесс из 6 этапов — от заявки до подписания акта приёма-передачи.
        </p>
      </div>
    </section>

    <section className="container py-16">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s, i) => (
          <div key={s.title} className="relative rounded-md border border-border bg-card p-6">
            <span className="absolute right-4 top-4 font-display text-5xl font-bold text-secondary">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Icon name={s.icon} size={24} />
            </span>
            <h3 className="font-display text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-md border border-primary/40 bg-gradient-to-r from-primary/15 to-background p-10 text-center">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight md:text-3xl">Готовы начать?</h2>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Посчитайте стоимость онлайн и оставьте заявку — инженер свяжется в течение 10 минут.
        </p>
        <Button asChild size="lg" className="mt-6 rounded-md">
          <Link to="/calculator">
            <Icon name="Calculator" size={20} className="mr-2" /> Рассчитать смету
          </Link>
        </Button>
      </div>
    </section>
  </Layout>
);

export default Turnkey;
