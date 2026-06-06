'use client';

import type { HairLabBookingWithUser } from '@/lib/api';
import { formatBookingDate, getServiceName, getStatusLabel } from '@/lib/bookingHelpers';

type MasterBookingCardProps = {
  booking: HairLabBookingWithUser;
  language?: 'ru' | 'en';
  showComment?: boolean;
};

export default function MasterBookingCard({
  booking,
  language = 'ru',
  showComment = false,
}: MasterBookingCardProps) {
  return (
    <article className="master-booking-card">
      <div className="master-booking-card__header">
        <div>
          <p className="master-booking-card__name">{booking.user.name || 'Без имени'}</p>
          <p className="master-booking-card__phone">{booking.user.phone}</p>
        </div>
        <span className={`master-bookings__status master-bookings__status--${booking.status}`}>
          {getStatusLabel(booking.status, language)}
        </span>
      </div>

      <div className="master-booking-card__body">
        <div className="master-booking-card__row">
          <span className="master-booking-card__label">Услуга</span>
          <span className="master-booking-card__value">
            {getServiceName(booking.service, language)}
          </span>
        </div>
        <div className="master-booking-card__row">
          <span className="master-booking-card__label">Дата</span>
          <span className="master-booking-card__value">
            {formatBookingDate(booking.date, language)}
          </span>
        </div>
        <div className="master-booking-card__row">
          <span className="master-booking-card__label">Время</span>
          <span className="master-booking-card__value">{booking.time}</span>
        </div>
        {showComment && booking.comment && (
          <div className="master-booking-card__row master-booking-card__row--comment">
            <span className="master-booking-card__label">Комментарий</span>
            <span className="master-booking-card__value">{booking.comment}</span>
          </div>
        )}
      </div>
    </article>
  );
}
