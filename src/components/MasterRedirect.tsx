'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hairLabGetMe } from '@/lib/api';

export default function MasterRedirect() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function redirectMaster() {
      const token = localStorage.getItem('hairlab_token');
      if (!token) return;

      try {
        const user = await hairLabGetMe(token);
        if (!cancelled && user.role === 'master') {
          router.replace('/master');
        }
      } catch {
        // ignore — user will stay on the public site
      }
    }

    redirectMaster();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return null;
}
