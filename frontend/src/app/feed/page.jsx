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
    const [following, setFollowing] = useState([]);
    const [filterUserId, setFilterUserId] = useState(null);

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (!token) {
            router.replace('/auth/login');
        }
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
                        } catch {}

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
                const meRes = await axios.get('/api/auth/me', { withCredentials: true });
                const userId = meRes.data._id;
                const res = await axios.get(`/api/users/${userId}/following`, { withCredentials: true });
                setFollowing(res.data);
            } catch (err) {
                console.error('Erreur récupération des suivis', err);
            }
        };

        fetchFollowing();
    }, []);

    const handleFollow = async (targetId) => {
    try {
        const token = Cookies.get('accessToken');
        await axios.post(`/api/users/${targetId}/follow`, {}, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });
        const res = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${targetId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });
        setFollowing(prev => [...prev, res.data]);
    } catch (err) {
        console.error('Erreur follow', err);
    }
};


    const handleUnfollow = async (targetId) => {
    try {
        const token = Cookies.get('accessToken');
        await axios.post(`/api/users/${targetId}/unfollow`, {}, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });
        setFollowing(prev => prev.filter(user => user._id !== targetId));
        if (filterUserId === targetId) setFilterUserId(null);
    } catch (err) {
        console.error('Erreur unfollow', err);
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

    const handlePublish = async () => {
        if (!newContent.trim()) return;

        try {
            const res = await axios.post('/api/posts/', { content: newContent }, { withCredentials: true });
            const newPost = res.data.post;

            let authorData = null;
            try {
                const userRes = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${newPost.author}`, { withCredentials: true });
                authorData = userRes.data;
            } catch (err) {
                console.error("Erreur récupération de l’auteur", err);
            }

            setPosts([{ ...newPost, authorData }, ...posts]);
            setNewContent('');
        } catch (err) {
            console.error('Erreur publication', err);
        }
    };

    const enrichCommentsWithUser = async (comments) => {
        return Promise.all(comments.map(async (comment) => {
            if (!comment?.author) return comment;

            let enrichedAuthor = null;
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${comment.author}`, { withCredentials: true });
                enrichedAuthor = res.data;
            } catch (err) {
                console.warn("Erreur récupération auteur du commentaire", err);
            }

            const enrichedReplies = await Promise.all((comment.replies || []).map(async (reply) => {
                if (!reply?.author) return reply;

                let replyAuthor = null;
                try {
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${reply.author}`, { withCredentials: true });
                    replyAuthor = res.data;
                } catch (err) {
                    console.warn("Erreur récupération auteur de la réponse", err);
                }
                return { ...reply, authorData: replyAuthor };
            }));

            return { ...comment, authorData: enrichedAuthor, replies: enrichedReplies };
        }));
    };

    const handleAddComment = async (postId, text) => {
        try {
            const res = await axios.post(`/api/posts/${postId}/comment`, { text }, { withCredentials: true });
            const updatedPost = res.data;

            let authorData = null;
            try {
                const resAuthor = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${updatedPost.author}`, { withCredentials: true });
                authorData = resAuthor.data;
            } catch (err) {
                console.error("Erreur récupération de l’auteur du post", err);
            }

            const enrichedComments = await enrichCommentsWithUser(updatedPost.comments || []);

            setPosts(posts.map(p => p._id === postId ? { ...updatedPost, authorData, comments: enrichedComments } : p));
        } catch (err) {
            console.error('Erreur commentaire', err);
        }
    };

    const handleReply = async (postId, commentId, text) => {
        try {
            const res = await axios.post(`/api/posts/${postId}/comments/${commentId}/reply`, { text }, { withCredentials: true });
            const updatedPost = res.data;

            let authorData = null;
            try {
                const resAuthor = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${updatedPost.author}`, { withCredentials: true });
                authorData = resAuthor.data;
            } catch (err) {
                console.error("Erreur récupération de l’auteur du post", err);
            }

            const enrichedComments = await enrichCommentsWithUser(updatedPost.comments || []);

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
        const confirmed = confirm("Supprimer ce commentaire ?");
        if (!confirmed) return;

        try {
            const res = await axios.delete(`/api/posts/${postId}/comments/${commentId}`, { withCredentials: true });
            const updatedPost = res.data;

            let authorData = null;
            try {
                const resAuthor = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${updatedPost.author}`, { withCredentials: true });
                authorData = resAuthor.data;
            } catch (err) {
                console.error("Erreur récupération de l’auteur du post", err);
            }

            const enrichedComments = await enrichCommentsWithUser(updatedPost.comments || []);

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

            let authorData = null;
            try {
                const resAuthor = await axios.get(`${process.env.NEXT_PUBLIC_USERS_URL}/${updatedPost.author}`, { withCredentials: true });
                authorData = resAuthor.data;
            } catch (err) {
                console.error("Erreur récupération de l’auteur du post", err);
            }

            const enrichedComments = await enrichCommentsWithUser(updatedPost.comments || []);

            setPosts(posts.map(p => p._id === postId ? { ...updatedPost, authorData, comments: enrichedComments } : p));
        } catch (err) {
            console.error("Erreur suppression réponse", err);
        }
    };

    const filteredPosts = filterUserId ? posts.filter(p => p.authorData?._id === filterUserId) : posts;

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <main className="flex-1 p-6 overflow-y-auto space-y-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800">Page d’accueil</h1>

                <div className="bg-white border rounded-xl shadow p-4">
                    <div className="flex gap-4">
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
                        <button onClick={handlePublish} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded">
                            Publier
                        </button>
                    </div>
                </div>

                {filteredPosts.map(post => (
                    <PostCard
                        key={post._id}
                        post={post}
                        onLike={() => handleLike(post._id)}
                        onComment={(text) => handleAddComment(post._id, text)}
                        onReply={(commentId, text) => handleReply(post._id, commentId, text)}
                        onDelete={() => handleDelete(post._id)}
                        onDeleteComment={(postId, commentId) => handleDeleteComment(postId, commentId)}
                        onDeleteReply={(postId, commentId, replyId) => handleDeleteReply(postId, commentId, replyId)}
                        onFollow={() => {console.log("Je clique sur s'abonner pour :", post.authorData);handleFollow(post.authorData?._id);}}
                        isFollowing={following.some(f => f._id === post.authorData?._id)}
                        

                    />
                ))}
            </main>

            <aside className="w-80 bg-white border-l p-6 hidden lg:block">
                <FollowedList
                    following={following}
                    onFilter={setFilterUserId}
                    onUnfollow={handleUnfollow}
                />
            </aside>
        </div>
    );
}
