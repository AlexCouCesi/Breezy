'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from '@/utils/axios';
import PostCard from '@/components/postcard';

export default function FeedPage() {
    const [posts, setPosts] = useState([]);
    const [newContent, setNewContent] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [lengthError, setLengthError] = useState('');
    const router = useRouter();
    const [following, setFollowing] = useState([]);
    const [followingUsersData, setFollowingUsersData] = useState([]);

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (!token) router.replace('/auth/login');
    }, [router]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('/api/posts/', { withCredentials: true });
                const rawPosts = res.data;

                const postsWithAuthors = await Promise.all(
                    rawPosts.map(async post => {
                        let authorData = null;
                        try {
                            const res = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${post.author}`, { withCredentials: true });
                            authorData = res.data;
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
    }, []);

    useEffect(() => {
    const fetchFollowing = async () => {
        try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/me`, { withCredentials: true });
        const user = res.data;
        setFollowing(user.following || []);
        } catch (err) {
        console.error("Erreur récupération following", err);
        }
    };

    fetchFollowing();
    }, []);

    useEffect(() => {
    const fetchFollowingUsers = async () => {
        try {
        const responses = await Promise.all(
            following.map(id => axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${id}`, { withCredentials: true }))
        );
        setFollowingUsersData(responses.map(r => r.data));
        } catch (err) {
        console.error("Erreur données utilisateurs suivis", err);
        }
    };

    if (following.length > 0) {
        fetchFollowingUsers();
    } else {
        setFollowingUsersData([]);
    }
    }, [following]);


    const enrichCommentsWithUser = async (comments) => {
        return Promise.all(comments.map(async (comment) => {
            if (!comment?.author) return comment;

            let enrichedAuthor = null;
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${comment.author}`, { withCredentials: true });
                enrichedAuthor = res.data;
            } catch { }

            const enrichedReplies = await Promise.all((comment.replies || []).map(async (reply) => {
                if (!reply?.author) return reply;

                let replyAuthor = null;
                try {
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${reply.author}`, { withCredentials: true });
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedImage(file);
    };

    const handlePublish = async () => {
        if (!newContent.trim() && !selectedImage) return;
        if (newContent.length > 250) {
            setLengthError('Le post ne peut pas dépasser 250 caractères.');
            return;
        }

        try {
            let postData;
            let headers = { withCredentials: true };

            if (selectedImage) {
                postData = new FormData();
                postData.append('content', newContent);
                postData.append('image', selectedImage);
                headers.headers = { 'Content-Type': 'multipart/form-data' };
            } else {
                postData = { content: newContent };
            }

            const res = await axios.post('/api/posts/', postData, headers);
            const newPost = res.data.post;

            let authorData = null;
            try {
                const userRes = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${newPost.author}`, {
                    withCredentials: true,
                });
                authorData = userRes.data;
            } catch { }

            setPosts([{ ...newPost, authorData }, ...posts]);
            setNewContent('');
            setSelectedImage(null);
            setLengthError('');
        } catch (err) {
            console.error('Erreur publication', err);
        }
    };

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
            const updatedPost = res.data;

            const enrichedComments = await enrichCommentsWithUser(updatedPost.comments || []);
            let authorData = null;
            try {
                const resAuthor = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${updatedPost.author}`, { withCredentials: true });
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
                const resAuthor = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${updatedPost.author}`, { withCredentials: true });
                authorData = resAuthor.data;
            } catch { }

            setPosts(posts.map(p => p._id === postId ? { ...updatedPost, authorData, comments: enrichedComments } : p));
        } catch (err) {
            console.error('Erreur réponse', err);
        }
    };

    const handleDelete = async (postId) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) return;
        try {
            await axios.delete(`/api/posts/${postId}`, { withCredentials: true });
            setPosts(posts.filter(p => p._id !== postId));
        } catch (err) {
            console.error("Erreur suppression", err);
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
                const resAuthor = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${updatedPost.author}`, { withCredentials: true });
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
            const res = await axios.delete(`/api/posts/${postId}/comments/${commentId}/replies/${replyId}`, { withCredentials: true });
            const updatedPost = res.data;

            const enrichedComments = await enrichCommentsWithUser(updatedPost.comments || []);
            let authorData = null;
            try {
                const resAuthor = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${updatedPost.author}`, { withCredentials: true });
                authorData = resAuthor.data;
            } catch { }

            setPosts(posts.map(p => p._id === postId ? { ...updatedPost, authorData, comments: enrichedComments } : p));
        } catch (err) {
            console.error("Erreur suppression réponse", err);
        }
    };

    const handleFollow = async (userId) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_USERS_URL}/${userId}/follow`, {}, { withCredentials: true });
            setFollowing(prev => [...prev, userId]);
        } catch (err) {
            console.error("Erreur suivi", err);
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_USERS_URL}/${userId}/unfollow`, {}, { withCredentials: true });
            setFollowing(prev => prev.filter(id => id !== userId));
        } catch (err) {
            console.error("Erreur désabonnement", err);
        }
    };

    return (
    <div className="relative min-h-screen bg-gradient-to-br from-white to-gray-50/50 p-6">

        {/* Titre */}
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Page d'accueil</h1>

        {/* Zone de publication */}
        <div className="border border-gray-200 rounded-2xl shadow-sm p-6 mb-6 bg-white/60 backdrop-blur-md">
        <div className="flex gap-4">
            <img
            src="/assets/icones_divers/profile_icon.png"
            alt="Moi"
            className="w-10 h-10 rounded-full object-cover bg-gray-300"
            />
            <div className="flex flex-col items-center w-full">
            {selectedImage && (
                <img
                src={URL.createObjectURL(selectedImage)}
                alt="Aperçu"
                className="w-full max-h-80 object-contain border border-gray-200 rounded-xl shadow-sm"
                />
            )}
            <textarea
                placeholder="Quoi de neuf aujourd'hui ?"
                className="w-full border-0 bg-gray-50/50 rounded-xl p-4 resize-none text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:bg-white transition-all duration-200 text-base leading-relaxed"
                rows={3}
                value={newContent}
                onChange={e => {
                const value = e.target.value;
                if (value.length > 250) {
                    setLengthError('Le post ne peut pas dépasser 250 caractères.');
                } else {
                    setLengthError('');
                }
                setNewContent(value);
                }}
            />
            <div className="flex justify-between items-center w-full mt-1 text-sm">
                <span className={`text-sm ${newContent.length > 250 ? 'text-red-500' : 'text-slate-500'}`}>
                {newContent.length}/250 caractères
                </span>
                {lengthError && <span className="text-red-500">{lengthError}</span>}
            </div>
            </div>
        </div>

        <div className="flex justify-end mt-2 gap-2">
            <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            <span>Public</span>
            </div>

            {selectedImage && (
            <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded"
            >
                Supprimer
            </button>
            )}

            <label
            htmlFor="image-upload"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium"
            >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
            {selectedImage ? 'Changer' : 'Photo'}
            <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            <button
            onClick={handlePublish}
            disabled={newContent.length > 250 || (!newContent.trim() && !selectedImage)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 transform
                ${newContent.length > 250 || (!newContent.trim() && !selectedImage)
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                }`}
            >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Publier
            </button>
        </div>
        </div>

        {/* Liste des posts */}
        <div className="space-y-6">
        {posts.map(post => (
            <PostCard
            key={post._id}
            post={post}
            onLike={() => handleLike(post._id)}
            onComment={(text) => handleAddComment(post._id, text)}
            onReply={(commentId, text) => handleReply(post._id, commentId, text)}
            onDelete={() => handleDelete(post._id)}
            onDeleteComment={(postId, commentId) => handleDeleteComment(postId, commentId)}
            onDeleteReply={(postId, commentId, replyId) => handleDeleteReply(postId, commentId, replyId)}
            isFollowing={following.includes(post.author)}
            onFollow={() => handleFollow(post.author)}
            />
        ))}
        </div>
        </div>
    );
}
