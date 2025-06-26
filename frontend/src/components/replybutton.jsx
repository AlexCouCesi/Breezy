// replybutton.jsx
import React from 'react';
import ReplyPopup from './reply-popup'; // Chemin relatif correct

const ReplyButton = ({ postContent, authorUsername, onReply }) => {
    return (
        <ReplyPopup
            originalMessage={postContent}
            authorName={authorUsername || 'Utilisateur'}
            onReply={onReply}
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
    );
};

export default ReplyButton;
