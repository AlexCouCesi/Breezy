'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '@/components/postcard';
import FollowedList from '@/components/followedlist';

export default function FeedPage() {
    const [posts, setPosts] = useState([]);
    const [newContent, setNewContent] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
            const res = await axios.get('/api/tasks/posts', {
                withCredentials: true
            });
            const rawPosts = res.data;

            // On récupère les données utilisateurs pour chaque author
            const postsWithAuthors = await Promise.all(rawPosts.map(async post => {
                try {
                const userRes = await axios.get(
                    `/api/auth/user/${post.author}`,
                    { withCredentials: true }
                );
                return {
                    ...post,
                    authorData: userRes.data
                };
                } catch (e) {
                return { ...post, authorData: null };
                }
            }));

            setPosts(postsWithAuthors);
            } catch (err) {
            console.error(err);
            }
        };

        fetchPosts();
        }, []);


    const handlePublish = async () => {
        if (!newContent.trim()) return;

        try {
        const res = await axios.post(
            '/api/tasks/posts', 
            { content: newContent }, 
            { withCredentials: true }
        );
        setPosts([res.data.post, ...posts]);
        setNewContent('');
        } catch (err) {
        console.error(err);
        }
    };

    return (
        <div className="flex h-screen bg-neutral-200">
        <main className="flex-1 p-6 overflow-y-auto space-y-6">
            <h1 className="text-3xl font-bold">Page d’accueil</h1>

            {/* Zone de publication */}
            <div className="bg-white border rounded-md p-4">
            <div className="flex gap-4 mb-2">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0" />
                <textarea
                placeholder="Comment ça va ?"
                className="w-full border rounded-md p-2 resize-none"
                rows={3}
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                />
            </div>
            <div className="flex justify-end">
                <button onClick={handlePublish} className="bg-black text-white px-4 py-2 rounded">
                Publier
                </button>
            </div>
            </div>

            {/* Liste de posts */}
            {posts.map(post => (
            <PostCard
                key={post._id}
                post={post}
                onLike={() => {}}
                onComment={() => {}}
                onShare={() => {}}
            />
            ))}
        </main>

        <aside className="w-64 bg-white p-6 border-l border-gray-300">
            <FollowedList />
        </aside>
        </div>
    );
}
