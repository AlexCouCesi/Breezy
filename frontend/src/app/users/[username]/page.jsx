'use client';
import React from 'react';
import FollowButton from '@/components/followbutton.jsx';
import PostCard from '@/components/postcard.jsx';

export default function UserProfile({ params }) {
    const username = params.username;
    const user = {/* données mockées */};
    const posts = [];

    return (
        <div className="p-4">
        <div className="flex items-center justify-between mb-4">
            <div>
            <h1 className="text-xl font-bold">{user.name} (@{username})</h1>
            <p className="text-sm text-gray-600">{user.bio}</p>
            </div>
            <FollowButton isFollowing={false} onToggle={() => {}} />
        </div>
        {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
    );
}
