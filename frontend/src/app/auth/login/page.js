'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Button from '@/components/button';
import { Card } from '@/components/card';
import { Input } from '@/components/input';
import FormGroup from '@/components/formgroup';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true); // État pour gérer le chargement initial
    const router = useRouter();

    // Fonction pour gérer la connexion utilisateur via le formulaire
    const handleLogin = async () => {
        try {
            const res = await axios.post(process.env.NEXT_PUBLIC_AUTH_URL + '/login', { email, password });
            
            if (res.data?.accessToken) {
                Cookies.set('accessToken', res.data.accessToken, { expires: 1, secure: true });
                router.push('/feed');
                router.refresh();
            } else {
                alert('Échec de connexion : Token manquant');
            }
        } catch(error) {
            alert('Erreur de connexion : ' + error.response?.data?.message || error.message);
        }
    };

    // Vérification automatique du refreshToken au montage de la page
    useEffect(() => {
        const checkRefreshToken = async () => {
            try {
                const response = await fetch('/api/auth/refresh', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();

                if (data?.accessToken) {
                    Cookies.set('accessToken', data.accessToken, { expires: 1, secure: true });
                    router.push('/feed');
                    router.refresh();
                } else {
                    // Aucun token valide : on arrête le loading et on reste sur la page login
                    setLoading(false);
                }
            } catch (error) {
                console.error('Erreur lors du rafraîchissement du token :', error);
                setLoading(false);
            }
        };

        checkRefreshToken();
    }, [router]);

    // Affichage d'un écran de chargement pendant la vérification du token
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-white text-xl">Chargement...</p>
            </div>
        );
    }

    // Rendu normal de la page de connexion après vérification
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 px-4">
            <div className="flex justify-center items-center w-full max-w-5xl">
                <Card className="w-full max-w-md">
                    <FormGroup label="Courriel">
                        <Input
                            type="email"
                            placeholder="Votre courriel"
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
                    </FormGroup>
                    <Button onClick={handleLogin} className="mt-6 w-full">
                        Se connecter
                    </Button>
                    <p className="mt-4 text-center text-sm text-zinc-600">
                        Pas encore de compte ?{' '}
                        <span
                            onClick={() => router.push('/auth/register')}
                            className="text-blue-600 hover:underline cursor-pointer"
                        >
                            Créer un compte
                        </span>
                    </p>
                </Card>
            </div>
        </div>
    );
}
