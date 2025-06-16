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
  }, [router]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Bloc logo à gauche */}
      <div className="flex-1 flex items-center justify-center bg-gray-200">
        <div className="text-center">
          <Image
            src="/assets/logo_breezy.webp"
            alt="Logo Breezy"
            width={120}
            height={120}
            className="mx-auto mb-4"
          />
          <p className="text-2xl font-light">Breezy</p>
        </div>
      </div>

      {/* Bloc boutons à droite */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button onClick={() => router.push('/auth/login')}>S'authentifier</Button>
          <Button variant="secondary" onClick={() => router.push('/auth/register')}>
            Créer un compte
          </Button>
        </div>
      </div>
    </div>
  );
}
