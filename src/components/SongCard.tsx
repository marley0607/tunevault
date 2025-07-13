'use client';

import { Song } from '@/types/song';
import { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useRouter } from 'next/navigation';

export default function SongCard({ song }: { song: Song }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const favs = JSON.parse(sessionStorage.getItem('favorites') || '[]');
    setIsFavorite(favs.includes(song.id));
  }, [song.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // agar tidak masuk detail saat klik love

    let currentFavorites: string[] = JSON.parse(sessionStorage.getItem('favorites') || '[]');

    if (isFavorite) {
      currentFavorites = currentFavorites.filter((id) => id !== song.id);
    } else {
      currentFavorites.push(song.id);
    }

    sessionStorage.setItem('favorites', JSON.stringify(currentFavorites));
    setIsFavorite(!isFavorite);
  };

  const goToDetail = () => {
    router.push(`/song/${song.id}`);
  };

  return (
    <Card
      onClick={goToDetail}
      sx={{
        width: { xs: '100%', sm: 200, md: 220 },
        background: '#1e1e1e',
        color: 'white',
        borderRadius: '16px',
        boxShadow: '0 0 10px rgba(255, 0, 128, 0.3)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: '0.3s',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-5px)',
        },
      }}
    >
      <CardMedia
        component="img"
        image={song.image}
        alt={song.title}
        sx={{
          height: 160,
          objectFit: 'cover',
        }}
      />
      <CardContent sx={{ padding: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ whiteSpace: 'normal' }}>
          {song.title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#ff80ab', whiteSpace: 'normal' }}>
          {song.artist}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: 'gray', fontStyle: 'italic' }}
        >
          Genre: {song.genre || song.mood || 'Unknown'}
        </Typography>

        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <IconButton onClick={toggleFavorite}>
            <FavoriteIcon sx={{ color: isFavorite ? '#ff4081' : 'gray' }} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}
