'use client';

import React from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function SideMenu() {
    const handleLogout = () => {
        Cookies.remove('accessToken');
        fetch('/api/auth/logout', { method: 'GET' });
        window.location.href = '/';
    };

    return (
        <aside className="w-68 bg-white shadow-md h-screen flex flex-col pl-4">
            {/* Logo + Nom */}
            <div className="flex items-center mb-6 mt-15">
                <img
                    src="/assets/logo_breezy_v2_writeless.webp"
                    alt="Logo Breezy"
                    className="w-10 h-10 rounded-full mr-2"
                />
                <span className="text-lg font-semibold text-zinc-800">Breezy</span>
            </div>

            {/* Liens de navigation */}
            <div className="flex flex-col gap-10 mt-30 text-zinc-700 text-sm font-medium">
                <Link href="/feed" className="hover:text-zinc-900">Page d'accueil</Link>
                <Link href="/profile" className="hover:text-zinc-900">Profil</Link>
                <Link href="/notifications" className="hover:text-zinc-900">Notifications</Link>
                <Link href="/messages" className="hover:text-zinc-900">Messages</Link>
            </div>

            {/* Déconnexion alignée en bas */}
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