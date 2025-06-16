'use client';
import Image from 'next/image';

export default function FeedPage() {
    return (
        <div className="flex h-screen bg-neutral-200">
        {/* Sidebar gauche */}
        <aside className="w-64 bg-white p-6 border-r border-gray-300 flex flex-col gap-6">
            <div className="flex items-center gap-2">
            <Image src="/assets/logo_breezy.webp" alt="Logo" width={30} height={30} />
            <span className="font-semibold text-xl">Breezy</span>
            </div>
            <nav className="flex flex-col gap-3 mt-6 text-gray-800">
            <a href="#" className="hover:underline">Page d’accueil</a>
            <a href="#" className="hover:underline">Profil</a>
            <a href="#" className="hover:underline">Notifications</a>
            <a href="#" className="hover:underline">Messages</a>
            </nav>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6">
            <h1 className="text-3xl font-bold">Page d’accueil</h1>

            {/* Zone de publication */}
            <div className="bg-white border rounded-md p-4">
            <div className="flex gap-4 mb-2">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0" />
                <textarea
                placeholder="Comment ça va ?"
                className="w-full border rounded-md p-2 resize-none"
                rows={3}
                />
            </div>
            <div className="flex justify-end">
                <button className="bg-black text-white px-4 py-2 rounded">Publier</button>
            </div>
            </div>

            {/* Liste de publications */}
            {[1, 2].map((_, index) => (
            <div key={index} className="bg-white border rounded-md p-4 flex justify-between items-start">
                <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0" />
                <div>
                    <p className="font-bold">Nom de l’utilisateur <span className="font-normal text-gray-500">@nickname</span> · <span className="text-gray-400">Date</span></p>
                    <p className="text-gray-700 mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <div className="flex gap-6 mt-4 text-gray-500 text-xl">
                    <span>💬</span>
                    <span>🔁</span>
                    <span>❤️</span>
                    </div>
                </div>
                </div>
                <div className="text-xl">➕</div>
            </div>
            ))}
        </main>

        {/* Sidebar droite */}
        <aside className="w-64 bg-white p-6 border-l border-gray-300">
            <h2 className="text-xl font-semibold mb-4">Comptes suivis</h2>
            <ul className="space-y-4">
            {[1, 2, 3].map((_, index) => (
                <li key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
                <span className="text-gray-800">@nickname</span>
                </li>
            ))}
            </ul>
        </aside>
        </div>
    );
}
