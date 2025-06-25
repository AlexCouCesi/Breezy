import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import Cookies from 'js-cookie';

// Hook personnalisé pour récupérer l'utilisateur courant
export default function useUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/users/me', { withCredentials: true });
                // Si l'utilisateur n'est pas trouvé, redirige vers la page de connexion
                if (!res.data) {
                    // router.replace('/auth/login');th/login');
              
                 } else {
                    return setUser(res.data);
                }
            } catch (err) {
                console.error('Erreur récupération utilisateur', err);
                // router.replace('/auth/login');
            }
        };

        fetchUser();
    }, []);

    return user;
}