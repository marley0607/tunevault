// src/components/LayoutWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { ReactNode } from 'react';

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login'; // bisa tambah '/register' jika perlu

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      {!isAuthPage && <Sidebar />}
      <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
    </div>
  );
}
