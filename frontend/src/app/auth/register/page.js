'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    });
    const [error, setError] = useState('');
    const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
    }
    try {
        await axios.post('http://localhost:4000/api/auth/register', {
            username: form.username,
            email: form.email,
            password: form.password,
        });
      // après inscription, redirigez vers la page de login
        router.push('/auth/login');
    } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors de l’inscription');
    }
    };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        >
        <h1 className="text-2xl font-bold mb-6 text-center">Inscription</h1>

        {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
            </div>
        )}

        <label className="block mb-2">
            <span className="text-gray-700">Nom d’utilisateur</span>
            <input
            type="text"
            name="username"
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            value={form.username}
            onChange={handleChange}
            required
            />
        </label>

        <label className="block mb-2">
            <span className="text-gray-700">Email</span>
            <input
            type="email"
            name="email"
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            value={form.email}
            onChange={handleChange}
            required
            />
        </label>

        <label className="block mb-2">
            <span className="text-gray-700">Mot de passe</span>
            <input
            type="password"
            name="password"
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            value={form.password}
            onChange={handleChange}
            required
            />
        </label>

        <label className="block mb-4">
            <span className="text-gray-700">Confirmer mot de passe</span>
            <input
            type="password"
            name="confirmPassword"
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            />
        </label>

        <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
            S’inscrire
        </button>

        <p className="mt-4 text-center text-sm">
            Déjà un compte ?{' '}
            <a href="/auth/login" className="text-blue-600 hover:underline">
            Connectez-vous
            </a>
        </p>
        </form>
    </div>
    );
}
