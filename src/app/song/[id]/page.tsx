'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSongs, addToFavorites } from '@/utils/api';

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  image: string;
  audioUrl: string;
  lyrics: string;
  mood: string;
  favorite: boolean;
}

export default function SongDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

  const [song, setSong] = useState<Song | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (id) fetchSongById(id);
  }, [id]);

  const fetchSongById = async (songId: string) => {
    try {
      const data = await getSongs();
      const songsArray = Array.isArray(data) ? data : [];
      const selected = songsArray.find((s: Song) => s.id === songId);

      if (selected) {
        setSong(selected);

        if (typeof window !== 'undefined') {
          const favs: string[] = JSON.parse(sessionStorage.getItem('favorites') || '[]');
          setIsFavorited(favs.includes(songId));
        }
      }
    } catch (err) {
      console.error('Gagal mengambil lagu:', err);
    }
  };

  const toggleFavorite = async () => {
    if (!song || typeof window === 'undefined') return;

    let favs: string[] = JSON.parse(sessionStorage.getItem('favorites') || '[]');

    if (isFavorited) {
      favs = favs.filter((id) => id !== song.id);
    } else {
      favs.push(song.id);
      await addToFavorites(song.id);
    }

    sessionStorage.setItem('favorites', JSON.stringify(favs));
    setIsFavorited(!isFavorited);
  };

  const handleBack = () => router.back();

  if (!song) return <div style={{ padding: '24px', color: '#fff' }}>Loading...</div>;

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        {/* Info Lagu */}
        <div style={infoStyle}>
          <img
            src={song.image || '/default-artist.png'}
            alt={song.title}
            onError={(e) => ((e.currentTarget as HTMLImageElement).src = '/default-artist.png')}
            style={imageStyle}
          />
          <h1 style={titleStyle}>{song.title}</h1>
          <p style={artistStyle}>{song.artist}</p>
          <p style={infoText}>Genre: {song.genre || '-'}</p>
          <p style={infoText}>Mood: {song.mood || '-'}</p>

          <div style={buttonGroup}>
            <button onClick={toggleFavorite} style={{ ...favoriteButton, backgroundColor: isFavorited ? '#ff3b3b' : '#1db954' }}>
              {isFavorited ? '★ Favorit' : '☆ Tambah ke Favorit'}
            </button>
            <button onClick={handleBack} style={backButton}>
              ← Kembali
            </button>
          </div>
        </div>

        {/* Lirik Lagu */}
        <div style={lyricsWrapper}>
          <h2 style={lyricsTitle}>Lirik Lagu</h2>
          <p style={lyricsBox}>
            {song.lyrics || 'Lirik tidak tersedia untuk lagu ini.'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ===== STYLE =====
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  background: '#121212',
  color: '#fff',
  padding: '20px',
  paddingTop: '80px',
};

const wrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: '32px',
  flexWrap: 'wrap',
};

const infoStyle: React.CSSProperties = {
  flex: '1 1 300px',
  minWidth: '280px',
};

const imageStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: '16px',
  marginBottom: '20px',
  boxShadow: '0 0 24px rgba(255, 0, 128, 0.3)',
  objectFit: 'cover',
  maxHeight: '300px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: 'bold',
  marginBottom: '10px',
};

const artistStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#ccc',
  marginBottom: '4px',
};

const infoText: React.CSSProperties = {
  fontSize: '14px',
  color: '#999',
  marginBottom: '4px',
};

const buttonGroup: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  marginTop: '10px',
};

const favoriteButton: React.CSSProperties = {
  border: 'none',
  color: '#fff',
  padding: '10px 20px',
  borderRadius: '30px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px',
  flex: 1,
  minWidth: '140px',
};

const backButton: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #888',
  color: '#ccc',
  borderRadius: '30px',
  padding: '10px 20px',
  cursor: 'pointer',
  fontWeight: 500,
  fontSize: '14px',
  flex: 1,
  minWidth: '100px',
};

const lyricsWrapper: React.CSSProperties = {
  flex: 2,
  minWidth: '280px',
};

const lyricsTitle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 'bold',
  marginBottom: '16px',
  marginTop: '10px',
};

const lyricsBox: React.CSSProperties = {
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
};
