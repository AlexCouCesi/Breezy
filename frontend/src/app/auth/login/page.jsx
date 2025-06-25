'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import Cookies from 'js-cookie';
import Button from '@/components/button';
import { Card } from '@/components/card';
import { Input } from '@/components/input';
import FormGroup from '@/components/formgroup';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            setErrorMessage(''); // Réinitialiser le message d'erreur
            const res = await api.post('/login', { email, password });

            Cookies.set('accessToken', res.data.accessToken, {
                expires: 1,
                secure: true,
                sameSite: 'strict',
            });

            router.push('/feed');
            router.refresh();
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'Identifiants invalides');
        }
    };

    useEffect(() => {
        const checkRefreshToken = async () => {
            try {
                const res = await api.get('/refresh');

                if (res.data?.accessToken) {
                    Cookies.set('accessToken', res.data.accessToken, {
                        expires: 1,
                        secure: true,
                        sameSite: 'strict',
                    });

                    router.push('/feed');
                    router.refresh();
                } else {
                    setLoading(false);
                }
            } catch {
                setLoading(false);
            }
        };

        checkRefreshToken();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-white text-xl">Chargement...</p>
            </div>
        );
    }

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

                    {errorMessage && (
                        <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
                    )}

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
