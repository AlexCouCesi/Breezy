'use client';

import { usePathname } from 'next/navigation';
import SideMenu from '@/components/sidemenu';

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

    // Sinon, affiche le layout avec le SideMenu
    return (
        <div className="flex">
            <SideMenu />
            <main className="flex-1 p-4">{children}</main>
        </div>
    );
}
