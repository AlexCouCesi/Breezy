import React, { useState } from 'react';

export default function CommentSection({ comments, onAddComment }) {
    const [input, setInput] = useState('');

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
                className="w-full p-2 border rounded"
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
                        <p className="text-sm font-semibold">{comment.author}</p>
                        <p>{comment.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
