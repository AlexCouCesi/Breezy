// src/app/auth/register/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api'; // utilisation d'axios préconfiguré
import Button from '@/components/button';
import { Card } from '@/components/card';
import { Input } from '@/components/input';
import FormGroup from '@/components/formgroup';
import Image from 'next/image';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleRegister = async () => {
        setErrorMessage('');
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&€#])[A-Za-z\d@$!%*?&€#]{8,}$/;

        if (!username || !email || !password || !confirmPassword) {
        return setErrorMessage('Tous les champs sont obligatoires');
        }
        if (!passwordRegex.test(password)) {
        return setErrorMessage("Le mot de passe est trop faible.");
        }
        if (password !== confirmPassword) {
        return setErrorMessage('Les mots de passe ne correspondent pas');
        }

        try {
        await api.post('/register', { username, email, password });
        router.push('/auth/login');
        } catch (error) {
        setErrorMessage(error.response?.data?.error || 'Erreur serveur');
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen">
        {/* Logo + Formulaire */}
        <div className="flex-1 flex items-center justify-center bg-neutral-300">
            <div className="text-center">
            <Image src="/assets/logo_breezy.webp" alt="Logo Breezy" width={100} height={100} className="mx-auto mb-2" />
            <p className="text-xl text-black">Breezy</p>
            </div>
        </div>
        <div className="flex-1 flex items-center justify-center bg-neutral-300 px-4">
            <Card className="w-full max-w-md">
            {errorMessage && <div className="mb-4 text-red-600 text-sm text-center">{errorMessage}</div>}
            <FormGroup label="Nom d'utilisateur">
                <Input type="text" placeholder="Votre pseudo" value={username} onChange={e => setUsername(e.target.value)} />
            </FormGroup>
            <FormGroup label="Courriel">
                <Input type="email" placeholder="nom@exemple.com" value={email} onChange={e => setEmail(e.target.value)} />
            </FormGroup>
            <FormGroup label="Mot de passe">
                <Input type="password" placeholder="Votre mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
            </FormGroup>
            <FormGroup label="Confirmer le mot de passe">
                <Input type="password" placeholder="Confirmez le mot de passe" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </FormGroup>
            <Button onClick={handleRegister} className="mt-6 w-full">Créer mon compte</Button>
            <p className="mt-4 text-center text-sm text-zinc-600">
                Déjà un compte ? <span onClick={() => router.push('/auth/login')} className="text-blue-600 hover:underline cursor-pointer">Se connecter</span>
            </p>
            </Card>
        </div>
        </div>
    );
}
