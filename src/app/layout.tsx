'use client';

import './globals.css';
import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isLoginPage = pathname === '/' || pathname === '/login';

  return (
    <html lang="en">
      <head>
        <title>TuneVault</title>
        <meta name="description" content="Temukan dan simpan musik favoritmu!" />
        <link rel="icon" href="/logo.png" />
        <style>{`
          body {
            margin: 0;
            height: 100vh;
            overflow: hidden;
            font-family: 'Segoe UI', sans-serif;
            background: #121212;
            color: #fff;
          }

          .layout-container {
            display: flex;
            height: 100vh;
            width: 100%;
            flex-direction: row;
          }

          .main-content {
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            background: #121212;
          }

          @media (max-width: 768px) {
            .layout-container {
              flex-direction: column;
            }

            .main-content {
              height: calc(100vh - 60px);
            }
          }
        `}</style>
      </head>
      <body>
        <div className="layout-container">
          {!isLoginPage && <Sidebar />}
          <div className="main-content">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
