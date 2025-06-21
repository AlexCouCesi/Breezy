'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/button';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex">
      {/* Section gauche : branding visuel (desktop uniquement) */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>

        {/* Formes décoratives */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>

        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          <div className="max-w-md text-center space-y-8">
            {/* Logo et titre */}
            <div className="space-y-6">
              <div className="relative">
                <Image
                  src="/assets/logo_breezy_v2_writeless.webp"
                  alt="Logo Breezy"
                  width={160}
                  height={160}
                  className="mx-auto drop-shadow-2xl"
                />
              </div>
              <div>
                <h1 className="text-6xl font-bold tracking-tight mb-2">Breezy</h1>
                <div className="w-20 h-1 bg-white/60 mx-auto rounded-full"></div>
              </div>
            </div>

            {/* Message d'accroche */}
            <div className="space-y-4">
              <p className="text-2xl text-white/90 leading-relaxed font-light">
                Votre nouvelle expérience commence ici
              </p>
              <p className="text-white/75 text-base">Découvrez ce que dit le monde qui vous entoure</p>
            </div>

            {/* Indicateurs esthétiques */}
            <div className="flex items-center justify-center space-x-3 pt-6">
              <div className="w-3 h-3 bg-white/70 rounded-full"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              <div className="w-2 h-2 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Section droite : zone d’action */}
      <div className="flex-1 lg:max-w-lg flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 p-10 rounded-2xl">
            {/* En-tête */}
            <div className="text-center mb-10 space-y-3">
              <h2 className="text-4xl font-bold text-gray-900">Bienvenue</h2>
              <p className="text-gray-600 text-lg">Choisissez une action pour commencer</p>
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 mx-auto rounded-full"></div>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-5">
              <Button
                className="w-full h-16 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-3 text-lg"
                onClick={() => router.push("/auth/login")}
              >
                <span>S'authentifier</span>
                {/* Icône utilisateur */}
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Button>

              {/* Séparateur visuel */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500 font-medium">ou</span>
                </div>
              </div>

              <Button
                className="w-full h-16 bg-gradient-to-r from-sky-700 to-slate-700 hover:from-sky-800 hover:to-slate-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-3 text-lg"
                onClick={() => router.push("/auth/register")}
              >
                <span>Créer un compte</span>
                {/* Icône plus */}
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </Button>
            </div>

            {/* Bas de carte : infos légales */}
            <div className="text-center mt-8 pt-6 border-t border-gray-100">
              <p className="text-gray-500 text-sm">
                En continuant, vous acceptez nos{" "}
                <span className="text-teal-600 hover:text-teal-700 cursor-pointer font-medium">
                  conditions d'utilisation
                </span>
              </p>
            </div>
          </div>

          {/* Version mobile : logo en bas */}
          <div className="lg:hidden text-center mt-8">
            <Image
              src="/assets/logo_breezy_writeless.webp"
              alt="Logo Breezy"
              width={80}
              height={80}
              className="mx-auto mb-3 opacity-60"
            />
            <p className="text-gray-500 text-lg font-medium">Breezy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
