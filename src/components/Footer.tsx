import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container grid gap-8 py-12 md:grid-cols-4">
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Icon name="Construction" size={18} className="text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-bold tracking-wide">
            СТАЛЬ <span className="text-primary">ГРУПП</span>
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Прямой производитель заборов, ворот, навесов и площадок под ключ.
        </p>
      </div>

      <div>
        <h4 className="mb-3 font-display uppercase tracking-wider text-foreground">Услуги</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/catalog" className="hover:text-primary">Заборы</Link></li>
          <li><Link to="/catalog" className="hover:text-primary">Откатные ворота</Link></li>
          <li><Link to="/catalog" className="hover:text-primary">Навесы</Link></li>
          <li><Link to="/catalog" className="hover:text-primary">Площадки для авто</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="mb-3 font-display uppercase tracking-wider text-foreground">Компания</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/turnkey" className="hover:text-primary">Как мы работаем</Link></li>
          <li><Link to="/calculator" className="hover:text-primary">Калькулятор</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="mb-3 font-display uppercase tracking-wider text-foreground">Контакты</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2"><Icon name="Phone" size={16} /> +7 (495) 123-45-67</li>
          <li className="flex items-center gap-2"><Icon name="MapPin" size={16} /> Москва и область, 25 км от МКАД</li>
          <li className="flex items-center gap-2"><Icon name="Clock" size={16} /> Ежедневно 9:00–21:00</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Сталь Групп. Собственное производство.
    </div>
  </footer>
);

export default Footer;
