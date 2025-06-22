import React, { useState } from 'react';

export default function CommentSection({ comments, onAddComment, onReply }) {
    const [input, setInput] = useState('');
    const [replies, setReplies] = useState({});

    // Gère la soumission d’un nouveau commentaire
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
                {comments.map((comment, index) => (
                    <div key={index} className="border-b py-2">
                        <p className="text-sm font-semibold text-slate-700">{comment.author}</p>
                        <p className="text-slate-800">{comment.text}</p>
                        {comment.replies?.map(reply => (
                            <div key={reply._id} className="ml-4 border-l pl-2 mt-2">
                                <p className="text-sm font-semibold text-slate-700">{reply.author}</p>
                                <p className="text-slate-800">{reply.text}</p>
                            </div>
                        ))}

                        {onReply && (
                            <div className="mt-2 ml-4">
                                <textarea
                                    className="w-full p-1 border rounded text-slate-900 placeholder-slate-500"
                                    placeholder="Répondre..."
                                    value={replies[comment._id] || ''}
                                    onChange={(e) => setReplies({ ...replies, [comment._id]: e.target.value })}
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
