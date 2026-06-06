import { translations } from '@/lib/translations';

type Language = 'ru' | 'en';

export function getServiceName(serviceKey: string, language: Language): string {
  const t = translations[language];
  const serviceMap: Record<string, string> = {
    'women-haircut': t.bookingService1,
    'men-haircut': t.bookingService2,
    'coloring': t.bookingService3,
    'styling': t.bookingService4,
    'beard-shave': t.bookingService5,
    'complete-care': t.bookingService6,
  };
  return serviceMap[serviceKey] || serviceKey;
}

export function formatBookingDate(dateStr: string, language: Language): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getStatusLabel(status: string, language: Language): string {
  if (status === 'confirmed') {
    return language === 'ru' ? 'Подтверждено' : 'Confirmed';
  }
  if (status === 'cancelled') {
    return language === 'ru' ? 'Отменено' : 'Cancelled';
  }
  if (status === 'completed') {
    return language === 'ru' ? 'Завершено' : 'Completed';
  }
  return status;
}
