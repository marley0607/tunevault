'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
      alert('Harap isi semua kolom.');
      return;
    }

    // Simpan data user ke localStorage
    localStorage.setItem('user', trimmedUsername);
    localStorage.setItem('email', trimmedEmail);

    // Cek apakah playlist untuk user ini sudah ada
    const userPlaylistKey = `playlist_${trimmedUsername}`;
    const existing = localStorage.getItem(userPlaylistKey);
    if (!existing) {
      localStorage.setItem(userPlaylistKey, JSON.stringify([]));
    }

    // Arahkan ke home
    router.push('/home');
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>TuneVault</h1>
        <form
          onSubmit={handleLogin}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nama pengguna"
            style={inputStyle}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={inputStyle}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

// ==== STYLE ====

const containerStyle = {
  height: '100vh',
  backgroundColor: '#121212',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const cardStyle = {
  backgroundColor: '#1e1e1e',
  padding: '40px',
  borderRadius: '16px',
  boxShadow: '0 0 15px rgba(255, 0, 128, 0.3)',
  width: '320px',
  textAlign: 'center' as const,
};

const titleStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: '20px',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '8px',
  border: 'none',
  outline: 'none',
  fontSize: '16px',
};

const buttonStyle = {
  padding: '10px',
  backgroundColor: '#ff2ea4',
  border: 'none',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  cursor: 'pointer',
};
