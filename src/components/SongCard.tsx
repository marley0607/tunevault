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
        width: { xs: 140, sm: 160, md: 180 },
        background: '#1e1e1e',
        color: 'white',
        borderRadius: '16px',
        boxShadow: '0 0 12px rgba(0, 255, 128, 0.15)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 0 18px rgba(0,255,128,0.5)',
        },
        display: 'flex',
        flexDirection: 'column',
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
      <CardContent sx={{ padding: 1.5 }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          noWrap
          sx={{ fontSize: '0.95rem' }}
        >
          {song.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: '#66ffcc', fontSize: '0.85rem' }}
          noWrap
        >
          {song.artist}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: 'gray', fontSize: '0.7rem', fontStyle: 'italic' }}
          noWrap
        >
          Genre: {song.genre || song.mood || 'Unknown'}
        </Typography>

        <Box
          sx={{
            marginTop: 1.5,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <IconButton onClick={toggleFavorite} sx={{ padding: '4px' }}>
            <FavoriteIcon sx={{ fontSize: '20px', color: isFavorite ? '#ff4081' : 'gray' }} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}
