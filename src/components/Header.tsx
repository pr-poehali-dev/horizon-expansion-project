import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const PHONE = '+79999802464';
const PHONE_DISPLAY = '+7 (999) 980-24-64';

const NAV = [
  { to: '/', label: 'Главная' },
  { to: '/catalog', label: 'Каталог' },
  { to: '/turnkey', label: 'Под ключ' },
  { to: '/calculator', label: 'Калькулятор' },
  { to: '/reviews', label: 'Отзывы' },
];

const Header = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      {/* Верхняя полоса с телефоном */}
      <div className="border-b border-border/50 bg-card/60">
        <div className="container flex h-9 items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Icon name="Clock" size={13} />
              Ежедневно 09:00–20:00
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <Icon name="MapPin" size={13} />
              Производство: г. Люберцы
            </span>
          </div>
          <a href={`tel:${PHONE}`}
            className="font-display text-sm font-bold text-foreground transition-colors hover:text-primary">
            {PHONE_DISPLAY}
          </a>
        </div>
      </div>

      {/* Основная навигация */}
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Icon name="Construction" size={18} className="text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-bold tracking-wide">
            СТАЛЬ <span className="text-primary">ГРУПП</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to}
              className={`font-display text-sm font-medium uppercase tracking-wider transition-colors hover:text-primary ${
                pathname === item.to ? 'text-primary' : 'text-foreground/75'
              }`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="outline" size="sm" className="rounded-md">
            <a href={`tel:${PHONE}`}>
              <Icon name="Phone" size={15} className="mr-1.5" />
              Замерщика
            </a>
          </Button>
          {/* Пульсирующая кнопка */}
          <Button asChild size="sm" className="relative rounded-md">
            <Link to="/calculator">
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
              </span>
              Рассчитать
            </Link>
          </Button>
        </div>

        <button className="md:hidden p-1" onClick={() => setOpen(!open)}>
          <Icon name={open ? 'X' : 'Menu'} size={24} />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border bg-card px-4 py-3 md:hidden">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
              className={`rounded-md px-3 py-2 font-display uppercase tracking-wider hover:bg-secondary ${
                pathname === item.to ? 'text-primary' : ''
              }`}>
              {item.label}
            </Link>
          ))}
          <a href={`tel:${PHONE}`}
            className="mt-1 flex items-center gap-2 rounded-md bg-primary px-3 py-2.5 font-display font-semibold text-primary-foreground">
            <Icon name="Phone" size={16} />
            {PHONE_DISPLAY}
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;
