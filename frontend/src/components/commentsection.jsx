import React, { useState } from 'react';

export default function CommentSection({ comments, onAddComment }) {
    const [input, setInput] = useState('');

    const handleSubmit = () => {
        onAddComment(input);
        setInput('');
    };

    return (
        <div className="mt-4">
        <textarea
            className="w-full p-2 border rounded"
            placeholder="Écrire ici..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
        ></textarea>
        <button className="bg-black text-white px-4 py-1 rounded mt-2" onClick={handleSubmit}>Publier</button>
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