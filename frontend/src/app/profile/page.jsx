'use client';
import React from 'react';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from '@/utils/axios';
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

        axios.get('/api/users/me', { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => { });

        const fetchPosts = async () => {
            try {
                const res = await axios.get(`/api/posts/user/${userId}`, { withCredentials: true });
                const rawPosts = res.data;

                const postsWithAuthors = await Promise.all(
                    rawPosts.map(async post => {
                        let authorData = null;
                        try {
                            const resAuthor = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${post.author}`, {
                                withCredentials: true,
                            });
                            authorData = resAuthor.data;
                        } catch { }

                        const enrichedComments = await enrichCommentsWithUser(post.comments || []);
                        return { ...post, authorData, comments: enrichedComments };
                    })
                );

                setPosts(postsWithAuthors);
            } catch (err) {
                console.error('Erreur récupération des posts', err);
            }
        };

        fetchPosts();
    }, [router]);

    const enrichCommentsWithUser = async (comments) => {
        return Promise.all(comments.map(async (comment) => {
            let enrichedAuthor = null;
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${comment.author}`, {
                    withCredentials: true,
                });
                enrichedAuthor = res.data;
            } catch { }

            const enrichedReplies = await Promise.all((comment.replies || []).map(async (reply) => {
                let replyAuthor = null;
                try {
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${reply.author}`, {
                        withCredentials: true,
                    });
                    replyAuthor = res.data;
                } catch { }
                return { ...reply, authorData: replyAuthor };
            }));

            return {
                ...comment,
                authorData: enrichedAuthor,
                replies: enrichedReplies,
            };
        }));
    };

    const handleLike = async (postId) => {
        try {
            const res = await axios.post(`/api/posts/${postId}/like`, {}, { withCredentials: true });
            setPosts(posts.map(p => p._id === postId ? { ...res.data, authorData: p.authorData } : p));
        } catch (err) {
            console.error('Erreur like', err);
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

    const handleDeletePost = async (postId) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) return;
        try {
            await axios.delete(`/api/posts/${postId}`, { withCredentials: true });
            setPosts(posts.filter(p => p._id !== postId));
        } catch (err) {
            console.error("Erreur suppression", err);
        }
    };

    const handleAddComment = async (postId, text) => {
        try {
            const res = await axios.post(`/api/posts/${postId}/comment`, { text }, { withCredentials: true });
            const updatedPost = res.data;

            const enrichedComments = await enrichCommentsWithUser(updatedPost.comments || []);

            let authorData = null;
            try {
                const resAuthor = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${updatedPost.author}`, {
                    withCredentials: true,
                });
                authorData = resAuthor.data;
            } catch { }

            setPosts(posts.map(p => p._id === postId ? { ...updatedPost, authorData, comments: enrichedComments } : p));
        } catch (err) {
            console.error('Erreur commentaire', err);
        }
    };

    const handleReply = async (postId, commentId, text) => {
        try {
            const res = await axios.post(`/api/posts/${postId}/comments/${commentId}/reply`, { text }, { withCredentials: true });
            const updatedPost = res.data;

            const enrichedComments = await enrichCommentsWithUser(updatedPost.comments || []);

            let authorData = null;
            try {
                const resAuthor = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${updatedPost.author}`, {
                    withCredentials: true,
                });
                authorData = resAuthor.data;
            } catch { }

            setPosts(posts.map(p => p._id === postId ? { ...updatedPost, authorData, comments: enrichedComments } : p));
        } catch (err) {
            console.error('Erreur réponse', err);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (!confirm("Supprimer ce commentaire ?")) return;
        try {
            const res = await axios.delete(`/api/posts/${postId}/comments/${commentId}`, { withCredentials: true });
            const updatedPost = res.data;

            const enrichedComments = await enrichCommentsWithUser(updatedPost.comments || []);

            let authorData = null;
            try {
                const resAuthor = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${updatedPost.author}`, {
                    withCredentials: true,
                });
                authorData = resAuthor.data;
            } catch { }

            setPosts(posts.map(p => p._id === postId ? { ...updatedPost, authorData, comments: enrichedComments } : p));
        } catch (err) {
            console.error("Erreur suppression commentaire", err);
        }
    };

    const handleDeleteReply = async (postId, commentId, replyId) => {
        if (!confirm("Supprimer cette réponse ?")) return;
        try {
            const res = await axios.delete(`/api/posts/${postId}/comments/${commentId}/replies/${replyId}`, {
                withCredentials: true,
            });
            const updatedPost = res.data;

            const enrichedComments = await enrichCommentsWithUser(updatedPost.comments || []);

            let authorData = null;
            try {
                const resAuthor = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${updatedPost.author}`, {
                    withCredentials: true,
                });
                authorData = resAuthor.data;
            } catch { }

            setPosts(posts.map(p => p._id === postId ? { ...updatedPost, authorData, comments: enrichedComments } : p));
        } catch (err) {
            console.error("Erreur suppression réponse", err);
        }
    };

    return (
        <div className="container h-[calc(100vh-3rem)] flex flex-col">
            <div className="space-y-4 flex-1 overflow-y-auto min-h-0">
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
                    <div className="max-w-2xl mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold text-slate-800 mb-8">{user?.username || 'Mon profil'}</h1>

                        <div className="flex flex-col sm:flex-row gap-6 mb-8">
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 rounded-full border-4 border-teal-100 bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center overflow-hidden">
                                    {user?.profilePicture ? (
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/${user.profilePicture}`}
                                            alt="Photo de profil"
                                            width={128}
                                            height={128}
                                            className="object-cover w-32 h-32 rounded-full"
                                        />
                                    ) : (
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/assets/icones_divers/profile_icon.png`}
                                            alt="Photo de profil"
                                            width={128}
                                            height={128}
                                            className="object-cover w-32 h-32 rounded-full"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="p-6 border border-teal-100 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm">
                                    <h2 className="text-xl font-semibold text-slate-800 mb-1">{user?.username}</h2>
                                    <p className="text-slate-600 leading-relaxed">{user?.biography || "Biographie courte"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <button
                                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm"
                                onClick={() => router.push('/profile-modification')}
                            >
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
                                    onDelete={() => handleDeletePost(post._id)}
                                    onDeleteComment={(postId, commentId) => handleDeleteComment(postId, commentId)}
                                    onDeleteReply={(postId, commentId, replyId) => handleDeleteReply(postId, commentId, replyId)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
