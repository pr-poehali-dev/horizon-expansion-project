import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const NAV = [
  { to: '/', label: 'Главная' },
  { to: '/catalog', label: 'Каталог' },
  { to: '/turnkey', label: 'Под ключ' },
  { to: '/calculator', label: 'Калькулятор' },
];

const Header = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <Icon name="Construction" size={20} className="text-primary-foreground" />
          </span>
          <span className="font-display text-xl font-bold tracking-wide">
            СТАЛЬ <span className="text-primary">ГРУПП</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`font-display text-sm font-medium uppercase tracking-wider transition-colors hover:text-primary ${
                pathname === item.to ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a href="tel:+74951234567" className="font-display font-semibold">
            +7 (495) 123-45-67
          </a>
          <Button asChild className="rounded-md">
            <Link to="/calculator">Рассчитать</Link>
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          <Icon name={open ? 'X' : 'Menu'} size={26} />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border bg-card px-4 py-3 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 font-display uppercase tracking-wider hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
          <a href="tel:+74951234567" className="px-3 py-2 font-display font-semibold text-primary">
            +7 (495) 123-45-67
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;
