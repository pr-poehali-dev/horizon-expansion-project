import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const PHONE = '+79999802464';
const PHONE_DISPLAY = '+7 (999) 980-24-64';

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
          Прямой производитель заборов, ворот, навесов и площадок под ключ. Производство в Люберцах.
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
          <li><Link to="/reviews" className="hover:text-primary">Отзывы</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="mb-3 font-display uppercase tracking-wider text-foreground">Контакты</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Icon name="Phone" size={15} />
            <a href={`tel:${PHONE}`} className="hover:text-primary font-medium text-foreground">
              {PHONE_DISPLAY}
            </a>
          </li>
          <li className="flex items-center gap-2"><Icon name="MapPin" size={15} /> Люберцы, МО · 25 км от МКАД</li>
          <li className="flex items-center gap-2"><Icon name="Clock" size={15} /> Ежедневно 09:00–20:00</li>
        </ul>
      </div>
    </div>

    {/* SEO-облако локаций */}
    <div className="border-t border-border/50 px-4 py-4">
      <div className="container">
        <p className="text-xs text-muted-foreground/60 leading-relaxed">
          Оперативно осуществляем замер и монтаж в городах:{' '}
          <span>Люберцы, Котельники, Реутов, Балашиха, Дзержинский, Лыткарино, Видное, Железнодорожный,
          Жуковский, Раменское, Домодедово, Подольск, Красногорск, Химки, Мытищи</span>{' '}
          и любых населённых пунктах в радиусе 25 км от МКАД.
        </p>
      </div>
    </div>

    <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Сталь Групп. Собственное производство. Люберцы.
    </div>
  </footer>
);

export default Footer;
