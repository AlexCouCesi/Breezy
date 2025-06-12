'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/button';
import Image from 'next/image';

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
        <Image src="/assets/logo_breezy.webp" alt="Logo Breezy" width={80} height={80} className="mx-auto mb-6" />
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
