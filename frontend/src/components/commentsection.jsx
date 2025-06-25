import React, { useState } from 'react';
import Cookies from 'js-cookie';

export default function CommentSection({ comments, onAddComment, onReply, onDeleteComment, onDeleteReply }) {
    const [input, setInput] = useState('');
    const [replies, setReplies] = useState({});

    // Récupère l'ID utilisateur depuis le JWT
    const getUserId = () => {
        const token = Cookies.get('accessToken');
        if (!token) return null;
        try {
            return JSON.parse(atob(token.split('.')[1])).id;
        } catch {
            return null;
        }
    };

    const userId = getUserId();

    const handleSubmit = () => {
        if (!input.trim()) return;
        onAddComment(input);
        setInput('');
    };

    return (
        <div className="mt-4">
            {/* Champ de saisie du commentaire */}
            <textarea
                className="w-full p-2 border rounded text-slate-900 placeholder-slate-500"
                placeholder="Écrire ici..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            {/* Bouton de publication */}
            <button
                className="bg-black text-white px-4 py-1 rounded mt-2"
                onClick={handleSubmit}
            >
                Publier
            </button>

            {/* Liste des commentaires existants */}
            <div className="mt-4">
                {comments.map((comment) => (
                    <div key={comment._id} className="border-b py-2">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-semibold text-slate-700">{comment.authorData?.username}</p>
                            {userId === comment.author && (
                                <button
                                    className="text-xs text-red-500 hover:underline"
                                    onClick={() => onDeleteComment(comment._id)}
                                >
                                    Supprimer
                                </button>
                            )}
                        </div>
                        <p className="text-slate-800">{comment.text}</p>

                        {/* Réponses */}
                        {comment.replies?.map(reply => (
                            <div key={reply._id} className="ml-4 border-l pl-2 mt-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-semibold text-slate-700">{reply.authorData?.username}</p>
                                    {userId === reply.author && (
                                        <button
                                            className="text-xs text-red-500 hover:underline"
                                            onClick={() => onDeleteReply(comment._id, reply._id)}
                                        >
                                            Supprimer
                                        </button>
                                    )}
                                </div>
                                <p className="text-slate-800">{reply.text}</p>
                            </div>
                        ))}

                        {/* Champ de réponse */}
                        {onReply && (
                            <div className="mt-2 ml-4">
                                <textarea
                                    className="w-full p-1 border rounded text-slate-900 placeholder-slate-500"
                                    placeholder="Répondre..."
                                    value={replies[comment._id] || ''}
                                    onChange={(e) =>
                                        setReplies({ ...replies, [comment._id]: e.target.value })
                                    }
                                />
                                <button
                                    className="bg-gray-800 text-white px-2 py-0.5 rounded mt-1"
                                    onClick={() => {
                                        if (!replies[comment._id]?.trim()) return;
                                        onReply(comment._id, replies[comment._id]);
                                        setReplies({ ...replies, [comment._id]: '' });
                                    }}
                                >
                                    Répondre
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
