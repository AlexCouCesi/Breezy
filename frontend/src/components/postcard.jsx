import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import CommentSection from './commentsection';
import useUser from '@/utils/useuser';
import ReplyButton from './replybutton';
import React from 'react';

export default function PostCard({ post, onLike, onComment, onReply, onDelete, onDeleteComment, onDeleteReply }) {
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

export default function PostCard({ post, onLike, onComment, onReply, onDelete, onDeleteComment, onDeleteReply, onFollow, isFollowing }) {
    return (
        <div className="bg-white border rounded-xl shadow p-4 space-y-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    <span className="font-bold text-slate-800">@{post.authorData?.username}</span>
                    {!isFollowing && post.authorData && (
                        <button
                            onClick={onFollow}
                            className="text-sm text-teal-600 hover:underline ml-2"
                        >
                            S'abonner
                        </button>
                    )}
                </div>
                <div className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleString()}</div>
            </div>

            <p className="text-slate-700">{post.content}</p>

            <div className="flex gap-4 text-sm text-gray-500 mt-2">
                <button onClick={onLike} className="hover:underline">👍 {post.likes?.length || 0}</button>
                <button onClick={() => onComment('')} className="hover:underline">💬 {post.comments?.length || 0}</button>
                {onDelete && (
                    <button onClick={onDelete} className="hover:underline text-red-500">Supprimer</button>
                )}
            </div>

            {/* Commentaires */}
            {post.comments && post.comments.map(comment => (
                <div key={comment._id} className="ml-6 mt-2 border-l pl-2">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">@{comment.authorData?.username}</span>
                        <button onClick={() => onDeleteComment(post._id, comment._id)} className="text-xs text-red-500">Supprimer</button>
                    </div>
                    <p>{comment.text}</p>

                    {/* Réponses */}
                    {comment.replies && comment.replies.map(reply => (
                        <div key={reply._id} className="ml-4 mt-1 border-l pl-2">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">@{reply.authorData?.username}</span>
                                <button onClick={() => onDeleteReply(post._id, comment._id, reply._id)} className="text-xs text-red-500">Supprimer</button>
                            </div>
                            <p>{reply.text}</p>
                        </div>
                    ))}

                    <button onClick={() => onReply(comment._id, '')} className="text-xs text-teal-600 hover:underline mt-1">Répondre</button>
                </div>
            ))}
        </div>
    );
}
