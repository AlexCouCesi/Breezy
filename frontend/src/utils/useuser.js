import { useEffect, useState } from 'react';
import axios from '@/utils/axios';

// Hook personnalisé pour récupérer l'utilisateur courant
export default function useUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/users/me', { withCredentials: true });
                if (res.data) {
                    setUser(res.data);
                }
            } catch (err) {
                console.error('Erreur récupération utilisateur', err);
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    return user;
}
