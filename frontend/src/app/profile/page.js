'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Profile() {
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (!token) {
            router.replace('/auth/login');
        }
    }, [router]);

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Notifications</h1>
            <p>Connected.</p>
        </div>
    );
}

