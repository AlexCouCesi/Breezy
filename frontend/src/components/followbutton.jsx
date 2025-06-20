import React from 'react';

export default function FollowButton({ isFollowing, onToggle }) {
    return (
        <button onClick={onToggle} className="bg-black text-white rounded px-4 py-1">
        {isFollowing ? 'Ne plus suivre' : 'Suivre'}
        </button>
    );
}