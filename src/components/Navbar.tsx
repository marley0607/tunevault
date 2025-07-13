'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header
      style={{
        background: '#1c1c1c',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #333',
        boxShadow: '0 2px 10px rgba(255,0,128,0.1)',
      }}
    >
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <h1 style={{ color: '#fff', fontWeight: 'bold', fontSize: '22px' }}>🎵 TuneVault</h1>

        <nav style={{ display: 'flex', gap: '20px' }}>
          <Link href="/home" style={linkStyle}>Home</Link>
          <Link href="/favorites" style={linkStyle}>Favorites</Link>
          <Link href="/myplaylist" style={linkStyle}>My Playlist</Link>
        </nav>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span style={{ color: '#fff', fontSize: '15px' }}>
          Welcome, <strong>{username || 'User'}</strong>
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: '#ff4d4d',
            border: 'none',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

const linkStyle: React.CSSProperties = {
  color: '#ccc',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: '500',
  transition: 'color 0.2s ease-in-out',
};

export default Navbar;
