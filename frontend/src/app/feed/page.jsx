'use client';

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
    const [followingList, setFollowingList] = useState([]);
    const [showFollowedOnly, setShowFollowedOnly] = useState(false);
    const router = useRouter();

    const getUserId = () => {
        const token = Cookies.get('accessToken');
        if (!token) return null;
        try {
            return JSON.parse(atob(token.split('.')[1])).id;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (!token) router.replace('/auth/login');
    }, [router]);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const userId = getUserId();
            if (!userId) return;
            
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${userId}`, { withCredentials: true });
                const userData = res.data;
                
                if (userData.following && userData.following.length > 0) {
                    const followingData = await Promise.all(
                        userData.following.map(async (followedId) => {
                            try {
                                const userRes = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${followedId}`, { withCredentials: true });
                                return userRes.data;
                            } catch {
                                return null;
                            }
                        })
                    );
                    setFollowingList(followingData.filter(user => user !== null));
                }
            } catch (err) {
                console.error('Erreur récupération utilisateur courant', err);
            }
        };
        
        fetchCurrentUser();
    }, []);

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

    const handleFollow = async (targetUserId) => {
        const currentUserId = getUserId();
        if (!currentUserId) return;

        try {
            const isCurrentlyFollowing = followingList.some(user => user._id === targetUserId);
            
            if (isCurrentlyFollowing) {
                await axios.post(`${process.env.NEXT_PUBLIC_USERS_URL}/${targetUserId}/unfollow`, {}, { withCredentials: true });
                setFollowingList(prev => prev.filter(user => user._id !== targetUserId));
            } else {
                await await axios.post(`${process.env.NEXT_PUBLIC_USERS_URL}/${targetUserId}/follow`, {}, { withCredentials: true });
                try {
                    const userRes = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${targetUserId}`, { withCredentials: true });
                    setFollowingList(prev => [...prev, userRes.data]);
                } catch {}
            }
        } catch (err) {
            console.error('Erreur follow/unfollow', err);
        }
    };

    const filteredPosts = showFollowedOnly 
        ? posts.filter(post => followingList.some(user => user._id === post.author))
        : posts;

    return (
        <div className="flex min-h-screen">
            <div className="flex-1 container mx-auto h-[calc(100vh-3rem)] flex flex-col">
                <div className="space-y-4 flex-1 overflow-y-auto min-h-0">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-slate-800">Page d'accueil</h1>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={showFollowedOnly}
                                    onChange={(e) => setShowFollowedOnly(e.target.checked)}
                                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                />
                                <span className="text-slate-700">Comptes suivis uniquement</span>
                            </label>
                            <span className="text-sm text-slate-500">
                                ({followingList.length} compte{followingList.length !== 1 ? 's' : ''} suivi{followingList.length !== 1 ? 's' : ''})
                            </span>
                        </div>
                    </div>

                {/* Zone de publication */}
                <div className="bg-white border rounded-xl shadow p-4 mb-6">
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
                                    className="w-full max-h-96 object-contain border rounded-lg mb-2"
                                />
                            )}
                            <textarea
                                placeholder="Comment ça va ?"
                                className="w-full border rounded-md p-2 resize-none text-slate-900 placeholder-slate-500"
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
                        {selectedImage && (
                            <button
                                type="button"
                                onClick={() => setSelectedImage(null)}
                                className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded"
                            >
                                Supprimer
                            </button>
                        )}
                        <label htmlFor="image-upload" className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded cursor-pointer">
                            {selectedImage ? "Changer d'image" : "Choisir une image"}
                            <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                        <button
                            onClick={handlePublish}
                            className={`px-6 py-2 rounded text-white transition-colors duration-200 ${newContent.length > 250 || (!newContent.trim() && !selectedImage)
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-emerald-500 hover:bg-emerald-600'
                                }`}
                            disabled={newContent.length > 250 || (!newContent.trim() && !selectedImage)}
                        >
                            Publier
                        </button>
                    </div>
                </div>

                {/* Liste des posts */}
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                        <PostCard
                            key={post._id}
                            post={post}
                            onLike={() => handleLike(post._id)}
                            onComment={(text) => handleAddComment(post._id, text)}
                            onReply={(commentId, text) => handleReply(post._id, commentId, text)}
                            onDelete={() => handleDelete(post._id)}
                            onDeleteComment={(postId, commentId) => handleDeleteComment(postId, commentId)}
                            onDeleteReply={(postId, commentId, replyId) => handleDeleteReply(postId, commentId, replyId)}
                            onFollow={handleFollow}
                            isFollowing={followingList.some(user => user._id === post.author)}
                        />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-slate-500 text-lg">
                            {showFollowedOnly 
                                ? 'Aucun post des comptes suivis. Suivez des utilisateurs pour voir leurs posts ici.'
                                : 'Aucun post à afficher.'
                            }
                        </p>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}
