'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function RootLayoutClient({ children }) {
    const pathname = usePathname();
    const noHeaderRoutes = ['/', '/auth/login', '/auth/register'];
    const showHeader = !noHeaderRoutes.includes(pathname);

    return (
        <>
        {showHeader && <Header />}
        <main>{children}</main>
        <Footer />
        </>
    );
}
