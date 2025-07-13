// src/types/song.ts
export interface songs {
  id: string;
  title: string;
  artist: string;
  genre: string;
  image: string;
  audioUrl: string;
  favorite: boolean;
  Since: string;
  lyrics: string;
  mood: string;
}

export interface playlist {
  id: string;
  name: string;
  songs: string[];
}