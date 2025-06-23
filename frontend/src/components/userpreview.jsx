import React from 'react';

// Composant d’aperçu d’un utilisateur (compact, cliquable)
export default function UserPreview({ user }) {
    return (
        <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
            {/* Avatar utilisateur avec fallback */}
            <img
                src={user.avatar || '/assets/default-avatar-white.png'}
                alt={`Avatar de ${user.username}`}
                className="w-8 h-8 rounded-full mr-2"
            />
            <div>
                <p className="font-semibold text-sm">@{user.username}</p>
            </div>
        </div>
    );
}
