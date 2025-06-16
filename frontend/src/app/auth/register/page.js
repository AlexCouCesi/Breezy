'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Button from '@/components/button';
import { Card } from '@/components/card';
import { Input } from '@/components/input';
import { FormGroup } from '@/components/formgroup';
import Image from 'next/image';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleRegister = async () => {
        setErrorMessage('');
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/register`, {
                email,
                password,
                confirmPassword
            });
            router.push('/auth/login');
        } catch (error) {
            if (error.response?.data?.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Une erreur est survenue');
            }
        }
    };
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
        await axios.post(process.env.NEXT_PUBLIC_AUTH_URL + '/api/auth/register', {
            username: form.username,
            email: form.email,
            password: form.password,
        });
      // après inscription, redirigez vers la page de login
        router.push('/auth/login');
    } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || 'Erreur lors de l’inscription');
    }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Bloc logo */}
            <div className="flex-1 flex items-center justify-center bg-neutral-300">
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
            <div className="flex-1 flex items-center justify-center bg-neutral-300 px-4">
                <Card className="w-full max-w-md">
                    {errorMessage && (
                        <div className="mb-4 text-red-600 text-sm text-center">
                            {errorMessage}
                        </div>
                    )}
                    <FormGroup label="Courriel">
                        <Input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="ex: nom@exemple.com"
                        />
                    </FormGroup>
                    <FormGroup label="Mot de passe">
                        <Input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Au moins 6 caractères"
                        />
                    </FormGroup>
                    <FormGroup label="Confirmer le mot de passe">
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Retaper le mot de passe"
                        />
                    </FormGroup>
                    <Button onClick={handleRegister} className="mt-6 w-full">
                        Créer mon compte
                    </Button>
                </Card>
            </div>
        </div>
    );
}
