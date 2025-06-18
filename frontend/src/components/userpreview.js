import React from 'react';

export default function UserPreview({ user }) {
    return (
        <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
        <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full mr-2" />
        <div>
            <p className="font-semibold text-sm">@{user.username}</p>
        </div>
        </div>
    );
}