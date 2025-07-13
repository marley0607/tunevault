const BASE_URL = 'https://686ffc0546567442480122e2.mockapi.io';

// Ambil semua lagu
export const getSongs = async () => {
  const res = await fetch(`${BASE_URL}/songs`);
  if (!res.ok) throw new Error('Gagal ambil data semua lagu');
  return res.json();
};

// Ambil lagu berdasarkan ID
export const getSongById = async (id: string | number) => {
  const res = await fetch(`${BASE_URL}/songs/${id}`);
  if (!res.ok) throw new Error(`Gagal ambil data lagu id: ${id}`);
  return res.json();
};

// Tambahkan ke favorit
export const addToFavorites = async (id: string | number) => {
  const song = await getSongById(id);
  const updatedSong = { ...song, favorite: true };

  const res = await fetch(`${BASE_URL}/songs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedSong),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal menambahkan ke favorit: ${err}`);
  }

  return res.json();
};

// Hapus dari favorit
export const removeFromFavorites = async (id: string | number) => {
  const song = await getSongById(id);
  const updatedSong = { ...song, favorite: false };

  const res = await fetch(`${BASE_URL}/songs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedSong),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal menghapus dari favorit: ${err}`);
  }

  return res.json();
};
