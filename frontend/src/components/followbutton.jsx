import React from 'react';

// Bouton de suivi/désabonnement
export default function FollowButton({ isFollowing, onToggle }) {
    return (
        <button
            onClick={onToggle}
            className="bg-black text-white rounded px-4 py-1 hover:bg-zinc-800 transition"
        >
            {isFollowing ? 'Ne plus suivre' : 'Suivre'}
        </button>
    );
}
