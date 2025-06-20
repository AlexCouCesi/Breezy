import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PostCard({ post, onLike, onComment, onShare }) {
    const [author, setAuthor] = useState(null);

    useEffect(() => {
        async function fetchAuthor() {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/users/${post.author}`, {
            withCredentials: true,
            });
            setAuthor(res.data);
        } catch (error) {
            console.error('Erreur de récupération de l’auteur :', error);
        }
        }

        fetchAuthor();
    }, [post.author]);

    return (
        <div className="border p-4 rounded-2xl shadow mb-4">
        <div className="flex items-center mb-2">
            <img src={author?.avatar || '/assets/default-avatar-white.png'} alt="avatar" className="w-10 h-10 rounded-full mr-2" />
            <div>
            <p className="font-bold">{author?.username || 'Utilisateur'} <span className="text-sm font-normal text-gray-500">@{author?.username}</span></p>
            <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
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
