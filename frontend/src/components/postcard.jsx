import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CommentSection from './commentsection';
import useUser from '@/utils/useuser';

// Composant d'affichage d’un post individuel
export default function PostCard({ post, onLike, onComment, onReply, onShare, onDelete }) {
    const [author, setAuthor] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [liked, setLiked] = useState(false);
    const currentUser = useUser();
    const [reposted, setReposted] = useState(false);
    const toggleComments = () => setShowComments((prev) => !prev);

    const getUserId = () => {
        const token = Cookies.get('accessToken');
        if (!token) return null;
        try {
            return JSON.parse(atob(token.split('.')[1])).id;
        } catch {
            return null;
        }
    };

    const userId = getUserId();

    const handleLikeClick = () => {
        setLiked(!liked);
        onLike();
    };

    // Récupération des infos de l’auteur du post au chargement
    useEffect(() => {
        async function fetchAuthor() {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_AUTH_URL}/users/${post.author}`,
                    { withCredentials: true }
                );
                setAuthor(res.data);
            } catch (error) {
                console.error('Erreur de récupération de l’auteur :', error);
            }
        }

        fetchAuthor();
    }, [post.author]);

    useEffect(() => {
        if (userId) {
            setLiked(post.likes?.includes(userId));
        }
    }, [post.likes, userId]);

    return (
        <div className="p-6 border border-teal-100 bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-colors duration-200 rounded-lg shadow-sm mb-4">
            {/* En-tête : avatar + auteur + date */}
            <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full border-2 border-teal-100 bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                        src={author?.avatar || '/assets/icones_divers/profile_icon.png'}
                        alt="Photo de profil"
                        className="w-full h-full object-cover"
                        onError={e => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                    />
                    <div className="hidden w-full h-full items-center justify-center text-sm font-semibold text-teal-700">
                        PP
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-slate-800">{author?.username || 'Utilisateur'}</span>
                        <span className="text-teal-600">@{author?.username || 'inconnu'}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-500">{new Date(post.createdAt).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Contenu du post */}
            <p className="text-slate-700 leading-relaxed mb-4 italic whitespace-pre-wrap">{post.content}</p>

            {/* Actions : commenter / partager / aimer */}
            <div className="flex items-center gap-6">
                <button
                    onClick={() => setShowComments(!showComments)}
                    title="Commenter"
                    className="flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors duration-200 p-2 rounded hover:bg-teal-50"
                >
                    <img
                        src="/assets/icones_comments/comment_icon.png"
                        alt="Commenter"
                        className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
                    />
                </button>
                {currentUser && post.author !== currentUser._id && (
                    <button
                        onClick={() => { onShare(); setReposted(true); }}
                        title="Republier"
                        disabled={reposted}
                        className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors duration-200 p-2 rounded hover:bg-emerald-50 disabled:opacity-50"
                    >
                        <img
                            src="/assets/icones_comments/share_icon.png"
                            alt="Republier"
                            className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
                        />
                    </button>
                )}
                {currentUser && post.author === currentUser._id && (
                    <button
                        onClick={onDelete}
                        title="Supprimer"
                        className="text-slate-500 hover:text-red-600 transition-colors duration-200 p-2 rounded hover:bg-red-50"
                    >
                        Supprimer
                    </button>
                )}
                <button
                    onClick={handleLikeClick}
                    title="Aimer"
                    className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors duration-200 p-2 rounded hover:bg-rose-50"
                >
                {liked ? (
                        <span className="text-red-500">❤️</span>
                    ) : (
                        <img
                            src="/assets/icones_comments/heart_icon.png"
                            alt="Aimer"
                            className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
                        />
                    )}
                </button>
            </div>
            {showComments && (
                <div className="mt-4">
                    <CommentSection
                        comments={post.comments || []}
                        onAddComment={(text) => onComment(text)}
                        onReply={(commentId, text) => onReply(commentId, text)}
                    />
                    <button
                        onClick={toggleComments}
                        className="text-sm text-teal-600 mt-2 hover:underline"
                    >
                        Fermer
                    </button>
                </div>
            )}
        </div>
    );
}
