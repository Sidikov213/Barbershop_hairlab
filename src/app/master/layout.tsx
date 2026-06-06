import type { Metadata } from 'next';
import MasterAuthGuard from '@/components/MasterAuthGuard';
import styles from './layout.module.css';
import './page.css';

export const metadata: Metadata = {
  title: 'Hair Lab — Панель мастера',
  description: 'Кабинет мастера Hair Lab',
};

export default function MasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles['master-layout']}>
      <MasterAuthGuard>{children}</MasterAuthGuard>
    </div>
  );
}
