'use client';

import Link from 'next/link';
import axios from '@/utils/axios';
import Cookies from 'js-cookie';

// Liste des comptes que l'utilisateur suit (version statique pour l’instant)
export default function FollowedList({ followingList, onUnfollow }) {
    const getUserId = () => {
        const token = Cookies.get('accessToken');
        if (!token) return null;
        try {
            return JSON.parse(atob(token.split('.')[1])).id;
        } catch {
            return null;
        }
    };

    const handleUnfollow = async (targetUserId) => {
        const currentUserId = getUserId();
        if (!currentUserId) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_USERS_URL}/${currentUserId}/unfollow/${targetUserId}`, { withCredentials: true });
            if (onUnfollow) {
                onUnfollow(targetUserId);
            }
        } catch (err) {
            console.error('Erreur unfollow', err);
        }
    };
    if (!followingList || followingList.length === 0) {
        return (
            <aside className="w-80 bg-white border-l p-6 hidden lg:block h-screen">
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
                <li key={user._id} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <Link href={`/profile/${user._id}`} className="flex items-center gap-3 hover:underline flex-1">
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
                    <button
                        onClick={() => handleUnfollow(user._id)}
                        className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded-full transition-colors"
                        title="Ne plus suivre"
                    >
                        Unfollow
                    </button>
                </li>
                ))}
            </ul>
            </aside>
        );
    }
}
