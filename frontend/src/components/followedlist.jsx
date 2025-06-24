'use client';

import Link from 'next/link';

// Liste des comptes que l'utilisateur suit (version statique pour l’instant)
export default function FollowedList({ followingList }) {
    if (!followingList || followingList.length === 0) {
        return (
            <aside className="w-80 bg-white border-l p-6 hidden lg:block">
                <h2 className="text-xl font-semibold mb-4">Comptes suivis</h2>
                <p className="text-gray-500">Vous ne suivez aucun compte pour l'instant. :(</p>
            </aside>
        );
    } else {
        return (
            <aside className="w-80 bg-white border-l p-6 hidden lg:block h-screen">
            <h2 className="text-xl font-semibold mb-4">Comptes suivis</h2>
            <ul className="space-y-4">
                {followingList.map((user) => (
                <li key={user._id} className="flex items-center gap-3">
                    <Link href={`/profile/${user._id}`} className="flex items-center gap-3 hover:underline">
                    <img
                        src={
                        user.profilePicture
                            ? `${process.env.NEXT_PUBLIC_API_URL}/${user.profilePicture}`
                            : `${process.env.NEXT_PUBLIC_API_URL}/assets/icones_divers/profile_icon.png`
                        }
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover bg-gray-300"
                    />
                    <span className="text-gray-800">@{user.username}</span>
                    </Link>
                </li>
                ))}
            </ul>
            </aside>
        );
    }
}
