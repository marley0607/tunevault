'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { getSongs } from '@/utils/api';

const PLAYLIST_API = 'https://686ffc0546567442480122e2.mockapi.io/playlist';

export default function PlaylistDetailPage() {
  const params = useParams();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const router = useRouter();
  const [playlist, setPlaylist] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [editName, setEditName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingSongs, setIsEditingSongs] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSongs, setFilteredSongs] = useState<any[]>([]);

  useEffect(() => {
    if (id) fetchPlaylist(id);
    fetchSongs();
  }, [id]);

  const fetchSongs = async () => {
    const data = await getSongs();
    setSongs(data);
  };

  const fetchPlaylist = async (id: string) => {
    const res = await fetch(`${PLAYLIST_API}/${id}`);
    const data = await res.json();
    setPlaylist(data);
    setEditName(data.name);
  };

  const handleBack = () => router.push('/myplaylist');

  const handleSaveName = async () => {
    if (!editName.trim()) return;
    await fetch(`${PLAYLIST_API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...playlist, name: editName }),
    });
    setIsEditingName(false);
    fetchPlaylist(id as string);
  };

  const handleRemoveSong = async (songId: number) => {
    const updated = playlist.songs.filter((sid: number) => sid !== songId);
    await fetch(`${PLAYLIST_API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...playlist, songs: updated }),
    });
    fetchPlaylist(id as string);
  };

  const handleAddSong = async (songId: number) => {
    if (playlist.songs.includes(songId)) return;
    const updated = [...playlist.songs, songId];
    await fetch(`${PLAYLIST_API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...playlist, songs: updated }),
    });
    setSearchTerm('');
    setFilteredSongs([]);
    fetchPlaylist(id as string);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const result = songs.filter((s) =>
      s.title.toLowerCase().includes(term.toLowerCase()) ||
      s.artist.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredSongs(result);
  };

  const getSongById = (id: number) => songs.find((s) => s.id === id);

  if (!playlist) return <div style={{ padding: '24px', color: '#fff' }}>Loading...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#121212', color: '#fff' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '60px' }}>
        {/* Header Playlist */}
        <div style={{
          display: 'flex', gap: '20px', padding: '24px', background: '#222',
          flexWrap: 'wrap', alignItems: 'center'
        }}>
          <img
            src={getSongById(playlist.songs[0])?.image || '/placeholder.jpg'}
            alt="Playlist"
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '10px',
              objectFit: 'cover'
            }}
          />
          <div style={{ flex: 1, minWidth: '250px' }}>
            <p style={{ fontSize: '14px', color: '#ccc' }}>My Playlist</p>
            {isEditingName ? (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    background: '#111',
                    color: '#fff',
                    border: '1px solid #444'
                  }}
                />
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
            <button onClick={handleBack} style={buttonOutline}>Back</button>
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
              style={{
                padding: '10px',
                borderRadius: '8px',
                background: '#1c1c1c',
                color: '#fff',
                width: '100%',
                marginBottom: '20px',
                border: 'none'
              }}
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
              {playlist.songs.map((songId: number, index: number) => {
                const song = getSongById(songId);
                return song ? (
                  <tr key={song.id} style={{ borderBottom: '1px solid #222', height: '56px' }}>
                    <td>{index + 1}</td>
                    <td>
                      <Link
                        href={`/song/${song.id}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          color: '#fff',
                          textDecoration: 'none'
                        }}
                      >
                        <img
                          src={song.image}
                          alt={song.title}
                          style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 'bold' }}>{song.title}</span>
                      </Link>
                    </td>
                    <td>{song.artist}</td>
                    {isEditingSongs && (
                      <td>
                        <button onClick={() => handleRemoveSong(song.id)} style={{ ...buttonRed, fontSize: '12px' }}>
                          Hapus
                        </button>
                      </td>
                    )}
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===== STYLE =====
const buttonGreen = {
  background: '#1db954',
  border: 'none',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: '6px',
};

const buttonRed = {
  background: '#e74c3c',
  border: 'none',
  color: '#fff',
  padding: '6px 10px',
  borderRadius: '6px',
};

const buttonOutline = {
  background: 'transparent',
  border: '1px solid #888',
  color: '#ccc',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
};

const cardStyle = {
  width: '140px',
  background: '#1e1e1e',
  borderRadius: '10px',
  padding: '10px',
  textAlign: 'center' as const,
};

const cardImg = {
  width: '100%',
  height: '100px',
  borderRadius: '6px',
  objectFit: 'cover' as const,
};
