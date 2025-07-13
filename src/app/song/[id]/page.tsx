'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSongs, addToFavorites } from '@/utils/api';

export default function SongDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [song, setSong] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    fetchSong();
  }, []);

  const fetchSong = async () => {
    const data = await getSongs();
    const selected = data.find((s: any) => s.id === id);
    if (selected) {
      setSong(selected);
      const favorites = JSON.parse(sessionStorage.getItem('favorites') || '[]');
      setIsFavorited(favorites.includes(selected.id));
    }
  };

  const toggleFavorite = async () => {
    if (!song) return;

    let updatedFavorites: string[] = JSON.parse(sessionStorage.getItem('favorites') || '[]');
    if (isFavorited) {
      updatedFavorites = updatedFavorites.filter((fid) => fid !== song.id);
    } else {
      updatedFavorites.push(song.id);
      await addToFavorites(song.id);
    }
    sessionStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsFavorited(!isFavorited);
  };

  const handleBack = () => router.back();

  if (!song) return <div style={{ padding: '24px', color: '#fff' }}>Loading...</div>;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: '#121212',
        color: '#fff',
        padding: '20px',
        paddingTop: '80px',
      }}
    >
      {/* Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '32px',
          flexWrap: 'wrap',
        }}
      >
        {/* Gambar & Info */}
        <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
          <img
            src={song.image}
            alt={song.title}
            onError={(e) => ((e.currentTarget as HTMLImageElement).src = '/default-artist.png')}
            style={{
              width: '100%',
              borderRadius: '16px',
              marginBottom: '20px',
              boxShadow: '0 0 24px rgba(255, 0, 128, 0.3)',
            }}
          />
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '10px' }}>{song.title}</h1>
          <p style={{ fontSize: '16px', color: '#ccc', marginBottom: '4px' }}>{song.artist}</p>
          <p style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>Genre: {song.genre}</p>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
            Since: {song.since || 'Unknown'}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '10px' }}>
            <button
              onClick={toggleFavorite}
              style={{
                backgroundColor: isFavorited ? '#ff3b3b' : '#1db954',
                border: 'none',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                flex: '1',
                minWidth: '140px',
              }}
            >
              {isFavorited ? '★ Favorit' : '☆ Tambah ke Favorit'}
            </button>

            <button
              onClick={handleBack}
              style={{
                background: 'transparent',
                border: '1px solid #888',
                color: '#ccc',
                borderRadius: '30px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                flex: '1',
                minWidth: '100px',
              }}
            >
              ← Kembali
            </button>
          </div>
        </div>

        {/* Lirik */}
        <div style={{ flex: '2', minWidth: '280px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', marginTop: '10px' }}>
            Lirik Lagu
          </h2>
          <p
            style={{
              fontSize: '16px',
              lineHeight: '1.8',
              whiteSpace: 'pre-wrap',
              color: '#eee',
              background: '#1a1a1a',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 0 8px rgba(255, 0, 128, 0.1)',
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            {song.lyrics || 'Lirik tidak tersedia untuk lagu ini.'}
          </p>
        </div>
      </div>
    </div>
  );
}
