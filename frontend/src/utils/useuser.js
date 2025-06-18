// src/utils/useUser.js
import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import Cookies from 'js-cookie';

export default function useUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (!token) return;

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }, []);

    return user;
}
