'use client';

import { usePathname } from 'next/navigation';
import SideMenu from '@/components/sidemenu';
import FollowedList from './followedlist';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
    const [followingUsers, setFollowingUsers] = useState([]);
    const router = useRouter();

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

    useEffect(() => {
        const fetchFollowingUsers = async () => {
            if (currentUser?.following?.length) {
                try {
                    const users = await Promise.all(
                        currentUser.following.map(async (id) => {
                            const res = await axios.get(`/api/users/${id}`, { withCredentials: true });
                            return res.data;
                        })
                    );
                    setFollowingUsers(users);
                } catch (err) {
                    console.error('Erreur récupération des utilisateurs suivis', err);
                }
            } else {
                setFollowingUsers([]);
            }
        };

        fetchFollowingUsers();
    }, [currentUser]);

    // Sinon, affiche le layout avec le SideMenu
    // Pour passer des props à Feed, il faut que `children` soit un composant Feed
    // et qu'on le clone avec React.cloneElement pour injecter des props
    // Exemple : on veut passer `currentUser` à Feed si c'est bien Feed

    return (
        <div className="flex">
            <SideMenu />
            <main className="flex-1 p-4">
                {children && children.type?.name === 'Feed'
                    ? React.cloneElement(children, { currentUser })
                    : children}
            </main>
            <FollowedList followingList={followingUsers} />
        </div>
    );
}
