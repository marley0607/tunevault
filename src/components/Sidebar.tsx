'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    setUsername(user || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    router.push('/');
  };

  return (
    <>
      <style>{`
        .sidebar {
          background: #1c1c1c;
          color: #fff;
          display: flex;
          justify-content: space-between;
          padding: 16px 24px;
          box-sizing: border-box;
        }

        .sidebar.desktop {
          flex-direction: column;
          width: 220px;
          height: 100vh;
          position: sticky;
          top: 0;
        }

        .sidebar.mobile {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          height: 60px;
          position: fixed;
          bottom: 0;
          left: 0;
          background: #1c1c1c;
          z-index: 100;
          border-top: 1px solid #333;
        }

        .logo {
          font-size: 18px;
          font-weight: bold;
        }

        .user {
          font-size: 12px;
          color: #aaa;
        }

        .logout {
          background-color: #ff4d4f;
          border: none;
          color: #fff;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 10px;
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
          <div className="logo" style={{ marginBottom: '20px' }}>TuneVault</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SidebarLink href="/home" label="Home" />
            <SidebarLink href="/favorites" label="Favorites" />
            <SidebarLink href="/myplaylist" label="My Playlist" />
          </nav>
        </div>
        <div>
          <div className="user" style={{ marginBottom: '10px' }}>
            Signed in as <br />
            <strong style={{ color: '#fff' }}>{username}</strong>
          </div>
          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Sidebar Mobile (Bottom Bar) */}
      <aside className="sidebar mobile">
        <SidebarLink href="/home" label="🏠" />
        <SidebarLink href="/favorites" label="❤️" />
        <SidebarLink href="/myplaylist" label="🎵" />
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ff4d4f',
            fontSize: '20px',
            cursor: 'pointer',
          }}
          title="Logout"
        >
          ⎋
        </button>
      </aside>
    </>
  );
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
        fontSize: '18px',
        backgroundColor: 'transparent',
        transition: 'background 0.3s',
      }}
    >
      {label}
    </Link>
  );
}
