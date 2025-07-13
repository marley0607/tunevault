// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/home'); // Jika sudah login, langsung ke halaman utama
    } else {
      router.push('/login'); // Kalau belum login, arahkan ke login
    }
  }, []);

  return null; // Tidak tampilkan apa-apa karena ini hanya halaman pengarah
}
