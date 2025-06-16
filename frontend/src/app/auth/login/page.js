'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Button from '@/components/button';
import { Card } from '@/components/card';
import { Input } from '@/components/input';
import FormGroup from '@/components/formgroup';
import Image from 'next/image';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            email,
            password,
        });
        localStorage.setItem('token', res.data.token);
        router.push('/feed');
        } catch {
        alert('Erreur de connexion');
        }
    };

    return (
        <div className="flex h-screen">
        {/* Bloc logo */}
        <div className="w-1/2 bg-neutral-300 flex items-center justify-center">
            <div className="text-center">
            <Image
                src="/assets/logo_breezy.webp"
                alt="Logo Breezy"
                width={100}
                height={100}
                className="mx-auto mb-2"
            />
            <p className="text-xl text-black">Breezy</p>
            </div>
        </div>

        {/* Bloc formulaire */}
        <div className="w-1/2 bg-neutral-300 flex items-center justify-center px-4">
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
            </Card>
        </div>
        </div>
    );
}
