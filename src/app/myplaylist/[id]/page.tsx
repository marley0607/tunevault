'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSongs } from '@/utils/api';

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

export default function PlaylistDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0];

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [editName, setEditName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingSongs, setIsEditingSongs] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);

  useEffect(() => {
    if (id) {
      fetchPlaylist(id);
      fetchSongs();
    }
  }, [id]);

  const fetchSongs = async () => {
    try {
      const data = await getSongs();
      setSongs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal ambil lagu:', err);
    }
  };

  const fetchPlaylist = async (playlistId: string) => {
    try {
      const res = await fetch(`${PLAYLIST_API}/${playlistId}`);
      const data = await res.json();
      setPlaylist({
        id: data.id,
        name: data.name,
        songs: Array.isArray(data.songs) ? data.songs : [],
      });
      setEditName(data.name);
    } catch (err) {
      console.error('Gagal ambil playlist:', err);
    }
  };

  const handleSaveName = async () => {
    if (!editName.trim() || !playlist) return;
    try {
      await fetch(`${PLAYLIST_API}/${playlist.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...playlist, name: editName }),
      });
      setIsEditingName(false);
      fetchPlaylist(playlist.id);
    } catch (err) {
      console.error('Gagal update nama:', err);
    }
  };

  const handleRemoveSong = async (songId: string) => {
    if (!playlist) return;
    const updatedSongs = playlist.songs.filter((sid) => sid !== songId);
    await updatePlaylist({ ...playlist, songs: updatedSongs });
  };

  const handleAddSong = async (songId: string) => {
    if (!playlist || playlist.songs.includes(songId)) return;
    const updatedSongs = [...playlist.songs, songId];
    await updatePlaylist({ ...playlist, songs: updatedSongs });
    setSearchTerm('');
    setFilteredSongs([]);
  };

  const updatePlaylist = async (updatedPlaylist: Playlist) => {
    try {
      await fetch(`${PLAYLIST_API}/${updatedPlaylist.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlaylist),
      });
      fetchPlaylist(updatedPlaylist.id);
    } catch (err) {
      console.error('Gagal update playlist:', err);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const result = songs.filter((s) =>
      s.title.toLowerCase().includes(term.toLowerCase()) ||
      s.artist.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredSongs(result);
  };

  const getSongById = (id: string) => songs.find((s) => s.id === id);

  if (!playlist) return <div style={{ padding: '24px', color: '#fff' }}>Loading...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#121212', color: '#fff' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '60px' }}>
        {/* Header */}
        <div style={headerStyle}>
          <img
            src={getSongById(playlist.songs[0])?.image || '/placeholder.jpg'}
            alt="Playlist"
            style={imgStyle}
          />
          <div style={{ flex: 1, minWidth: '250px' }}>
            <p style={{ fontSize: '14px', color: '#ccc' }}>My Playlist</p>
            {isEditingName ? (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} style={inputStyle} />
                <button onClick={handleSaveName} style={buttonGreen}>Save</button>
              </div>
            ) : (
              <h1 onClick={() => setIsEditingName(true)} style={{ fontSize: '30px', fontWeight: 'bold', cursor: 'pointer' }}>
                {playlist.name}
              </h1>
            )}
            <p style={{ fontSize: '14px', color: '#aaa' }}>{playlist.songs.length} lagu</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => setIsEditingSongs(!isEditingSongs)} style={buttonOutline}>Edit</button>
            <button onClick={() => setShowAdd(!showAdd)} style={buttonOutline}>Add</button>
            <button onClick={() => router.push('/myplaylist')} style={buttonOutline}>Back</button>
          </div>
        </div>

        {/* Add Song Section */}
        {showAdd && (
          <div style={{ padding: '24px' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Cari lagu untuk ditambahkan..."
              style={searchInputStyle}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {filteredSongs.map((song) => (
                <div key={song.id} style={cardStyle}>
                  <img src={song.image} alt={song.title} style={cardImg} />
                  <div style={{ fontWeight: 'bold' }}>{song.title}</div>
                  <div style={{ fontSize: '12px', color: '#ccc' }}>{song.artist}</div>
                  <button
                    onClick={() => handleAddSong(song.id)}
                    disabled={playlist.songs.includes(song.id)}
                    style={{
                      ...buttonGreen,
                      marginTop: '6px',
                      background: playlist.songs.includes(song.id) ? '#555' : '#1db954',
                      cursor: playlist.songs.includes(song.id) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {playlist.songs.includes(song.id) ? '✔ Ditambahkan' : 'Tambah'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Playlist Song Table */}
        <div style={{ padding: '24px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ textAlign: 'left' }}>#</th>
                <th style={{ textAlign: 'left' }}>Title</th>
                <th style={{ textAlign: 'left' }}>Artist</th>
                {isEditingSongs && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {playlist.songs.map((songId, index) => {
                const song = getSongById(songId);
                if (!song) return null;
                return (
                  <tr key={song.id} style={{ borderBottom: '1px solid #222', height: '56px' }}>
                    <td>{index + 1}</td>
                    <td>
                      <Link href={`/song/${song.id}`} style={linkStyle}>
                        <img src={song.image} alt={song.title} style={songImg} />
                        <span style={{ fontWeight: 'bold' }}>{song.title}</span>
                      </Link>
                    </td>
                    <td>{song.artist}</td>
                    {isEditingSongs && (
                      <td>
                        <button onClick={() => handleRemoveSong(song.id)} style={buttonRed}>Hapus</button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===== STYLE =====
const headerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '20px',
  padding: '24px',
  background: '#222',
  flexWrap: 'wrap',
  alignItems: 'center',
};

const imgStyle: React.CSSProperties = {
  width: '140px',
  height: '140px',
  borderRadius: '10px',
  objectFit: 'cover',
};

const inputStyle: React.CSSProperties = {
  padding: '8px',
  borderRadius: '6px',
  background: '#111',
  color: '#fff',
  border: '1px solid #444',
};

const searchInputStyle: React.CSSProperties = {
  padding: '10px',
  borderRadius: '8px',
  background: '#1c1c1c',
  color: '#fff',
  width: '100%',
  marginBottom: '20px',
  border: 'none',
};

const linkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#fff',
  textDecoration: 'none',
};

const songImg: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '6px',
  objectFit: 'cover',
};

const buttonGreen: React.CSSProperties = {
  background: '#1db954',
  border: 'none',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: '6px',
};

const buttonRed: React.CSSProperties = {
  background: '#e74c3c',
  border: 'none',
  color: '#fff',
  padding: '6px 10px',
  borderRadius: '6px',
  fontSize: '12px',
};

const buttonOutline: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #888',
  color: '#ccc',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
};

const cardStyle: React.CSSProperties = {
  width: '140px',
  background: '#1e1e1e',
  borderRadius: '10px',
  padding: '10px',
  textAlign: 'center',
};

const cardImg: React.CSSProperties = {
  width: '100%',
  height: '100px',
  borderRadius: '6px',
  objectFit: 'cover',
};
