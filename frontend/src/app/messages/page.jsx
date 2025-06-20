'use client';
import React from 'react';
import Link from 'next/link';

export default function MessagesPage() {
    const conversations = [];

    return (
        <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Messages</h1>
        {conversations.map((conv) => (
            <Link key={conv.id} href={`/messages/${conv.id}`} className="block py-2 border-b">
            {conv.name}
            </Link>
        ))}
        </div>
    );
}