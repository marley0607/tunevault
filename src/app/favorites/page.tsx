'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSongs, removeFromFavorites } from '@/utils/api';
import Image from 'next/image';

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  image: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    } else {
      setUsername(user);
      fetchFavorites();
    }
  }, [router]);

  const fetchFavorites = async () => {
    try {
      const allSongs: Song[] = await getSongs();
      const sessionFavIds: string[] = JSON.parse(sessionStorage.getItem('favorites') || '[]');
      const filtered = allSongs.filter((song: Song) => sessionFavIds.includes(song.id));
      setFavorites(filtered);
    } catch (err) {
      console.error('Gagal ambil favorit:', err);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeFromFavorites(id);
      const currentFavorites: string[] = JSON.parse(sessionStorage.getItem('favorites') || '[]');
      const updatedFavorites = currentFavorites.filter((favId) => favId !== id);
      sessionStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      fetchFavorites();
    } catch (err) {
      console.error('Gagal hapus favorit:', err);
    }
  };

  const goToDetail = (id: string) => {
    router.push(`/song/${id}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#121212', color: '#fff' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #333',
          background: '#181818',
        }}
      >
        <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>⭐ Favorites</h1>
        <div style={{ fontSize: '16px' }}>Welcome, {username}</div>
      </header>

      <main style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        {favorites.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', marginTop: '40px' }}>Kamu belum menambahkan lagu ke favorit.</p>
        ) : (
          <div style={songListStyle}>
            {favorites.map((song) => (
              <div key={song.id} style={songCardStyle}>
                <div style={{ position: 'relative' }}>
                  <Image
                    src={song.image || '/default-artist.png'}
                    alt={song.title}
                    width={180}
                    height={180}
                    style={songImageStyle}
                    onClick={() => goToDetail(song.id)}
                  />
                  <div style={overlayPlay} onClick={() => goToDetail(song.id)}>▶</div>
                </div>
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  <h3 style={songTitleStyle}>{song.title}</h3>
                  <p style={songDetailStyle}>{song.artist} · {song.genre}</p>
                  <button
                    onClick={() => handleRemove(song.id)}
                    style={removeBtnStyle}
                  >
                    ✖ Hapus dari Favorite
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ===== STYLE =====

const songListStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '24px',
  justifyContent: 'center',
};

const songCardStyle: React.CSSProperties = {
  backgroundColor: '#1e1e1e',
  borderRadius: '14px',
  padding: '16px',
  width: '100%',
  maxWidth: '200px',
  boxShadow: '0 0 10px rgba(0,255,128,0.2)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'transform 0.2s ease',
};

const songImageStyle: React.CSSProperties = {
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
};

const songTitleStyle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 'bold',
  marginBottom: '4px',
  color: '#fff',
};

const songDetailStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#bbb',
};

const removeBtnStyle: React.CSSProperties = {
  marginTop: '10px',
  padding: '6px 12px',
  border: 'none',
  borderRadius: '20px',
  color: '#fff',
  fontSize: '13px',
  backgroundColor: '#d32f2f',
  cursor: 'pointer',
  transition: 'background 0.3s ease',
};

const overlayPlay: React.CSSProperties = {
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  backgroundColor: '#1db954',
  borderRadius: '50%',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '14px',
  cursor: 'pointer',
  boxShadow: '0 0 6px rgba(0,0,0,0.3)',
};
