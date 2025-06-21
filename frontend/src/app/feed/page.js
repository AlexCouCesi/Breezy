'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';

export default function FeedPage() {

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
      const followedAccounts = [
    { id: 1, username: "nickname" },
    { id: 2, username: "nickname" },
    { id: 3, username: "nickname" },
    { id: 4, username: "nickname" },
    ];  

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-3 space-y-6">
                {/* Page Title */}
                <h1 className="text-3xl font-bold text-slate-800 mb-6">Page d'accueil</h1>

                {/* Post Creation Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0 p-6">
                <div className="flex gap-4">
                    <a href="/profile">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center">
                            <img
                                src="/assets/icones_divers/profile_icon.png"
                                alt="Profile"
                                className="w-8 h-8 rounded-full"
                                onError={(e) => {
                                e.currentTarget.style.display = "none"
                                e.currentTarget.nextElementSibling.style.display = "block"
                                }}
                            />
                            <span className="text-emerald-700 font-semibold text-sm hidden">PP</span>
                        </div>
                    </a>
                    <div className="flex-1 space-y-4">
                    <p className="text-slate-600 font-medium">Comment ça va ?</p>
                    <textarea
                        placeholder="écrire ici"
                        className="w-full min-h-[100px] p-3 border border-slate-200 rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none resize-none bg-white"
                    />
                    <div className="flex justify-end">
                        <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-2 rounded-lg font-medium transition-all duration-200">
                        Publier
                        </button>
                    </div>
                    </div>
                </div>
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

            {/* Sidebar - Followed Accounts */}
            <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0 sticky top-6">
                <div className="p-6 pb-4">
                    <h2 className="text-xl font-bold text-slate-800">Comptes suivis</h2>
                </div>
                <div className="px-6 pb-6 space-y-4">
                    {followedAccounts.map((account) => (
                    <div
                        key={account.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                        <img
                            src="/assets/icones_divers/profile_icon.png"
                            alt="Profile"
                            className="w-6 h-6 rounded-full"
                            onError={(e) => {
                            e.currentTarget.style.display = "none"
                            e.currentTarget.nextElementSibling.style.display = "block"
                            }}
                        />
                        <span className="text-slate-600 font-semibold text-xs hidden">PP</span>
                        </div>
                        <span className="text-slate-700 font-medium">@{account.username}</span>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}