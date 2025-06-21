import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Composant d'affichage d’un post individuel
export default function PostCard({ post, onLike, onComment, onShare }) {
    const [author, setAuthor] = useState(null);

    // Récupération des infos de l’auteur du post au chargement
    useEffect(() => {
        async function fetchAuthor() {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_AUTH_URL}/users/${post.author}`,
                    { withCredentials: true }
                );
                setAuthor(res.data);
            } catch (error) {
                console.error('Erreur de récupération de l’auteur :', error);
            }
        }

        fetchAuthor();
    }, [post.author]);

    return (
        <div className="border p-4 rounded-2xl shadow mb-4 bg-white">
            {/* En-tête : avatar + auteur + date */}
            <div className="flex items-center mb-2">
                <img
                    src={author?.avatar || 'public/assets/default-avatar-white.png'}
                    alt="avatar"
                    className="w-10 h-10 rounded-full mr-2"
                />
                <div>
                    <p className="font-bold">
                        {author?.username || 'Utilisateur'}{' '}
                        <span className="text-sm font-normal text-gray-500">
                            @{author?.username || 'inconnu'}
                        </span>
                    </p>
                    <p className="text-xs text-gray-400">
                        {new Date(post.createdAt).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Contenu du post */}
            <p className="mb-2 whitespace-pre-wrap">{post.content}</p>

            {/* Actions : commenter / partager / aimer */}
            <div className="flex space-x-4 text-lg mt-2">
                <button onClick={onComment} title="Commenter">💬</button>
                <button onClick={onShare} title="Partager">🔁</button>
                <button onClick={onLike} title="Aimer">❤️</button>
            </div>
        </div>
    );
}
