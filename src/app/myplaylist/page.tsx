'use client';

import { useEffect, useState } from 'react';
import { getSongs } from '@/utils/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  songs: string[]; // array of song ids
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
  }, []);

  const fetchSongs = async () => {
    const data = await getSongs();
    setSongs(data);
  };

  const fetchPlaylists = async () => {
    const res = await fetch(PLAYLIST_API);
    const data = await res.json();
    setPlaylists(Array.isArray(data) ? data : []);
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim() || selectedSongIds.length === 0) return;

    try {
      const res = await fetch(PLAYLIST_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPlaylistName, songs: selectedSongIds }),
      });
      if (!res.ok) throw new Error('Failed to save playlist');
      await res.json();
      setNewPlaylistName('');
      setSelectedSongIds([]);
      fetchPlaylists();
    } catch (error) {
      console.error('Error saving playlist:', error);
    }
  };

  const deletePlaylist = async (id: string) => {
    await fetch(`${PLAYLIST_API}/${id}`, { method: 'DELETE' });
    fetchPlaylists();
  };

  const toggleSongSelection = (id: string) => {
    setSelectedSongIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) return null;

  return (
    <div
      style={{
        background: '#121212',
        color: '#fff',
        minHeight: '100vh',
        padding: '20px',
        paddingTop: '90px',
      }}
    >
      <h1 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '20px' }}>🎧 My Playlist</h1>

      {/* Buat Playlist Baru */}
      <div style={{ background: '#1c1c1c', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
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

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {searchTerm &&
            filteredSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => toggleSongSelection(song.id)}
                style={{
                  width: '100%',
                  maxWidth: '160px',
                  borderRadius: '10px',
                  border: selectedSongIds.includes(song.id)
                    ? '2px solid #1db954'
                    : '1px solid #333',
                  padding: '10px',
                  cursor: 'pointer',
                  background: '#181818',
                  flexGrow: 1,
                }}
              >
                <img
                  src={song.image}
                  alt={song.title}
                  style={{
                    width: '100%',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                  }}
                />
                <div style={{ marginTop: '6px', fontSize: '14px', fontWeight: 'bold' }}>{song.title}</div>
                <div style={{ fontSize: '12px', color: '#ccc' }}>{song.artist}</div>
              </div>
            ))}
        </div>

        <button onClick={createPlaylist} style={saveBtnStyle}>
          💾 Simpan Playlist
        </button>
      </div>

      {/* Daftar Playlist */}
      <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>🎵 Playlist Saya</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {playlists.map((playlist) => {
          const thumbs = playlist.songs
            .slice(0, 4)
            .map((id: string) => songs.find((s) => s.id === id)?.image)
            .filter(Boolean);

          return (
            <div
              key={playlist.id}
              style={{
                width: '100%',
                maxWidth: '260px',
                background: '#1c1c1c',
                borderRadius: '10px',
                padding: '16px',
                position: 'relative',
                flexGrow: 1,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gridTemplateRows: '1fr 1fr',
                  gap: '4px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  marginBottom: '12px',
                }}
              >
                {thumbs.length > 0 ? (
                  thumbs.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="thumb"
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

// ========== Style ==========

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
