'use client';

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/button";

export default function Header() {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
            <Image src="/assets/logo_breezy.webp" alt="Breezy" width={32} height={32} />
            <span className="text-lg font-semibold text-zinc-900">Breezy</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex gap-6 text-sm text-zinc-700 font-medium">
            <Link href="/feed" className="hover:text-zinc-900 transition">Accueil</Link>
            <Link href="/profile" className="hover:text-zinc-900 transition">Profil</Link>
            <Link href="/notifications" className="hover:text-zinc-900 transition">Notifications</Link>
            <Link href="/messages" className="hover:text-zinc-900 transition">Messages</Link>
            </nav>

            {/* CTA / Auth */}
            <div className="flex gap-4">
            <Button
                variant="secondary"
                onClick={() => router.push('/auth/login')}
                >
                Connexion
            </Button>
            <Button
                variant="primary"
                onClick={() => router.push('/auth/register')}
                >
                Créer un compte
            </Button>

            </div>
        </div>
        </header>
    );
}