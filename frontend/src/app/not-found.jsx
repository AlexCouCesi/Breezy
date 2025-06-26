import Link from "next/link";
import React from 'react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
            <h1 className="text-5xl font-bold mb-4 text-zinc-800">404</h1>
            <p className="text-lg text-zinc-600 mb-6">
                Cette page est introuvable.
            </p>
            <Link
                href="/feed"
                className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-zinc-800 transition"
            >
                Retour à l’accueil
            </Link>
        </div>
    );
}
