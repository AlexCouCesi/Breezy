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
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Bloc logo à gauche */}
      <div className="flex-1 flex items-center justify-center bg-neutral-200">
        <div className="text-center">
          <Image
            src="/assets/logo_breezy.webp"
            alt="Logo Breezy"
            width={140}
            height={140}
            className="mx-auto"
          />
        </div>
      </div>

      {/* Bloc actions à droite */}
      <div className="flex-1 flex items-center justify-center bg-neutral-100">
        <div className="flex flex-col gap-6 w-full max-w-xs">
          <Button
            className="w-full text-base py-3"
            onClick={() => router.push('/auth/login')}
          >
            S'authentifier
          </Button>
          <Button
            variant="secondary"
            className="w-full text-base py-3"
            onClick={() => router.push('/auth/register')}
          >
            Créer un compte
          </Button>
        </div>
      </div>
    </div>
  );
}