'use client';

import React from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import Image from 'next/image';

export default function SideMenu() {
    // Déconnexion : supprime le token et redirige vers l'accueil
    const handleLogout = () => {
        Cookies.remove('accessToken');
        fetch('/api/auth/logout', { method: 'GET' }); // Backend logout si besoin
        window.location.href = '/';
    };

    return (
        <aside className="w-68 bg-white shadow-md h-screen flex flex-col pl-4">
            {/* Logo + Titre */}
            <div className="flex items-center mb-6 mt-15">
                <img
                    src="/assets/logo_breezy_v2_writeless.webp"
                    alt="Logo Breezy"
                    className="w-10 h-10 rounded-full mr-2"
                />
                <span className="text-lg font-semibold text-zinc-800">Breezy</span>
            </div>

            {/* Menu de navigation */}
            <div className="flex flex-col gap-10 mt-30 text-zinc-700 text-sm font-medium">
                <Link href="/feed" className="hover:text-zinc-900 flex items-center gap-2">
                    <Image
                        src="/assets/icones_nav/home_icon.png"
                        alt="Accueil"
                        width={20}
                        height={20}
                    />
                    Page d'accueil
                </Link>

                <Link href="/profile" className="hover:text-zinc-900 flex items-center gap-2">
                    <Image
                        src="/assets/icones_nav/user_icon.png"
                        alt="Profil"
                        width={20}
                        height={20}
                    />
                    Profil
                </Link>

                <Link href="/notifications" className="hover:text-zinc-900 flex items-center gap-2">
                    <Image
                        src="/assets/icones_nav/bell_icon.png"
                        alt="Notifications"
                        width={20}
                        height={20}
                    />
                    Notifications
                </Link>

                <Link href="/messages" className="hover:text-zinc-900 flex items-center gap-2">
                    <Image
                        src="/assets/icones_nav/mail_icon.png"
                        alt="Messages"
                        width={20}
                        height={20}
                    />
                    Messages
                </Link>
            </div>

            {/* Bouton de déconnexion aligné en bas */}
            <div className="flex-1 flex items-end mb-10">
                <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:underline text-left"
                >
                    Se déconnecter
                </button>
            </div>
        </aside>
    );
}
