'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import MasterSidebar from '@/components/MasterSidebar';
import { hairLabGetMe, hairLabGetMasterBookings, type HairLabBookingWithUser, type HairLabUser } from '@/lib/api';
import './panel.css';
import './page.css';

export default function MasterDashboardPage() {
  const [user, setUser] = useState<HairLabUser | null>(null);
  const [bookings, setBookings] = useState<HairLabBookingWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('hairlab_token');
      if (!token) return;

      try {
        const [userData, bookingsData] = await Promise.all([
          hairLabGetMe(token),
          hairLabGetMasterBookings(token),
        ]);
        setUser(userData);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Failed to load master dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayCount = bookings.filter((b) => b.date === today).length;
    const upcoming = bookings.filter((b) => b.date >= today).length;

    return {
      total: bookings.length,
      today: todayCount,
      upcoming,
    };
  }, [bookings]);

  const displayName = user?.name || user?.phone || 'Мастер';

  return (
    <div className="main-container">
      <MasterSidebar activePage="dashboard" userName={displayName} />

      <div className="table-container--desktop">
        {isLoading ? (
          <div className="master-loading" style={{ minHeight: '60vh' }}>
            <div className="master-loading__spinner" />
            <p>Загрузка данных...</p>
          </div>
        ) : (
          <>
            <div className="admin-welcome-content" style={{ marginBottom: '2em' }}>
              <h1 className="admin-welcome-title">
                Здравствуйте, <span className="admin-welcome-name">{displayName}</span>
              </h1>
              <p className="admin-welcome-subtitle">вы в панели управления записями Hair Lab.</p>
            </div>

            <div className="master-stats">
              <div className="master-stat-card">
                <span className="master-stat-card__value">{stats.total}</span>
                <span className="master-stat-card__label">Всего активных записей</span>
              </div>
              <div className="master-stat-card">
                <span className="master-stat-card__value">{stats.today}</span>
                <span className="master-stat-card__label">Записей на сегодня</span>
              </div>
              <div className="master-stat-card">
                <span className="master-stat-card__value">{stats.upcoming}</span>
                <span className="master-stat-card__label">Предстоящих записей</span>
              </div>
            </div>

            <div className="projects__main-container">
              <div className="projects__command-panel">
                <h2 style={{ margin: 0, color: '#fff', fontSize: '1.5rem', fontWeight: 500 }}>
                  Ближайшие записи
                </h2>
                <Link href="/master/bookings" className="projects__project-add" style={{ textDecoration: 'none' }}>
                  Все записи
                </Link>
              </div>

              <div className="projects__table-container">
                {bookings.length === 0 ? (
                  <div className="master-bookings__empty">Пока нет записей от клиентов</div>
                ) : (
                  <table className="projects__table">
                    <thead className="projects__table-head">
                      <tr>
                        <th>Клиент</th>
                        <th>Услуга</th>
                        <th>Дата</th>
                        <th>Время</th>
                        <th>Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 8).map((booking) => (
                        <tr key={booking.id}>
                          <td>
                            <div className="table-flex">
                              <p className="master-bookings__client-name" style={{ margin: 0 }}>
                                {booking.user.name || 'Без имени'}
                              </p>
                              <p className="master-bookings__client-phone">{booking.user.phone}</p>
                            </div>
                          </td>
                          <td>{booking.service}</td>
                          <td>{booking.date}</td>
                          <td>{booking.time}</td>
                          <td>
                            <span className="master-bookings__status master-bookings__status--confirmed">
                              Подтверждено
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
