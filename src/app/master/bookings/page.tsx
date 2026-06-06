'use client';

import { useEffect, useMemo, useState } from 'react';
import MasterBookingCard from '@/components/MasterBookingCard';
import MasterSidebar from '@/components/MasterSidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { hairLabGetMe, hairLabGetMasterBookings, type HairLabBookingWithUser, type HairLabUser } from '@/lib/api';
import { formatBookingDate, getServiceName, getStatusLabel } from '@/lib/bookingHelpers';
import '../panel.css';
import '../page.css';

export default function MasterBookingsPage() {
  const { language } = useLanguage();
  const [user, setUser] = useState<HairLabUser | null>(null);
  const [bookings, setBookings] = useState<HairLabBookingWithUser[]>([]);
  const [search, setSearch] = useState('');
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
        console.error('Failed to load master bookings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return bookings;

    return bookings.filter((booking) => {
      const haystack = [
        booking.service,
        getServiceName(booking.service, language),
        booking.user.name,
        booking.user.phone,
        booking.date,
        booking.time,
        booking.comment,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [bookings, search, language]);

  const displayName = user?.name || user?.phone || 'Мастер';

  return (
    <div className="main-container">
      <MasterSidebar activePage="bookings" userName={displayName} />

      <div className="table-container--desktop">
        <div className="projects__main-container">
          <div className="projects__command-panel">
            <div className="projects__search">
              <img src="/assets/icons/search-icon.svg" alt="" />
              <input
                type="text"
                className="projects__search-field"
                placeholder="Поиск по клиенту, услуге, дате..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="master-stat-card master-stat-card--compact">
              <span className="master-stat-card__value master-stat-card__value--compact">
                {filteredBookings.length}
              </span>
              <span className="master-stat-card__label">записей</span>
            </div>
          </div>

          <div className="projects__table-container">
            {isLoading ? (
              <div className="master-bookings__empty">Загрузка записей...</div>
            ) : filteredBookings.length === 0 ? (
              <div className="master-bookings__empty">
                {search ? 'Ничего не найдено' : 'Пока нет записей от клиентов'}
              </div>
            ) : (
              <>
                <div className="master-table-wrap">
                  <table className="projects__table">
                    <thead className="projects__table-head">
                      <tr>
                        <th>Клиент</th>
                        <th>Телефон</th>
                        <th>Услуга</th>
                        <th>Дата</th>
                        <th>Время</th>
                        <th>Комментарий</th>
                        <th>Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td>
                            <p className="master-bookings__client-name">
                              {booking.user.name || '—'}
                            </p>
                          </td>
                          <td>{booking.user.phone}</td>
                          <td>{getServiceName(booking.service, language)}</td>
                          <td>{formatBookingDate(booking.date, language)}</td>
                          <td>{booking.time}</td>
                          <td>
                            <p className="master-bookings__comment">
                              {booking.comment || '—'}
                            </p>
                          </td>
                          <td>
                            <span
                              className={`master-bookings__status master-bookings__status--${booking.status}`}
                            >
                              {getStatusLabel(booking.status, language)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="master-bookings-cards">
                  {filteredBookings.map((booking) => (
                    <MasterBookingCard
                      key={booking.id}
                      booking={booking}
                      language={language}
                      showComment
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
