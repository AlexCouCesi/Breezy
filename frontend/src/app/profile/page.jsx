'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import PostCard from '@/components/postcard';

export default function Profile() {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (!token) {
            router.replace('/auth/login');
            return;
        }
        const userId = JSON.parse(atob(token.split('.')[1])).id;

        axios.get('/api/auth/me', { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => {});

        const fetchPosts = async () => {
            try {
                const postsRes = await axios.get(`/api/posts/user/${userId}`, { withCredentials: true });
                const rawPosts = postsRes.data;

                const postsWithAuthors = await Promise.all(
                    rawPosts.map(async post => {
                        try {
                            const userRes = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${post.author}`, {
                                withCredentials: true,
                            });
                            return { ...post, authorData: userRes.data };
                        } catch {
                            return { ...post, authorData: null };
                        }
                    })
                );

                setPosts(postsWithAuthors);
            } catch (err) {
                console.error('Erreur posts profil', err);
            }
        };

        fetchPosts();
    }, [router]);

    const handleLike = async (postId) => {
        try {
            const res = await axios.post(`/api/posts/${postId}/like`, {}, { withCredentials: true });
            setPosts(posts.map(p => p._id === postId ? { ...res.data, authorData: p.authorData } : p));
        } catch (err) {
            console.error('Erreur like', err);
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

    const handleReply = async (postId, commentId, text) => {
        try {
            const res = await axios.post(`/api/posts/${postId}/comments/${commentId}/reply`, { text }, { withCredentials: true });
            setPosts(posts.map(p => p._id === postId ? res.data : p));
        } catch (err) {
            console.error('Erreur réponse', err);
        }
    };

    const handleShare = async (postId) => {
        try {
            const res = await axios.post(`/api/posts/${postId}/repost`, {}, { withCredentials: true });
            setPosts([res.data, ...posts]);
        } catch (err) {
            console.error('Erreur republication', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">{user?.username || 'Mon profil'}</h1>

                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-full border-4 border-teal-100 bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center overflow-hidden">
                            <Image
                                src="/assets/icones_divers/profile_icon.png"
                                alt="Photo de profil"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none"
                                    e.currentTarget.nextElementSibling.style.display = "flex"
                                }}
                            />
                            <div className="hidden w-full h-full items-center justify-center text-2xl font-semibold text-teal-700">
                                PP
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="p-6 border border-teal-100 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold text-slate-800 mb-1">{user?.username}</h2>
                            <p className="text-teal-600 mb-4">@{user?.username}</p>
                            <p className="text-slate-600 leading-relaxed">Biographie courte</p>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm">
                        <img src="/assets/icones_comments/edit_icon.png" alt="Modifier" className="w-4 h-4 filter brightness-0 invert" />
                        Modifier le profil
                    </button>
                </div>

                <div className="space-y-4">
                    {posts.map(post => (
                        <PostCard
                            key={post._id}
                            post={post}
                            onLike={() => handleLike(post._id)}
                            onComment={(text) => handleAddComment(post._id, text)}
                            onReply={(commentId, text) => handleReply(post._id, commentId, text)}
                            onShare={() => handleShare(post._id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
