'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from '@/components/button';
import { Card } from '@/components/card';
import { Input } from '@/components/input';
import { FormGroup } from '@/components/formgroup';


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, { email, password });
            localStorage.setItem("token", res.data.token);
            router.push("/feed");
        } catch {
            alert("Erreur de connexion");
        }
    };

    return (
    <div className="flex items-center justify-center h-screen bg-bg">
        <Card className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Connexion</h2>
            <FormGroup label="Courriel">
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </FormGroup>
            <FormGroup label="Mot de passe">
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </FormGroup>
            <Button onClick={handleLogin} className="mt-4 w-full">Se connecter</Button>
        </Card>
    </div>
    );
}
