'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      // stocker le token (ex. localStorage) et rediriger
        localStorage.setItem('accessToken', res.data.accessToken);
        router.push('/');
    } catch (err) {
        setError(err.response?.data?.message || 'Erreur de connexion');
    }
    };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        >
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>

        {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
            </div>
        )}

        <label className="block mb-2">
            <span className="text-gray-700">Email</span>
            <input
            type="email"
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
        </label>

        <label className="block mb-4">
            <span className="text-gray-700">Mot de passe</span>
            <input
            type="password"
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </label>

        <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
            Se connecter
        </button>

        <p className="mt-4 text-center text-sm">
            Pas encore de compte ?{' '}
            <a href="/auth/register" className="text-blue-600 hover:underline">
            Inscrivez-vous
            </a>
        </p>
        </form>
    </div>
    );
}
