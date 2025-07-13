'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSongs } from '@/utils/api';
import Sidebar from '@/components/Sidebar';
import SongCard from '@/components/SongCard';

export default function HomePage() {
  const [songs, setSongs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [popularArtists, setPopularArtists] = useState<any[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const trendingRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    } else {
      setUsername(user);
      fetchSongs();
    }
  }, []);

  const fetchSongs = async () => {
    try {
      const data = await getSongs();
      setSongs(data);
      const topArtists = getTopArtists(data, 6);
      setPopularArtists(topArtists);
    } catch (err) {
      console.error('Gagal ambil lagu:', err);
    }
  };

  const getTopArtists = (songs: any[], topN: number) => {
    const count: Record<string, { name: string; image: string; count: number }> = {};
    songs.forEach((song) => {
      if (song.artist && song.image) {
        if (!count[song.artist]) {
          count[song.artist] = { name: song.artist, image: song.image, count: 1 };
        } else {
          count[song.artist].count += 1;
        }
      }
    });
    return Object.values(count).sort((a, b) => b.count - a.count).slice(0, topN);
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scroll = (direction: 'left' | 'right') => {
    if (trendingRef.current) {
      trendingRef.current.scrollBy({
        left: direction === 'right' ? 300 : -300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#121212',
        color: '#fff',
        height: '100vh',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '20px 16px',
          borderBottom: '1px solid #333',
          background: '#181818',
        }}
      >
        <input
          type="text"
          placeholder="Cari lagu, artis, genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInput}
        />
        <div style={{ fontSize: '16px' }}>Welcome, {username}</div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
        <h2 style={sectionTitle}>🔥 Trending Songs</h2>
        <div style={scrollWrapper}>
          <button onClick={() => scroll('left')} style={scrollBtn}>⬅</button>
          <div ref={trendingRef} style={scrollContainer}>
            {filteredSongs.map((song) => (
              <div key={song.id} style={{ flex: '0 0 auto' }}>
                <SongCard song={song} />
              </div>
            ))}
          </div>
          <button onClick={() => scroll('right')} style={scrollBtn}>➡</button>
        </div>

        {/* Popular Artists */}
        <div style={{ marginTop: '32px' }}>
          <h2 style={sectionTitle}>🎤 Popular Artists</h2>
          <div style={popularWrapper}>
            {popularArtists.map((artist, index) => (
              <div
                key={index}
                style={popularItem}
                onClick={() => setSearchTerm(artist.name)}
              >
                <img
                  src={artist.image}
                  alt={artist.name}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = '/default-artist.png';
                  }}
                  style={popularImage}
                />
                <span style={artistName}>{artist.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ===== STYLE =====
const searchInput: React.CSSProperties = {
  padding: '10px',
  borderRadius: '10px',
  fontSize: '15px',
  border: 'none',
  backgroundColor: '#fff',
  color: '#000',
  fontWeight: 'bold',
  width: '100%',
  maxWidth: '500px',
  boxSizing: 'border-box',
};

const sectionTitle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '12px',
};

const scrollWrapper: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'nowrap',
  overflowX: 'auto',
};

const scrollContainer: React.CSSProperties = {
  display: 'flex',
  gap: '20px',
  overflowX: 'auto',
  padding: '10px 0',
  scrollbarColor: '#222 #111',
  scrollbarWidth: 'thin',
};

const scrollBtn: React.CSSProperties = {
  fontSize: '20px',
  background: '#333',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  cursor: 'pointer',
  flex: '0 0 auto',
};

const popularWrapper: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '24px',
  flexWrap: 'wrap',
};

const popularItem: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
};

const popularImage: React.CSSProperties = {
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  objectFit: 'cover',
  boxShadow: '0 0 12px rgba(255, 0, 128, 0.4)',
  marginBottom: '10px',
};

const artistName: React.CSSProperties = {
  fontSize: '14px',
  color: '#eee',
  textAlign: 'center',
  fontWeight: 'bold',
};
