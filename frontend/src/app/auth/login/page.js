'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from '@/components/button';
import { Card } from '@/components/card';
import { Input } from '@/components/input';
import FormGroup from '@/components/formgroup';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            email,
            password,
        });
        localStorage.setItem("token", res.data.token);
        router.push("/feed");
        } catch {
        alert("Erreur de connexion");
        }
    };

    return (
        <div className="flex h-screen">
        {/* Partie gauche avec logo */}
        <div className="w-1/2 bg-gray-300 flex flex-col justify-center items-center">
            <h1 className="text-4xl font-light mb-2">logo</h1>
            <p className="text-lg font-medium">🌬️ Breezy</p>
        </div>

        {/* Partie droite avec formulaire */}
        <div className="w-1/2 bg-gray-200 flex justify-center items-center">
            <Card className="w-full max-w-sm space-y-6">
            <FormGroup label="Courriel">
                <Input
                type="email"
                placeholder="écrire ici"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </FormGroup>
            <FormGroup label="Mot de passe">
                <Input
                type="password"
                placeholder="écrire ici"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </FormGroup>
            <Button onClick={handleLogin}>Se connecter</Button>
            </Card>
        </div>
        </div>
    );
}
