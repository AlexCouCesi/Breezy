import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import Cookies from 'js-cookie';

// Hook personnalisé pour récupérer l'utilisateur courant
export default function useUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (!token) return; // Aucun token : ne pas tenter l'appel

        // Appel au backend pour obtenir les données utilisateur liées au token
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`, // Token d'accès dans le header
            },
        })
        .then(res => setUser(res.data))
        .catch(() => setUser(null)); // En cas d'erreur (401, etc.), remettre l’état à null
    }, []);

    return user;
}
