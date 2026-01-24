'use client'

import { useEffect } from 'react';

type Props = {
  items?: { question: string; answer: string }[];
};

export default function FaqAccordion() {
  useEffect(() => {
    const initAccordion = () => {
      const questions = Array.from(
        document.querySelectorAll<HTMLElement>('.faq__questions-element')
      );
      if (!questions.length) return;

      const closeAll = (except?: HTMLElement) => {
        questions.forEach((el) => {
          if (el !== except) {
            el.classList.remove('open');
            el.setAttribute('aria-expanded', 'false');
          }
        });
      };

      const toggle = (el: HTMLElement) => {
        const wasOpen = el.classList.contains('open');
        closeAll(el);
        if (!wasOpen) {
          el.classList.add('open');
          el.setAttribute('aria-expanded', 'true');
        } else {
          el.classList.remove('open');
          el.setAttribute('aria-expanded', 'false');
        }
      };

      // Сохраняем ссылки на обработчики для очистки
      const cleanupFunctions: Array<() => void> = [];

      questions.forEach((el) => {
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-expanded', 'false');

        const onClick = () => {
          toggle(el);
        };
        
        const onKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle(el);
          }
        };

        // Добавляем обработчик на весь элемент
        el.addEventListener('click', onClick);
        el.addEventListener('keydown', onKeyDown);

        // Также добавляем обработчик на плюсик, если он есть
        const plusIcon = el.querySelector<HTMLElement>('.plus');
        if (plusIcon) {
          plusIcon.addEventListener('click', onClick);
          cleanupFunctions.push(() => {
                plusIcon.removeEventListener('click', onClick);
          });
        }

        // Сохраняем функцию очистки для этого элемента
        cleanupFunctions.push(() => {
          el.removeEventListener('click', onClick);
          el.removeEventListener('keydown', onKeyDown);
        });
      });

      // Возвращаем функцию очистки для всех обработчиков
      return () => {
        cleanupFunctions.forEach(cleanup => cleanup());
      };
    };

    // Пытаемся инициализировать сразу
    let cleanup: (() => void) | undefined = initAccordion();

    // Если элементы еще не найдены, пробуем через небольшую задержку
    if (!cleanup) {
      let timeoutCleanup: (() => void) | undefined;
      const timeoutId = setTimeout(() => {
        timeoutCleanup = initAccordion();
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        if (timeoutCleanup) timeoutCleanup();
      };
    }

    return cleanup;
  }, []);

  return null;
}