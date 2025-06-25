import React, { useState } from 'react';
import Cookies from 'js-cookie';
import ReplyPopup from './reply-popup';
import useUser from '@/utils/useuser';


export default function CommentSection({ comments, onAddComment, onReply, onDeleteComment, onDeleteReply }) {
    const [input, setInput] = useState('');

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

    const handleSubmit = () => {
        if (!input.trim()) return;
        onAddComment(input);
        setInput('');
    };

    const currentUser = useUser();

    return (
        <div className="mt-4">
            {/* Liste des commentaires existants */}
            <div className="mt-4">
                {comments.map((comment) => (
                    <div key={comment._id} className="border-b py-4">
                        {/* Ligne de haut de commentaire */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <img
                                    src={
                                    userId.profilePicture
                                        ? `${process.env.NEXT_PUBLIC_API_URL}/${user.profilePicture}`
                                        : `${process.env.NEXT_PUBLIC_API_URL}/assets/icones_divers/profile_icon.png`
                                    }                                            alt="Avatar réponse"
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                                <div className="text-sm text-slate-700">
                                    <p className="font-semibold">{comment.authorData?.username}</p>
                                    <p className="text-xs text-slate-500">{comment.author}</p>
                                </div>
                            </div>
                            {userId === comment.author && (
                                <button
                                    className="text-slate-500 hover:text-red-600 transition-colors duration-200 p-2 rounded hover:bg-red-50"
                                    onClick={() => onDeleteComment(comment._id)}
                                >
                                    Supprimer
                                </button>
                            )}
                        </div>

                        {/* Texte du commentaire */}
                        <p className="text-slate-800 mt-2">{comment.text}</p>

                        {/* Réponses */}
                        {comment.replies?.map(reply => (
                            <div key={reply._id} className="ml-4 border-l pl-2 mt-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={
                                            userId.profilePicture
                                                ? `${process.env.NEXT_PUBLIC_API_URL}/${user.profilePicture}`
                                                : `${process.env.NEXT_PUBLIC_API_URL}/assets/icones_divers/profile_icon.png`
                                            }                                            alt="Avatar réponse"
                                            className="w-6 h-6 rounded-full object-cover"
                                        />
                                        <div className="text-sm text-slate-700">
                                            <p className="font-semibold">{reply.authorData?.username}</p>
                                            <p className="text-xs text-slate-500">{reply.author}</p>
                                        </div>
                                    </div>
                                    {userId === reply.author && (
                                        <button
                                            className="text-slate-500 hover:text-red-600 transition-colors duration-200 p-2 rounded hover:bg-red-50"
                                            onClick={() => onDeleteReply(comment._id, reply._id)}
                                        >
                                            Supprimer
                                        </button>
                                    )}
                                </div>
                                <p className="text-slate-800 mt-1">{reply.text}</p>
                            </div>
                        ))}

                        {/* Champ de réponse */}
                        {onReply && (
                            <div className="mt-2 ml-4">
                                <ReplyPopup
                                    originalMessage={comment.content}
                                    authorName={comment.author?.username}
                                    onReply={(replyText) => {
                                        onReply(comment._id, replyText);
                                    }}
                                    trigger={
                                        <button
                                            title="Commenter"
                                            className="flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors duration-200 p-2 rounded hover:bg-teal-50"
                                        >
                                            <img
                                                src="/assets/icones_comments/comment_icon.png"
                                                alt="Commenter"
                                                className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
                                            />
                                        </button>
                                    }
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
