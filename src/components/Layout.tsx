import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const WHATSAPP = 'https://wa.me/79999802464?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21+%D0%9D%D1%83%D0%B6%D0%B5%D0%BD+%D1%80%D0%B0%D1%81%D1%87%D1%91%D1%82+%D0%B7%D0%B0%D0%B1%D0%BE%D1%80%D0%B0.';

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col bg-background">
    <Header />
    <main className="flex-1 pb-16 md:pb-0">{children}</main>
    <Footer />

    {/* Mobile Sticky Bar — виден только на мобильных */}
    <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-border bg-card/95 backdrop-blur">
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 bg-[#25D366] py-3.5 font-display text-sm font-bold uppercase tracking-wide text-white"
      >
        {/* WhatsApp иконка через emoji (svg нельзя) */}
        <span className="text-lg">💬</span>
        WhatsApp
      </a>
      <Link
        to="/calculator"
        className="flex flex-1 items-center justify-center gap-2 bg-primary py-3.5 font-display text-sm font-bold uppercase tracking-wide text-primary-foreground"
      >
        <span className="text-lg">📐</span>
        Рассчитать забор
      </Link>
    </div>
  </div>
);

export default Layout;
