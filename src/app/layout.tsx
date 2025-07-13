// src/app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'TuneVault',
  description: 'Temukan dan simpan musik favoritmu!',
  icons: {
    icon: 'public/logo.png', // ✅ relatif dari public/
  },
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          body {
            margin: 0;
            height: 100vh;
            overflow: hidden;
            font-family: sans-serif;
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
            color: #fff;
          }

          @media (max-width: 768px) {
            .layout-container {
              flex-direction: column;
            }

            .main-content {
              flex: none;
              height: calc(100vh - 60px); /* Sisakan space jika sidebar diposisikan atas */
            }
          }
        `}</style>
      </head>
      <body>
        <div className="layout-container">
          <Sidebar />
          <div className="main-content">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
