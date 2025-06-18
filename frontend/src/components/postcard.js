import React from 'react';

export default function PostCard({ post, onLike, onComment, onShare }) {
    return (
        <div className="border p-4 rounded-2xl shadow mb-4">
        <div className="flex items-center mb-2">
            <img src={post.author.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-2" />
            <div>
            <p className="font-bold">{post.author.name} <span className="text-sm font-normal text-gray-500">@{post.author.username}</span></p>
            <p className="text-xs text-gray-400">{post.createdAt}</p>
            </div>
        </div>
        <p className="mb-2">{post.content}</p>
        <div className="flex space-x-4">
            <button onClick={onComment}>💬</button>
            <button onClick={onShare}>🔁</button>
            <button onClick={onLike}>❤️</button>
        </div>
        </div>
    );
}