'use client';

import { usePathname } from 'next/navigation';
import SideMenu from '@/components/sidemenu';
import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import useUser from '@/utils/useuser';

// Layout côté client : affiche ou masque le SideMenu selon la page
export default function LayoutClient({ children }) {
    const pathname = usePathname();

    // Masque le menu latéral sur la page d’accueil et les pages d’authentification
    const hideMenu =
        pathname === '/' ||
        pathname.startsWith('/auth/login') ||
        pathname.startsWith('/auth/register');

    // Si on est sur une page sans menu (ex: page d'accueil ou login/register)
    if (hideMenu) {
        return children;
    }

    // Récupère les infos de l'utilisateur connecté
    const currentUser = useUser();

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

    return (
        <div className="flex">
            <SideMenu />
            <main className="flex-1 p-4">
                {children && children.type?.name === 'Feed'
                    ? React.cloneElement(children, { currentUser })
                    : children}
            </main>
        </div>
    );
}
