'use client';
import React, { useState } from 'react';

export default function ChatPage({ params }) {
    const { conversationId } = params;
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = () => {
        setMessages([...messages, { from: 'me', text: input }]);
        setInput('');
    };

    return (
        <div className="p-4">
        <div className="mb-4">
            {messages.map((msg, i) => (
            <div key={i} className="mb-1">
                <span className="font-semibold">{msg.from}: </span>{msg.text}
            </div>
            ))}
        </div>
        <input
            className="border rounded p-2 w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écrire un message..."
        />
        <button onClick={sendMessage} className="bg-black text-white px-4 py-1 rounded mt-2">Envoyer</button>
        </div>
    );
}
