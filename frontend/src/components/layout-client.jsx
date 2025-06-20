'use client';

import { usePathname } from 'next/navigation';
import SideMenu from '@/components/sidemenu';

export default function LayoutClient({ children }) {
    const pathname = usePathname();

    const hideMenu =
        pathname === '/' ||
        pathname.startsWith('/auth/login') ||
        pathname.startsWith('/auth/register');

    if (hideMenu) {
        return children;
    }

    return (
        <div className="flex">
        <SideMenu />
        <main className="flex-1 p-4">{children}</main>
        </div>
    );
}
