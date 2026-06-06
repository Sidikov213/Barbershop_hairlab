'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '@/app/master/panel.css';
import '@/app/master/page.css';

type MasterSidebarProps = {
  activePage?: 'dashboard' | 'bookings';
  userName?: string | null;
};

const MasterSidebar = ({ activePage = 'dashboard', userName }: MasterSidebarProps) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('hairlab_token');
    localStorage.removeItem('hairlab_phone');
    localStorage.removeItem('hairlab_role');
    router.push('/');
  };

  return (
    <div className="sidebar-container--desktop master-sidebar">
      <div className="master-sidebar__brand">
        <div className="master-sidebar__logo">HAIR LAB</div>
        <p className="master-sidebar__role">Панель мастера</p>
        {userName && <p className="master-sidebar__user">{userName}</p>}
      </div>

      <div className="sidebar__control-container--desktop">
        <div className="sidebar__nav-container--desktop">
          <Link
            href="/master"
            className={activePage === 'dashboard' ? 'sidebar__nav--active' : 'sidebar__nav'}
          >
            Главная
          </Link>
          <Link
            href="/master/bookings"
            className={activePage === 'bookings' ? 'sidebar__nav--active' : 'sidebar__nav'}
          >
            Записи клиентов
          </Link>
        </div>

        <div className="sidebar__settings-container--desktop">
          <button type="button" className="sidebar__settings-button" onClick={() => router.push('/')}>
            Перейти на сайт
          </button>
          <button type="button" className="sidebar__settings-button master-sidebar__logout" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default MasterSidebar;
