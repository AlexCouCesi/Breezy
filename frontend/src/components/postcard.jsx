import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import CommentSection from './commentsection';
import useUser from '@/utils/useuser';
import ReplyButton from './replybutton';

export default function PostCard({ post, onLike, onComment, onReply, onDelete, onDeleteComment, onDeleteReply, isFollowing, onFollow }) {
    const author = post.authorData;
    const [showComments, setShowComments] = useState(false);
    const [liked, setLiked] = useState(false);
    const currentUser = useUser();
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

    useEffect(() => {
        if (userId) {
            setLiked(post.likes?.includes(userId));
        }
    }, [post.likes, userId]);

    return (
        <div className="p-6 border border-teal-100 bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-colors duration-200 rounded-lg shadow-sm mb-4">
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
                        <span className="font-medium text-slate-800">{author?.username}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-500">{new Date(post.createdAt).toLocaleString()}</span>
                    </div>
                </div>
                {userId === post.author && (
                    <button
                        onClick={onDelete}
                        title="Supprimer"
                        className="text-slate-500 hover:text-red-600 transition-colors duration-200 p-2 rounded hover:bg-red-50 text-sm"
                    >
                        Supprimer
                    </button>
                )}
                {userId !== post.author && !isFollowing && (
                    <button
                        onClick={onFollow}
                        className="ml-auto text-sm px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                    >
                        Suivre
                    </button>
                )}
            </div>

            {post.image && (
                <div className="mb-4">
                    <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${post.image}`}
                        alt="Post"
                        className="w-full h-auto rounded-lg shadow-sm object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'block';
                        }}
                    />
                    <div className="hidden w-full h-auto text-center text-sm font-semibold text-teal-700 mt-2">
                        Image indisponible
                    </div>
                </div>
            )}

            <p className="text-slate-700 leading-relaxed mb-4 italic whitespace-pre-wrap">{post.content}</p>

            <div className="flex items-center gap-6">
                <button
                    onClick={() => setShowComments(!showComments)}
                    title="Voir les commentaires"
                    className="flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors duration-200 p-2 rounded hover:bg-teal-50"
                >
                    <img
                        src="/assets/icones_comments/allComments_icon.png"
                        alt="Voir les commentaires"
                        className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
                    />
                </button>

                <ReplyButton
                    postContent={post.content}
                    authorUsername={author?.username}
                    onReply={(replyText) => onComment(replyText)}
                />

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
                        onDeleteComment={(commentId) => onDeleteComment(post._id, commentId)}
                        onDeleteReply={(commentId, replyId) => onDeleteReply(post._id, commentId, replyId)}
                    />
                    <button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowComments(false)}
                        className="mt-4 text-teal-600 hover:text-teal-700 hover:bg-teal-50 transition-colors duration-200 "
                    >
                        Fermer
                    </button>                    
                </div>
            )}
        </div>
    );
}
