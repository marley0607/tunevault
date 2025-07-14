'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUsername(user);
      setIsLoggedIn(true);
    }
  }, []);

  // Sembunyikan Sidebar saat login
  if (pathname === '/login' || pathname === '/') return null;
  if (!isLoggedIn) return null;

  return (
    <>
      <style>{`
        .sidebar {
          background: rgba(28, 28, 28, 0.7);
          backdrop-filter: blur(12px);
          color: #fff;
          display: flex;
          justify-content: space-between;
          padding: 16px 24px;
          box-sizing: border-box;
          z-index: 99;
          box-shadow: 0 0 10px rgba(0, 255, 128, 0.15);
        }

        .sidebar.desktop {
          flex-direction: column;
          width: 220px;
          height: 100vh;
          position: sticky;
          top: 0;
          border-right: 1px solid #333;
        }

        .sidebar.mobile {
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          height: 60px;
          position: fixed;
          bottom: 0;
          left: 0;
          background: rgba(28, 28, 28, 0.7);
          backdrop-filter: blur(10px);
          border-top: 1px solid #333;
          box-shadow: 0 0 8px rgba(0, 255, 128, 0.2);
        }

        .logo {
          font-size: 22px;
          font-weight: bold;
          color: #1db954;
          margin-bottom: 30px;
          text-shadow: 0 0 6px #1db95488;
        }

        .user {
          font-size: 12px;
          color: #aaa;
          margin-bottom: 10px;
        }

        .logout {
          background-color: #ff4d4f;
          border: none;
          color: #fff;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: background 0.3s;
          box-shadow: 0 0 6px #ff4d4f80;
        }

        .logout:hover {
          background-color: #e04344;
        }

        @media (max-width: 768px) {
          .sidebar.desktop {
            display: none;
          }
        }

        @media (min-width: 769px) {
          .sidebar.mobile {
            display: none;
          }
        }
      `}</style>

      {/* Sidebar Desktop */}
      <aside className="sidebar desktop">
        <div>
          <div className="logo">TuneVault</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <SidebarLink href="/home" label="🏠 Home" />
            <SidebarLink href="/favorites" label="❤️ Favorites" />
            <SidebarLink href="/myplaylist" label="🎵 My Playlist" />
          </nav>
        </div>
        <div>
          <div className="user">
            Signed in as <br />
            <strong style={{ color: '#fff' }}>{username}</strong>
          </div>
          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      <aside className="sidebar mobile">
        <SidebarLink href="/home" label="🏠" />
        <SidebarLink href="/favorites" label="❤️" />
        <SidebarLink href="/myplaylist" label="🎵" />
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '20px',
            cursor: 'pointer',
            textShadow: '0 0 6px #ff4d4f',
          }}
          title="Logout"
        >
          ⎋
        </button>
      </aside>
    </>
  );

  function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    router.push('/login');
  }
}

function SidebarLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      style={{
        color: '#fff',
        textDecoration: 'none',
        padding: '8px 12px',
        borderRadius: '8px',
        fontWeight: 500,
        fontSize: '16px',
        backgroundColor: 'transparent',
        transition: 'all 0.3s ease',
        textShadow: '0 0 6px rgba(255, 255, 255, 0.3)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#1db95420')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {label}
    </Link>
  );
}
