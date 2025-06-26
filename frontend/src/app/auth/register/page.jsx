'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import axios from 'axios';
import Button from '@/components/button';
import { Card } from '@/components/card';
import { Input } from '@/components/input';
import FormGroup from '@/components/formgroup';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    // Soumission du formulaire d'inscription
    const handleRegister = async () => {
        setErrorMessage('');

        // Règle de complexité du mot de passe
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&€#])[A-Za-z\d@$!%*?&€#]{8,}$/;

        // Vérifie que tous les champs sont remplis
        if (!username || !email || !password || !confirmPassword) {
            return setErrorMessage('Tous les champs sont obligatoires');
        }

        // Valide la complexité du mot de passe
        if (!passwordRegex.test(password)) {
            return setErrorMessage("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
        }

        // Vérifie que les deux mots de passe correspondent
        if (password !== confirmPassword) {
            return setErrorMessage('Les mots de passe ne correspondent pas');
        }

        try {
            // Requête vers le back-end pour créer l'utilisateur (auth)
            const registerResponse = await api.post('/register', { username, email, password });
            const _id = registerResponse.data._id;

            // Requête vers le service utilisateurs (profil) pour enregistrer les infos publiques
            await axios.post(`${process.env.NEXT_PUBLIC_USERS_URL}/`, {
                _id,
                username,
                email,
            });

            router.push('/auth/login');
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data?.error || 'Une erreur est survenue');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 px-4">
            <div className="flex justify-center items-center w-full max-w-5xl">
                <Card className="w-full max-w-md">
                    {/* Affichage d'une erreur éventuelle */}
                    {errorMessage && (
                        <div className="mb-4 text-red-600 text-sm text-center">
                            {errorMessage}
                        </div>
                    )}

                    {/* Formulaire d'inscription */}
                    <FormGroup label="Nom d'utilisateur">
                        <Input
                            type="text"
                            placeholder="Votre pseudo"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </FormGroup>

                    <FormGroup label="Courriel">
                        <Input
                            type="email"
                            placeholder="nom@exemple.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </FormGroup>

                    <FormGroup label="Mot de passe">
                        <Input
                            type="password"
                            placeholder="Votre mot de passe"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Au moins 8 caractères, avec majuscule, minuscule, chiffre et symbole.
                        </p>
                    </FormGroup>

                    <FormGroup label="Confirmer le mot de passe">
                        <Input
                            type="password"
                            placeholder="Confirmez le mot de passe"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </FormGroup>

                    <Button onClick={handleRegister} className="mt-6 w-full">
                        Créer mon compte
                    </Button>

                    <p className="mt-4 text-center text-sm text-zinc-600">
                        Déjà un compte ?{' '}
                        <span
                            onClick={() => router.push('/auth/login')}
                            className="text-blue-600 hover:underline cursor-pointer"
                        >
                            Se connecter
                        </span>
                    </p>
                </Card>
            </div>
        </div>
    );
}
