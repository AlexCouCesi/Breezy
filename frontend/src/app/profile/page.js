'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';

export default function Profile() {
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (!token) {
            router.replace('/auth/login');
        }
    }, [router]);

    const posts = [
        {
        id: 1,
        content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        date: "2 heures",
        },
    ]

    
    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Header */}
            <h1 className="text-3xl font-bold text-slate-800 mb-8">nom de l'utilisateur</h1>

            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row gap-6 mb-8">
            {/* Profile Picture */}
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

            {/* Profile Info */}
            <div className="flex-1">
                <div className="p-6 border border-teal-100 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-slate-800 mb-1">nom de l'utilisateur</h2>
                <p className="text-teal-600 mb-4">@nickname</p>
                <p className="text-slate-600 leading-relaxed">Biographie courte</p>
                </div>
            </div>
            </div>

            {/* Edit Profile Button */}
            <div className="mb-8">
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm">
                <img src="/assets/icones_comments/edit_icon.png" alt="Modifier" className="w-4 h-4 filter brightness-0 invert" />
                Modifier le profil
            </button>
            </div>

            {/* Posts */}
            <div className="space-y-4">
            {posts.map((post) => (
                <div
                key={post.id}
                className="p-6 border border-teal-100 bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-colors duration-200 rounded-lg shadow-sm"
                >
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full border-2 border-teal-100 bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                        src="/assets/icones_divers/profile_icon.png"
                        alt="Photo de profil"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                        e.currentTarget.style.display = "none"
                        e.currentTarget.nextElementSibling.style.display = "flex"
                        }}
                    />
                    <div className="hidden w-full h-full items-center justify-center text-sm font-semibold text-teal-700">
                        PP
                    </div>
                    </div>
                    <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-slate-800">nom de l'utilisateur</span>
                        <span className="text-teal-600">@nickname</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-500">il y a {post.date}</span>
                    </div>
                    </div>
                </div>

                <p className="text-slate-700 leading-relaxed mb-4 italic">{post.content}</p>

                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors duration-200 p-2 rounded hover:bg-teal-50">
                    <img
                        src="/assets/icones_comments/comment_icon.png"
                        alt="Commenter"
                        className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
                    />
                    </button>
                    <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors duration-200 p-2 rounded hover:bg-emerald-50">
                    <img
                        src="/assets/icones_comments/share_icon.png"
                        alt="Partager"
                        className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
                    />
                    </button>
                    <button className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors duration-200 p-2 rounded hover:bg-rose-50">
                    <img
                        src="/assets/icones_comments/heart_icon.png"
                        alt="Aimer"
                        className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
                    />
                    </button>
                </div>
                </div>
            ))}
            </div>
        </div>
    </div>
    )
}