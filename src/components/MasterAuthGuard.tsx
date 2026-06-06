'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { hairLabGetMe } from '@/lib/api';

type MasterAuthGuardProps = {
  children: ReactNode;
};

export default function MasterAuthGuard({ children }: MasterAuthGuardProps) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      const token = localStorage.getItem('hairlab_token');
      if (!token) {
        router.replace('/?login=master');
        return;
      }

      try {
        const user = await hairLabGetMe(token);
        if (cancelled) return;

        if (user.role !== 'master') {
          router.replace('/');
          return;
        }

        setIsReady(true);
      } catch {
        localStorage.removeItem('hairlab_token');
        localStorage.removeItem('hairlab_phone');
        localStorage.removeItem('hairlab_role');
        router.replace('/?login=master');
      }
    }

    verify();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!isReady) {
    return (
      <div className="master-loading">
        <div className="master-loading__spinner" />
        <p>Загрузка панели мастера...</p>
      </div>
    );
  }

  return <>{children}</>;
}
