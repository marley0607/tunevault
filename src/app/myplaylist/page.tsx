'use client';

import { useEffect, useState } from 'react';
import { getSongs } from '@/utils/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const PLAYLIST_API = 'https://686ffc0546567442480122e2.mockapi.io/playlist';

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

interface Playlist {
  id: string;
  name: string;
  songs: string[];
}

export default function MyPlaylistPage() {
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/');
    } else {
      setIsAuthenticated(true);
      fetchSongs();
      fetchPlaylists();
    }
  }, [router]);

  const fetchSongs = async () => {
    try {
      const data = await getSongs();
      const cleaned: Song[] = (Array.isArray(data) ? data : []).map((s: Partial<Song>) => ({
        id: s.id || '',
        title: s.title || 'Unknown',
        artist: s.artist || 'Unknown',
        genre: s.genre || 'Unknown',
        image: s.image || '/default-song.png',
        audioUrl: s.audioUrl || '',
        lyrics: s.lyrics || '',
        mood: s.mood || '',
        favorite: s.favorite ?? false,
      }));
      setSongs(cleaned);
    } catch (error) {
      console.error('Gagal mengambil lagu:', error);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const res = await fetch(PLAYLIST_API);
      const data: Playlist[] = await res.json();
      const valid = Array.isArray(data)
        ? data.map((p) => ({
            ...p,
            songs: Array.isArray(p.songs) ? p.songs : [],
          }))
        : [];
      setPlaylists(valid);
    } catch (error) {
      console.error('Gagal mengambil playlist:', error);
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) {
      alert('Nama playlist tidak boleh kosong');
      return;
    }
    if (selectedSongIds.length === 0) {
      alert('Pilih minimal satu lagu');
      return;
    }
    try {
      const res = await fetch(PLAYLIST_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPlaylistName, songs: selectedSongIds }),
      });
      if (!res.ok) throw new Error('Gagal menyimpan playlist');
      setNewPlaylistName('');
      setSelectedSongIds([]);
      fetchPlaylists();
    } catch (error) {
      console.error('Gagal membuat playlist:', error);
    }
  };

  const deletePlaylist = async (id: string) => {
    try {
      await fetch(`${PLAYLIST_API}/${id}`, { method: 'DELETE' });
      fetchPlaylists();
    } catch (error) {
      console.error('Gagal menghapus playlist:', error);
    }
  };

  const toggleSongSelection = (id: string) => {
    setSelectedSongIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) return null;

  return (
    <div style={{ background: '#121212', color: '#fff', minHeight: '100vh', padding: '20px', paddingTop: '90px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '20px' }}>🎧 My Playlist</h1>

      {/* Buat Playlist */}
      <div style={playlistBoxStyle}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>🆕 Buat Playlist Baru</h2>
        <input
          type="text"
          placeholder="Nama playlist..."
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Cari lagu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...inputStyle, marginBottom: '16px' }}
        />

        <div style={songListStyle}>
          {searchTerm &&
            filteredSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => toggleSongSelection(song.id)}
                style={{
                  ...songCardStyle,
                  border: selectedSongIds.includes(song.id)
                    ? '2px solid #1db954'
                    : '1px solid #333',
                }}
              >
                <Image
                  src={song.image}
                  alt={song.title}
                  width={160}
                  height={100}
                  style={songImageStyle}
                />
                <div style={{ marginTop: '6px', fontSize: '14px', fontWeight: 'bold' }}>{song.title}</div>
                <div style={{ fontSize: '12px', color: '#ccc' }}>{song.artist}</div>
              </div>
            ))}
        </div>

        <button onClick={createPlaylist} style={saveBtnStyle}>💾 Simpan Playlist</button>
      </div>

      {/* Daftar Playlist */}
      <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>🎵 Playlist Saya</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {playlists.map((playlist) => {
          const thumbs = (playlist.songs || [])
            .slice(0, 4)
            .map((id) => songs.find((s) => s.id === id)?.image)
            .filter(Boolean);

          return (
            <div key={playlist.id} style={playlistCardStyle}>
              <div style={gridThumbStyle}>
                {thumbs.length > 0 ? (
                  thumbs.map((img, i) => (
                    <Image
                      key={i}
                      src={img || '/default-song.png'}
                      alt="thumb"
                      width={130}
                      height={60}
                      style={{ width: '100%', height: '60px', objectFit: 'cover' }}
                    />
                  ))
                ) : (
                  <div style={{ height: '120px', background: '#333' }} />
                )}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>{playlist.name}</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Link
                  href={`/myplaylist/${playlist.id}`}
                  style={{
                    background: '#1db954',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    textDecoration: 'none',
                  }}
                >
                  Detail
                </Link>
                <button
                  onClick={() => deletePlaylist(playlist.id)}
                  style={{
                    background: '#ff4d4f',
                    color: '#fff',
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===== STYLES =====
const inputStyle: React.CSSProperties = {
  padding: '10px',
  borderRadius: '8px',
  width: '100%',
  background: '#2b2b2b',
  color: '#fff',
  border: '1px solid #444',
  marginBottom: '12px',
};

const saveBtnStyle: React.CSSProperties = {
  marginTop: '16px',
  background: '#1db954',
  padding: '10px 20px',
  borderRadius: '8px',
  border: 'none',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const playlistBoxStyle: React.CSSProperties = {
  background: '#1c1c1c',
  padding: '20px',
  borderRadius: '12px',
  marginBottom: '30px',
};

const songListStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
};

const songCardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '160px',
  borderRadius: '10px',
  padding: '10px',
  cursor: 'pointer',
  background: '#181818',
  flexGrow: 1,
};

const songImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100px',
  objectFit: 'cover',
  borderRadius: '6px',
};

const playlistCardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '260px',
  background: '#1c1c1c',
  borderRadius: '10px',
  padding: '16px',
  position: 'relative',
  flexGrow: 1,
};

const gridThumbStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: '1fr 1fr',
  gap: '4px',
  borderRadius: '6px',
  overflow: 'hidden',
  marginBottom: '12px',
};
