'use client'

import { useEffect, useState } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { useBookingModal } from "@/contexts/BookingModalContext";
import { translations } from "@/lib/translations";

export default function BookingModal() {
  const { isOpen, closeModal: onClose } = useBookingModal();
  const { language } = useLanguage();
  const t = translations[language];
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    comment: ''
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  // Загрузка занятых времён при изменении даты
  useEffect(() => {
    const loadBookedTimes = async () => {
      if (!formData.date) {
        setBookedTimes([]);
        return;
      }

      try {
        const { hairLabGetAllBookings } = await import('@/lib/api');
        const allBookings = await hairLabGetAllBookings();
        const bookedTimesForDate = allBookings
          .filter(
            (booking) =>
              booking.date === formData.date && booking.status === 'confirmed'
          )
          .map((booking) => booking.time);
        setBookedTimes(bookedTimesForDate);
      } catch (error) {
        console.error('Error loading booked times:', error);
      }
    };

    loadBookedTimes();
  }, [formData.date]);

  useEffect(() => {
    const form = document.getElementById('bookingForm') as HTMLFormElement | null;
    const nameEl = document.getElementById('bookingName') as HTMLInputElement | null;
    const phoneEl = document.getElementById('bookingPhone') as HTMLInputElement | null;

    if (!form || !nameEl || !phoneEl) return;

    const formatPhone = (raw: string) => {
      let digits = raw.replace(/\D/g, '');
      if (digits.startsWith('8')) digits = '7' + digits.slice(1);
      if (digits.length && !digits.startsWith('7')) digits = '7' + digits;
      if (digits.length > 11) digits = digits.slice(0, 11);

      let out = '+7';
      if (digits.length > 1) out += ' (' + digits.slice(1, 4);
      if (digits.length > 4) out += ') ' + digits.slice(4, 7);
      if (digits.length > 7) out += '-' + digits.slice(7, 9);
      if (digits.length > 9) out += '-' + digits.slice(9, 11);
      return out;
    };

    const onPhoneInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const caret = target.selectionStart ?? 0;
      const before = target.value.slice(0, caret);
      const formatted = formatPhone(target.value);
      target.value = formatted;
      target.setSelectionRange(before.length, before.length);
      setFormData(prev => ({ ...prev, phone: formatted }));

      if (target.classList.contains('error') && formatted.replace(/\D/g, '').length === 11) {
        validate(target);
      }
    };

    const onPhoneKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' && (e.target as HTMLInputElement).value.length <= 4) {
        e.preventDefault();
        (e.target as HTMLInputElement).value = '';
        setFormData(prev => ({ ...prev, phone: '' }));
      }
    };

    phoneEl.addEventListener('input', onPhoneInput);
    phoneEl.addEventListener('keydown', onPhoneKeydown);

    const validate = (field: HTMLInputElement) => {
      const val = field.value.trim();
      let ok = true;

      if (field === nameEl) {
        ok = val.length >= 2;
      } else if (field === phoneEl) {
        const digits = val.replace(/\D/g, '');
        ok = digits.length === 11 && digits.startsWith('7');
      }

      field.classList.toggle('error', !ok);
      setErrors(prev => ({ ...prev, [field.id]: !ok }));
      return ok;
    };

    nameEl.addEventListener('blur', () => validate(nameEl));
    phoneEl.addEventListener('blur', () => validate(phoneEl));

    const onSubmit = async (e: SubmitEvent) => {
      e.preventDefault();
      
      // Проверка авторизации
      const token = localStorage.getItem('hairlab_token');
      if (!token) {
        alert(language === 'ru' 
          ? 'Для бронирования необходимо войти в аккаунт. Пожалуйста, войдите через кнопку входа в шапке сайта.' 
          : 'You need to login to make a booking. Please login using the login button in the header.');
        return;
      }
      
      const okName = validate(nameEl);
      const okPhone = validate(phoneEl);
      const okService = formData.service.length > 0;
      const okDate = formData.date.length > 0;
      const okTime = formData.time.length > 0;

      setErrors({
        name: !okName,
        phone: !okPhone,
        service: !okService,
        date: !okDate,
        time: !okTime
      });

      if (okName && okPhone && okService && okDate && okTime) {
        setIsSubmitting(true);
        
        try {
          // Импортируем API функции
          const { hairLabCheckAvailability, hairLabCreateBooking } = await import('@/lib/api');
          
          // Проверяем доступность времени
          const availabilityCheck = await hairLabCheckAvailability({
            date: formData.date,
            time: formData.time
          });
          
          if (!availabilityCheck.available) {
            setIsSubmitting(false);
            alert(language === 'ru' 
              ? `Это время уже занято. Пожалуйста, выберите другое время.` 
              : `This time slot is already booked. Please select another time.`);
            return;
          }
          
          // Отправка на сервер
          await hairLabCreateBooking(token, {
            service: formData.service,
            date: formData.date,
            time: formData.time,
            comment: formData.comment || undefined
          });
          
          setIsSubmitting(false);
          alert(language === 'ru' 
            ? 'Запись успешно оформлена! Мы свяжемся с вами в ближайшее время.' 
            : 'Booking successfully created! We will contact you soon.');
          onClose();
          setFormData({ name: '', phone: '', service: '', date: '', time: '', comment: '' });
        } catch (error) {
          setIsSubmitting(false);
          console.error('Booking error:', error);
          
          // Проверяем, не истёк ли токен
          if (error instanceof Error && error.message.includes('401')) {
            localStorage.removeItem('hairlab_token');
            localStorage.removeItem('hairlab_phone');
            alert(language === 'ru' 
              ? 'Сессия истекла. Пожалуйста, войдите снова.' 
              : 'Session expired. Please login again.');
          } else {
            alert(language === 'ru' 
              ? 'Ошибка при создании бронирования. Пожалуйста, попробуйте позже.' 
              : 'Error creating booking. Please try again later.');
          }
        }
      }
    };

    form.addEventListener('submit', onSubmit);

    return () => {
      phoneEl.removeEventListener('input', onPhoneInput);
      phoneEl.removeEventListener('keydown', onPhoneKeydown);
      nameEl.removeEventListener('blur', () => validate(nameEl));
      phoneEl.removeEventListener('blur', () => validate(phoneEl));
      form.removeEventListener('submit', onSubmit);
    };
  }, [isOpen, formData, language, onClose]);

  if (!isOpen) return null;

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal glass-border" onClick={(e) => e.stopPropagation()}>
        <button className="booking-modal__close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="booking-modal__header">
          <h2 className="booking-modal__title">{t.bookingTitle}</h2>
          <p className="booking-modal__subtitle">{t.bookingSubtitle}</p>
        </div>

        <form id="bookingForm" className="booking-modal__form">
          <div className="booking-modal__row">
            <div className="booking-modal__field">
              <label htmlFor="bookingName" className="booking-modal__label">
                {t.bookingName} <span className="required">*</span>
              </label>
              <input
                type="text"
                id="bookingName"
                className="booking-modal__input"
                placeholder={t.bookingNamePlaceholder}
                value={formData.name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  if (errors.name && e.target.value.trim().length >= 2) {
                    setErrors(prev => ({ ...prev, name: false }));
                    e.target.classList.remove('error');
                  }
                }}
                required
              />
              {errors.name && <span className="booking-modal__error">{t.bookingErrorName}</span>}
            </div>

            <div className="booking-modal__field">
              <label htmlFor="bookingPhone" className="booking-modal__label">
                {t.bookingPhone} <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="bookingPhone"
                className="booking-modal__input"
                placeholder={t.bookingPhonePlaceholder}
                value={formData.phone}
                required
              />
              {errors.phone && <span className="booking-modal__error">{t.bookingErrorPhone}</span>}
            </div>
          </div>

          <div className="booking-modal__row">
            <div className="booking-modal__field">
              <label htmlFor="bookingService" className="booking-modal__label">
                {t.bookingService} <span className="required">*</span>
              </label>
              <select
                id="bookingService"
                className="booking-modal__input booking-modal__select"
                value={formData.service}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, service: e.target.value }));
                  if (errors.service && e.target.value.length > 0) {
                    setErrors(prev => ({ ...prev, service: false }));
                  }
                }}
                required
              >
                <option value="">{t.bookingServicePlaceholder}</option>
                <option value="women-haircut">{t.bookingService1}</option>
                <option value="men-haircut">{t.bookingService2}</option>
                <option value="coloring">{t.bookingService3}</option>
                <option value="styling">{t.bookingService4}</option>
                <option value="beard-shave">{t.bookingService5}</option>
                <option value="complete-care">{t.bookingService6}</option>
              </select>
              {errors.service && <span className="booking-modal__error">{t.bookingErrorService}</span>}
            </div>

            <div className="booking-modal__field">
              <label htmlFor="bookingDate" className="booking-modal__label">
                {t.bookingDate} <span className="required">*</span>
              </label>
              <input
                type="date"
                id="bookingDate"
                className="booking-modal__input"
                value={formData.date}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, date: e.target.value }));
                  if (errors.date && e.target.value.length > 0) {
                    setErrors(prev => ({ ...prev, date: false }));
                  }
                }}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              {errors.date && <span className="booking-modal__error">{t.bookingErrorDate}</span>}
            </div>
          </div>

          <div className="booking-modal__field">
            <label className="booking-modal__label">
              {t.bookingTime} <span className="required">*</span>
            </label>
            <div className="booking-time-slots">
              {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map((time) => {
                const isBooked = bookedTimes.includes(time);
                return (
                  <button
                    key={time}
                    type="button"
                    className={`booking-time-slot ${formData.time === time ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                    onClick={() => {
                      if (!isBooked) {
                        setFormData(prev => ({ ...prev, time }));
                        if (errors.time) {
                          setErrors(prev => ({ ...prev, time: false }));
                        }
                      }
                    }}
                    disabled={isBooked}
                    style={isBooked ? {
                      background: 'rgba(128, 128, 128, 0.3)',
                      color: 'rgba(255, 255, 255, 0.4)',
                      cursor: 'not-allowed',
                      border: '1px solid rgba(128, 128, 128, 0.3)'
                    } : {}}
                  >
                    {time}
                    {isBooked && ' ✕'}
                  </button>
                );
              })}
            </div>
            {errors.time && <span className="booking-modal__error">{t.bookingErrorTime}</span>}
          </div>

          <div className="booking-modal__field">
            <label htmlFor="bookingComment" className="booking-modal__label">
              {t.bookingComment}
            </label>
            <textarea
              id="bookingComment"
              className="booking-modal__input booking-modal__textarea"
              placeholder={t.bookingCommentPlaceholder}
              rows={4}
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            />
          </div>

          <div className="booking-modal__actions">
            <button
              type="button"
              className="booking-modal__button booking-modal__button--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t.bookingCancel}
            </button>
            <button
              type="submit"
              className="booking-modal__button booking-modal__button--primary hero__left-link"
              disabled={isSubmitting}
            >
              {isSubmitting ? t.bookingSubmitting : t.bookingSubmit}
            </button>
          </div>

          <div className="booking-modal__info">
            {t.bookingAgreement} <a href="#!">{t.bookingAgreementLink}</a>
          </div>
        </form>
      </div>
    </div>
  );
}
