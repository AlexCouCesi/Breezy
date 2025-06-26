'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';

export default function ProfileModification() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({
        username: '',
        biography: '',
        _id: '',
        profilePicture: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (!token) {
            router.replace('/auth/login');
            return;
        }
        axios.get('/api/users/me', { withCredentials: true })
            .then(res => {
                setUser(res.data);
                setForm({
                    username: res.data.username || '',
                    biography: res.data.biography || '',
                    _id: res.data._id || '',
                    profilePicture: res.data.profilePicture || '',
                });
            })
            .catch(() => {
                router.replace('/auth/login');
            });
    }, [router]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Si une nouvelle photo de profil est sélectionnée, utiliser FormData
            if (form.profilePicture && form.profilePicture instanceof File) {
                const formData = new FormData();
                formData.append('photo', form.profilePicture); // The field name must match backend expectation
                formData.append('username', form.username);
                formData.append('biography', form.biography);
                await axios.put(
                    `${process.env.NEXT_PUBLIC_USERS_URL}/${form._id}`,
                    formData,
                    {
                        withCredentials: true,
                    }
                );
            } else {
                // Sinon, envoyer les données classiques (sans profilePicture ou avec l'URL déjà existante)
                await axios.put(
                    `${process.env.NEXT_PUBLIC_USERS_URL}/${form._id}`,
                    {
                        username: form.username,
                        biography: form.biography,
                    },
                    { withCredentials: true }
                );
            }
            router.push('/profile');
        } catch (err) {
            setError('Erreur lors de la modification du profil.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50">
                <div className="text-slate-600">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
            <div className="max-w-xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Modifier le profil</h1>
                <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-sm p-8 rounded-lg shadow-md space-y-6 border border-teal-100">
                    <div className="flex flex-col items-center mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-32 h-32 rounded-full border-4 border-teal-100 bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center overflow-hidden">
                                {form.profileImagePreview ? (
                                    <img
                                        src={form.profileImagePreview}
                                        alt="Photo de profil"
                                        width={128}
                                        height={128}
                                        className="object-cover w-32 h-32 rounded-full"
                                    />
                                ) : user.profilePicture ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/${user.profilePicture}`}
                                        alt="Photo de profil"
                                        width={128}
                                        height={128}
                                        className="object-cover w-32 h-32 rounded-full"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-5xl">
                                        ?
                                    </div>
                                )}
                            </div>
                            <label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setLoading(true);
                                            setError('');
                                            const file = e.target.files[0];
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setForm(prev => ({
                                                    ...prev,
                                                    profilePicture: file,
                                                    profileImagePreview: reader.result,
                                                }));
                                                setLoading(false);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
                                    onClick={e => {
                                        e.preventDefault();
                                        e.currentTarget.previousSibling.click();
                                    }}
                                    disabled={loading}
                                >
                                    Changer la photo
                                </button>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-700 font-medium mb-1" htmlFor="username">
                            Nom d'utilisateur
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 font-medium mb-1" htmlFor="biography">
                            Biographie
                        </label>
                        <textarea
                            id="biography"
                            name="biography"
                            value={form.biography}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                            placeholder="Parlez un peu de vous..."
                        />
                    </div>
                    {error && <div className="text-red-600">{error}</div>}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
                        >
                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                        <button
                            type="button"
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                            onClick={() => router.push('/profile')}
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}