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
        <aside className="w-48 p-4 bg-white shadow-md h-screen flex flex-col justify-between">
        <nav className="flex flex-col gap-4 text-zinc-700 text-sm font-medium">
            <Link href="/feed" className="hover:text-zinc-900">Page d'accueil</Link>
            <Link href="/profile" className="hover:text-zinc-900">Profil</Link>
            <Link href="/notifications" className="hover:text-zinc-900">Notifications</Link>
            <Link href="/messages" className="hover:text-zinc-900">Messages</Link>
        </nav>

        <button
            onClick={handleLogout}
            className="mt-4 text-sm text-red-600 hover:underline text-left"
        >
            Se déconnecter
        </button>
        </aside>
    );
}