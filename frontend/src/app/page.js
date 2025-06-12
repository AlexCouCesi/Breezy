'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/button';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/feed');
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-bg">
      <div className="text-center">
        <img src="/assets/logo-breezy.png" alt="Logo Breezy" className="h-20 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-6 text-text">Bienvenue sur Breezy</h1>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push('/auth/login')}>S'authentifier</Button>
          <Button variant="secondary" onClick={() => router.push('/auth/register')}>
            Créer un compte
          </Button>
        </div>
      </div>
    </div>
  );
}
