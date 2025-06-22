'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import PostCard from '@/components/postcard';
import FollowedList from '@/components/followedlist';

export default function FeedPage() {
    const [posts, setPosts] = useState([]);
    const [newContent, setNewContent] = useState('');
    const router = useRouter();

    // Redirige vers la page de connexion si aucun token présent
    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (!token) {
            router.replace('/auth/login');
        }
    }, [router]);

    // Récupère les posts du flux et ajoute les infos de l'auteur
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('/api/posts/', { withCredentials: true });
                const rawPosts = res.data;

                // Enrichit chaque post avec les données de l'auteur
                const postsWithAuthors = await Promise.all(
                    rawPosts.map(async post => {
                        try {
                            const userRes = await axios.get(`/api/auth/users/${post.author}`, {
                                withCredentials: true,
                            });
                            return { ...post, authorData: userRes.data };
                        } catch {
                            // En cas d'erreur, on garde le post mais sans les infos auteur
                            return { ...post, authorData: null };
                        }
                    })
                );

                setPosts(postsWithAuthors);
            } catch (err) {
                console.error('Erreur récupération des posts', err);
            }
        };

        fetchPosts();
    }, []);

    // Publication d'un nouveau post
    const handlePublish = async () => {
        if (!newContent.trim()) return;

        try {
            const res = await axios.post(
                '/api/posts/',
                { content: newContent },
                { withCredentials: true }
            );

            // Ajoute le nouveau post en haut de la liste
            setPosts([res.data.post, ...posts]);
            setNewContent('');
        } catch (err) {
            console.error('Erreur publication', err);
        }
    };

    const handleShare = async (postId) => {
        try {
            const res = await axios.post(`/api/posts/${postId}/share`, {}, { withCredentials: true });
            setPosts([res.data.post, ...posts]);
        } catch (err) {
            console.error('Erreur republication', err);
        }
    };

    const handleAddComment = async (postId, text) => {
        try {
            const res = await axios.post(`/api/posts/${postId}/comment`, { text }, { withCredentials: true });
            setPosts(posts.map(p => p._id === postId ? res.data : p));
        } catch (err) {
            console.error('Erreur commentaire', err);
        }
    };

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`/api/posts/${postId}`, { withCredentials: true });
            setPosts(posts.filter(p => p._id !== postId));
        } catch (err) {
            console.error('Erreur suppression', err);
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <main className="flex-1 p-6 overflow-y-auto space-y-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800">Page d’accueil</h1>

                {/* Zone de publication */}
                <div className="bg-white border rounded-xl shadow p-4">
                    <div className="flex gap-4">
                        {/* Avatar (statique pour l'instant) */}
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0" />
                        <textarea
                            placeholder="Comment ça va ?"
                            className="w-full border rounded-md p-2 resize-none text-slate-900 placeholder-slate-500"
                            rows={3}
                            value={newContent}
                            onChange={e => setNewContent(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={handlePublish}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded"
                        >
                            Publier
                        </button>
                    </div>
                </div>

                {/* Liste des posts */}
                {posts.map(post => (
                    <PostCard
                        key={post._id}
                        post={post}
                        onLike={() => handleLike(post._id)}
                        onComment={(text) => handleAddComment(post._id, text)}
                        onReply={(commentId, text) => handleReply(post._id, commentId, text)}
                        onShare={() => handleShare(post._id)}
                        onDelete={() => handleDelete(post._id)}
                    />
                ))}
            </main>

            {/* Sidebar : utilisateurs suivis */}
            <aside className="w-80 bg-white border-l p-6 hidden lg:block">
                <FollowedList />
            </aside>
        </div>
    );
}
