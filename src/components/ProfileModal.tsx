'use client'

import { useEffect, useState } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfileModal } from "@/contexts/ProfileModalContext";
import { translations } from "@/lib/translations";
import type { HairLabUser, HairLabBooking, HairLabBookingWithUser } from "@/lib/api";

export default function ProfileModal() {
  const { isOpen, closeModal: onClose } = useProfileModal();
  const { language } = useLanguage();
  const t = translations[language];
  const [user, setUser] = useState<HairLabUser | null>(null);
  const [bookings, setBookings] = useState<HairLabBooking[]>([]);
  const [masterBookings, setMasterBookings] = useState<HairLabBookingWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const isMaster = user?.role === 'master';

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
      loadUserData();
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  const loadUserData = async () => {
    const token = localStorage.getItem('hairlab_token');
    if (!token) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      const { hairLabGetMe, hairLabGetMyBookings, hairLabGetMasterBookings } = await import('@/lib/api');
      
      const userData = await hairLabGetMe(token);
      setUser(userData);
      
      // Загружаем разные данные в зависимости от роли
      if (userData.role === 'master') {
        const masterBookingsData = await hairLabGetMasterBookings(token);
        setMasterBookings(masterBookingsData);
        setBookings([]);
      } else {
        const bookingsData = await hairLabGetMyBookings(token);
        setBookings(bookingsData);
        setMasterBookings([]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      if (error instanceof Error && error.message.includes('401')) {
        localStorage.removeItem('hairlab_token');
        localStorage.removeItem('hairlab_phone');
        localStorage.removeItem('hairlab_role');
        alert(language === 'ru' ? 'Сессия истекла. Войдите снова.' : 'Session expired. Please login again.');
        onClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hairlab_token');
    localStorage.removeItem('hairlab_phone');
    localStorage.removeItem('hairlab_role');
    alert(language === 'ru' ? 'Вы вышли из аккаунта' : 'You have been logged out');
    onClose();
    window.location.reload();
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm(language === 'ru' ? 'Отменить эту запись?' : 'Cancel this booking?')) {
      return;
    }

    const token = localStorage.getItem('hairlab_token');
    if (!token) return;

    try {
      const { hairLabCancelBooking } = await import('@/lib/api');
      await hairLabCancelBooking(token, bookingId);
      alert(language === 'ru' ? 'Запись отменена' : 'Booking cancelled');
      loadUserData(); // Перезагрузить данные
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert(language === 'ru' ? 'Ошибка при отмене записи' : 'Error cancelling booking');
    }
  };

  const getServiceName = (serviceKey: string) => {
    const serviceMap: Record<string, string> = {
      'women-haircut': t.bookingService1,
      'men-haircut': t.bookingService2,
      'coloring': t.bookingService3,
      'styling': t.bookingService4,
      'beard-shave': t.bookingService5,
      'complete-care': t.bookingService6,
    };
    return serviceMap[serviceKey] || serviceKey;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal glass-border" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal__close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="login-modal__header">
          <h2 className="login-modal__title">
            {isMaster 
              ? (language === 'ru' ? 'Кабинет мастера' : 'Master Dashboard')
              : (language === 'ru' ? 'Личный кабинет' : 'Profile')
            }
          </h2>
          {isMaster && (
            <p className="login-modal__subtitle" style={{ marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
              {language === 'ru' ? 'Все записи клиентов' : 'All client bookings'}
            </p>
          )}
        </div>

        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>
            {language === 'ru' ? 'Загрузка...' : 'Loading...'}
          </div>
        ) : (
          <div className="login-modal__form">
            {/* Информация о пользователе */}
            <div className="login-modal__field">
              <label className="login-modal__label">
                {language === 'ru' ? 'Номер телефона' : 'Phone Number'}
              </label>
              <div style={{ 
                padding: '12px', 
                background: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px'
              }}>
                {user?.phone || '-'}
              </div>
            </div>

            {user?.name && (
              <div className="login-modal__field">
                <label className="login-modal__label">
                  {language === 'ru' ? 'Имя' : 'Name'}
                </label>
                <div style={{ 
                  padding: '12px', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px'
                }}>
                  {user.name}
                </div>
              </div>
            )}

            {/* Записи */}
            <div className="login-modal__field">
              <label className="login-modal__label">
                {isMaster 
                  ? (language === 'ru' ? 'Все записи' : 'All Bookings')
                  : (language === 'ru' ? 'Мои записи' : 'My Bookings')
                }
              </label>
              {isMaster ? (
                // Отображение записей для мастера
                masterBookings.length === 0 ? (
                  <div style={{ 
                    padding: '20px', 
                    textAlign: 'center', 
                    color: 'rgba(255, 255, 255, 0.6)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px'
                  }}>
                    {language === 'ru' ? 'Нет записей' : 'No bookings'}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                    {masterBookings.map((booking) => (
                      <div 
                        key={booking.id}
                        style={{
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '8px'
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>
                              {getServiceName(booking.service)}
                            </div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginBottom: '4px' }}>
                              📅 {formatDate(booking.date)} • 🕐 {booking.time}
                            </div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', marginTop: '4px' }}>
                              👤 {booking.user.name || booking.user.phone}
                            </div>
                            {booking.comment && (
                              <div style={{ 
                                color: 'rgba(255, 255, 255, 0.6)', 
                                fontSize: '13px',
                                marginTop: '4px'
                              }}>
                                💬 {booking.comment}
                              </div>
                            )}
                          </div>
                          <div style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: booking.status === 'confirmed' 
                              ? 'rgba(34, 197, 94, 0.2)' 
                              : 'rgba(239, 68, 68, 0.2)',
                            color: booking.status === 'confirmed' 
                              ? '#22c55e' 
                              : '#ef4444',
                            whiteSpace: 'nowrap'
                          }}>
                            {booking.status === 'confirmed' 
                              ? (language === 'ru' ? 'Подтверждено' : 'Confirmed')
                              : (language === 'ru' ? 'Отменено' : 'Cancelled')
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                // Отображение записей для клиента
                bookings.length === 0 ? (
                  <div style={{ 
                    padding: '20px', 
                    textAlign: 'center', 
                    color: 'rgba(255, 255, 255, 0.6)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px'
                  }}>
                    {language === 'ru' ? 'У вас пока нет записей' : 'No bookings yet'}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {bookings.map((booking) => (
                      <div 
                        key={booking.id}
                        style={{
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '8px'
                        }}>
                          <div>
                            <div style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>
                              {getServiceName(booking.service)}
                            </div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                              📅 {formatDate(booking.date)} • 🕐 {booking.time}
                            </div>
                            {booking.comment && (
                              <div style={{ 
                                color: 'rgba(255, 255, 255, 0.6)', 
                                fontSize: '13px',
                                marginTop: '4px'
                              }}>
                                💬 {booking.comment}
                              </div>
                            )}
                          </div>
                          <div style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: booking.status === 'confirmed' 
                              ? 'rgba(34, 197, 94, 0.2)' 
                              : 'rgba(239, 68, 68, 0.2)',
                            color: booking.status === 'confirmed' 
                              ? '#22c55e' 
                              : '#ef4444'
                          }}>
                            {booking.status === 'confirmed' 
                              ? (language === 'ru' ? 'Подтверждено' : 'Confirmed')
                              : (language === 'ru' ? 'Отменено' : 'Cancelled')
                            }
                          </div>
                        </div>
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            style={{
                              marginTop: '8px',
                              padding: '6px 12px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '6px',
                              color: '#ef4444',
                              fontSize: '13px',
                              cursor: 'pointer',
                              width: '100%'
                            }}
                          >
                            {language === 'ru' ? 'Отменить запись' : 'Cancel Booking'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

            {/* Кнопка выхода */}
            <div className="login-modal__actions">
              <button
                type="button"
                className="login-modal__button login-modal__button--primary hero__left-link"
                onClick={handleLogout}
                style={{ width: '100%' }}
              >
                {language === 'ru' ? 'Выйти из аккаунта' : 'Logout'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
