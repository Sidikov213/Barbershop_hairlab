'use client';

import { useEffect } from 'react';
import { useLoginModal } from '@/contexts/LoginModalContext';

export default function LoginQueryHandler() {
  const { openModal } = useLoginModal();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'master') {
      openModal();
      window.history.replaceState({}, '', '/');
    }
  }, [openModal]);

  return null;
}
