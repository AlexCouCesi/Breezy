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
    <div className="flex flex-col md:flex-row h-screen bg-bg">
      {/* Bloc logo à gauche */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-8">
        <div className="text-center">
          <Image
            src="/assets/logo_breezy.webp"
            alt="Logo Breezy"
            width={160}
            height={160}
            className="mx-auto mb-6"
          />
        </div>
      </div>

      {/* Bloc actions à droite */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="flex flex-col md:flex-row gap-4">
          <Button onClick={() => router.push('/auth/login')}>S'authentifier</Button>
          <Button variant="secondary" onClick={() => router.push('/auth/register')}>
            Créer un compte
          </Button>
        </div>
      </div>
    </div>
  );
}
