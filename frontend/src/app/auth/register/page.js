'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Button from '@/components/button';
import { Card } from '@/components/card';
import { Input } from '@/components/input';
import { FormGroup } from '@/components/formgroup';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const handleRegister = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, { email, password });
            router.push('/auth/login');
        } catch {
            alert('Erreur lors de la création du compte');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-bg">
        <Card className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Créer un compte</h2>
            <FormGroup label="Courriel">
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </FormGroup>
            <FormGroup label="Mot de passe">
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </FormGroup>
            <Button onClick={handleRegister} className="mt-4 w-full">Créer mon compte</Button>
        </Card>
        </div>
    );
}
