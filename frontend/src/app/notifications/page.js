'use client';
import React from 'react';

export default function NotificationsPage() {
    const notifications = [];

    return (
        <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Notifications</h1>
        {notifications.map((note, i) => (
            <div key={i} className="border-b py-2">{note.text}</div>
        ))}
        </div>
    );
}
