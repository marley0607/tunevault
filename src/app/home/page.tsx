'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSongs } from '@/utils/api';
import SongCard from '@/components/SongCard';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar'; // Pastikan Sidebar dipanggil di Home

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  image: string;
  audioUrl: string;
  favorite: boolean;
  Since: string;
  lyrics: string;
  mood?: string;
}

interface Artist {
  name: string;
  image: string;
  count: number;
}

export default function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [popularArtists, setPopularArtists] = useState<Artist[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    } else {
      setUsername(user);
      fetchSongs();
    }
  }, [router]);

  const fetchSongs = async () => {
    try {
      const data: Song[] = await getSongs();
      setSongs(data);
      const topArtists = getTopArtists(data, 10);
      setPopularArtists(topArtists);
    } catch (err) {
      console.error('Gagal ambil lagu:', err);
    }
  };

  const getTopArtists = (songs: Song[], topN: number): Artist[] => {
    const count: Record<string, Artist> = {};
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
      song.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={pageWrapper}>
      <Sidebar />

      <div style={containerStyle}>
        <style>{`
          @media (max-width: 768px) {
            .scroll-container {
              gap: 12px !important;
            }

            .artist-card img {
              width: 90px !important;
              height: 90px !important;
            }

            .artist-card p {
              font-size: 13px !important;
            }

            .song-card {
              min-width: 160px !important;
            }
          }
        `}</style>

        {/* Header */}
        <header style={headerStyle}>
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
        <main style={mainStyle}>
          <h2 style={sectionTitle}>🔥 Trending Songs</h2>
          <div style={scrollWrapper}>
            <div style={scrollContainer} className="scroll-container">
              {filteredSongs.map((song) => (
                <div key={song.id} style={{ flex: '0 0 auto', minWidth: '200px' }} className="song-card">
                  <SongCard song={song} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <h2 style={sectionTitle}>🎤 Popular Artists</h2>
            <div style={scrollWrapper}>
              <div style={scrollContainer} className="scroll-container">
                {popularArtists.map((artist, index) => (
                  <div
                    key={index}
                    style={artistCardStyle}
                    onClick={() => setSearchTerm(artist.name)}
                    className="artist-card"
                  >
                    <Image
                      src={artist.image || '/default-artist.png'}
                      alt={artist.name}
                      width={120}
                      height={120}
                      style={artistImageStyle}
                      unoptimized
                    />
                    <p style={artistName}>{artist.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ===== STYLE =====
const pageWrapper: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

const containerStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  background: '#121212',
  color: '#fff',
  paddingBottom: '70px', // Tambahan supaya tidak ketutup sidebar mobile
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '20px 16px',
  borderBottom: '1px solid #333',
  background: '#181818',
};

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

const mainStyle: React.CSSProperties = {
  padding: '16px',
  flex: 1,
  overflowY: 'auto',
};

const sectionTitle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '12px',
};

const scrollWrapper: React.CSSProperties = {
  width: '100%',
  overflowX: 'auto',
};

const scrollContainer: React.CSSProperties = {
  display: 'flex',
  gap: '20px',
  padding: '10px 0',
  overflowX: 'auto',
  scrollbarColor: '#222 #111',
  scrollbarWidth: 'thin',
};

const artistCardStyle: React.CSSProperties = {
  minWidth: '120px',
  cursor: 'pointer',
  textAlign: 'center',
};

const artistImageStyle: React.CSSProperties = {
  width: '120px',
  height: '120px',
  borderRadius: '12px',
  objectFit: 'cover',
  boxShadow: '0 0 12px rgba(0,255,255,0.3)',
};

const artistName: React.CSSProperties = {
  marginTop: '8px',
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#fff',
};
