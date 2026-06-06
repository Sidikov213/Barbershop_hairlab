'use client'

import { useEffect, useState } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { useLoginModal } from "@/contexts/LoginModalContext";
import { translations } from "@/lib/translations";

type UserRole = 'client' | 'master' | null;

export default function LoginModal() {
  const { isOpen, closeModal: onClose } = useLoginModal();
  const { language } = useLanguage();
  const t = translations[language];
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [formData, setFormData] = useState({
    phone: '',
    code: ''
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
      // Сбрасываем форму при открытии
      setSelectedRole(null);
      setFormData({ phone: '', code: '' });
      setErrors({});
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    
    // Проверка номера телефона
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim() || phoneDigits.length < 10) {
      newErrors.phone = true;
    }
    
    // Проверка кода/пароля в зависимости от роли
    if (selectedRole === 'client') {
      if (formData.code.trim() !== '1111') {
        newErrors.code = true;
      }
    } else if (selectedRole === 'master') {
      if (formData.code.trim() !== '12345') {
        newErrors.code = true;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      return;
    }
    
    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Импортируем API функцию динамически
      const { hairLabLogin } = await import('@/lib/api');
      
      // Отправка на сервер
      const response = await hairLabLogin({
        phone: formData.phone,
        code: formData.code,
        role: selectedRole
      });
      
      // Сохраняем токен и роль в localStorage
      localStorage.setItem('hairlab_token', response.access_token);
      localStorage.setItem('hairlab_phone', formData.phone);
      localStorage.setItem('hairlab_role', selectedRole);
      
      setIsSubmitting(false);
      onClose();
      setFormData({ phone: '', code: '' });
      setSelectedRole(null);

      if (selectedRole === 'master') {
        window.location.href = '/master';
        return;
      }

      alert(language === 'ru' ? 'Вход выполнен успешно!' : 'Login successful!');
      window.location.reload();
    } catch (error) {
      setIsSubmitting(false);
      console.error('Login error:', error);
      const errorMessage = selectedRole === 'master'
        ? (language === 'ru' ? 'Ошибка входа. Проверьте номер телефона и пароль (12345).' : 'Login error. Check your phone number and password (12345).')
        : (language === 'ru' ? 'Ошибка входа. Проверьте номер телефона и код (1111).' : 'Login error. Check your phone number and code (1111).');
      alert(errorMessage);
    }
  };

  if (!isOpen) return null;

  // Экран выбора роли
  if (!selectedRole) {
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
              {language === 'ru' ? 'Выберите тип входа' : 'Select Login Type'}
            </h2>
            <p className="login-modal__subtitle">
              {language === 'ru' ? 'Выберите, как вы хотите войти в систему' : 'Choose how you want to login'}
            </p>
          </div>

          <div className="login-modal__role-selection">
            <button
              type="button"
              className="login-modal__role-button"
              onClick={() => setSelectedRole('client')}
            >
              <div className="login-modal__role-icon">👤</div>
              <div className="login-modal__role-content">
                <h3>{language === 'ru' ? 'Войти как клиент' : 'Login as Client'}</h3>
                <p>{language === 'ru' ? 'Для бронирования услуг' : 'To book services'}</p>
              </div>
            </button>

            <button
              type="button"
              className="login-modal__role-button"
              onClick={() => setSelectedRole('master')}
            >
              <div className="login-modal__role-icon">✂️</div>
              <div className="login-modal__role-content">
                <h3>{language === 'ru' ? 'Войти как мастер' : 'Login as Master'}</h3>
                <p>{language === 'ru' ? 'Для просмотра записей' : 'To view bookings'}</p>
              </div>
            </button>
          </div>

          <div className="login-modal__actions">
            <button
              type="button"
              className="login-modal__button login-modal__button--secondary"
              onClick={onClose}
            >
              {t.loginCancel}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Форма входа
  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal glass-border" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal__close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="login-modal__header">
          <button
            type="button"
            className="login-modal__back-button"
            onClick={() => setSelectedRole(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              fontSize: '14px',
              opacity: 0.7,
              transition: 'opacity 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {language === 'ru' ? 'Назад' : 'Back'}
          </button>
          <h2 className="login-modal__title">
            {selectedRole === 'master' 
              ? (language === 'ru' ? 'Вход для мастера' : 'Master Login')
              : t.loginTitle
            }
          </h2>
          <p className="login-modal__subtitle">
            {selectedRole === 'master'
              ? (language === 'ru' ? 'Введите номер телефона и пароль (12345)' : 'Enter phone number and password (12345)')
              : t.loginSubtitle
            }
          </p>
        </div>

        <form id="loginForm" className="login-modal__form" onSubmit={handleSubmit}>
          <div className="login-modal__field">
            <label htmlFor="loginPhone" className="login-modal__label">
              {t.loginPhone} <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="loginPhone"
              className={`login-modal__input ${errors.phone ? 'error' : ''}`}
              placeholder={t.loginPhonePlaceholder}
              value={formData.phone}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, phone: e.target.value }));
                if (errors.phone && e.target.value.trim()) {
                  setErrors(prev => ({ ...prev, phone: false }));
                }
              }}
              required
            />
            {errors.phone && <span className="login-modal__error">{t.loginErrorPhone}</span>}
          </div>

          <div className="login-modal__field">
            <label htmlFor="loginCode" className="login-modal__label">
              {selectedRole === 'master'
                ? (language === 'ru' ? 'Пароль' : 'Password')
                : t.loginCode
              } <span className="required">*</span>
            </label>
            <input
              type="text"
              id="loginCode"
              className={`login-modal__input ${errors.code ? 'error' : ''}`}
              placeholder={selectedRole === 'master'
                ? (language === 'ru' ? 'Введите пароль 12345' : 'Enter password 12345')
                : t.loginCodePlaceholder
              }
              value={formData.code}
              maxLength={selectedRole === 'master' ? 10 : 4}
              onChange={(e) => {
                // Разрешаем только цифры
                const value = e.target.value.replace(/\D/g, '');
                setFormData(prev => ({ ...prev, code: value }));
                if (errors.code) {
                  const isValid = selectedRole === 'master' 
                    ? value === '12345'
                    : value === '1111';
                  if (isValid) {
                    setErrors(prev => ({ ...prev, code: false }));
                  }
                }
              }}
              required
            />
            {errors.code && (
              <span className="login-modal__error">
                {selectedRole === 'master'
                  ? (language === 'ru' ? 'Неверный пароль. Введите 12345' : 'Invalid password. Enter 12345')
                  : t.loginErrorCode
                }
              </span>
            )}
          </div>

          <div className="login-modal__actions">
            <button
              type="button"
              className="login-modal__button login-modal__button--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t.loginCancel}
            </button>
            <button
              type="submit"
              className="login-modal__button login-modal__button--primary hero__left-link"
              disabled={isSubmitting}
            >
              {isSubmitting ? t.loginSubmitting : t.loginSubmit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
