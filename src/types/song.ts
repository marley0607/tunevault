export interface Song {
  id: string;
  title: string;
  artist: string;
  image: string;
  lyrics?: string;
  genre?: string;
  audioUrl?: string;
  mood?: string;
  favorite?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  songs: (string | number)[];
}
