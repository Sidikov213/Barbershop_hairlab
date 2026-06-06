'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import '@/app/master/panel.css';
import '@/app/master/page.css';

type MasterSidebarProps = {
  activePage?: 'dashboard' | 'bookings';
  userName?: string | null;
};

const MasterSidebar = ({ activePage = 'dashboard', userName }: MasterSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('hairlab_token');
    localStorage.removeItem('hairlab_phone');
    localStorage.removeItem('hairlab_role');
    router.push('/');
  };

  const navItems = [
    { href: '/master', label: 'Главная', page: 'dashboard' as const },
    { href: '/master/bookings', label: 'Записи', page: 'bookings' as const },
  ];

  return (
    <>
      <aside className="master-sidebar-desktop sidebar-container--desktop master-sidebar">
        <div className="master-sidebar__brand">
          <div className="master-sidebar__logo">HAIR LAB</div>
          <p className="master-sidebar__role">Панель мастера</p>
          {userName && <p className="master-sidebar__user">{userName}</p>}
        </div>

        <div className="sidebar__control-container--desktop">
          <div className="sidebar__nav-container--desktop">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={activePage === item.page ? 'sidebar__nav--active' : 'sidebar__nav'}
              >
                {item.page === 'dashboard' ? 'Главная' : 'Записи клиентов'}
              </Link>
            ))}
          </div>

          <div className="sidebar__settings-container--desktop">
            <button type="button" className="sidebar__settings-button" onClick={() => router.push('/')}>
              Перейти на сайт
            </button>
            <button
              type="button"
              className="sidebar__settings-button master-sidebar__logout"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </div>
        </div>
      </aside>

      <header className="master-mobile-header">
        <div className="master-mobile-header__brand">
          <span className="master-mobile-header__logo">HAIR LAB</span>
          <span className="master-mobile-header__subtitle">Панель мастера</span>
        </div>
        {userName && <p className="master-mobile-header__user">{userName}</p>}
      </header>

      <nav className="master-mobile-nav" aria-label="Навигация панели мастера">
        {navItems.map((item) => {
          const isActive = pathname === item.href || activePage === item.page;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`master-mobile-nav__item${isActive ? ' master-mobile-nav__item--active' : ''}`}
            >
              <span className="master-mobile-nav__icon" aria-hidden="true">
                {item.page === 'dashboard' ? '⌂' : '☰'}
              </span>
              <span className="master-mobile-nav__label">{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          className="master-mobile-nav__item"
          onClick={() => router.push('/')}
        >
          <span className="master-mobile-nav__icon" aria-hidden="true">↗</span>
          <span className="master-mobile-nav__label">Сайт</span>
        </button>
        <button type="button" className="master-mobile-nav__item master-mobile-nav__item--logout" onClick={handleLogout}>
          <span className="master-mobile-nav__icon" aria-hidden="true">⎋</span>
          <span className="master-mobile-nav__label">Выйти</span>
        </button>
      </nav>
    </>
  );
};

export default MasterSidebar;
