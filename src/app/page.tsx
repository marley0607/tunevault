'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Cek apakah sedang di browser (hindari akses localStorage di server)
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        router.replace('/home'); // 🔁 replace agar tidak bisa kembali ke /
      } else {
        router.replace('/login');
      }
    }
  }, [router]);

  // Tidak tampilkan apa pun karena ini hanya redirector
  return null;
}
