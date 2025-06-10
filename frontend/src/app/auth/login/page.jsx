'use client'
import { useState } from 'react'
import axios from 'axios'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e) => {
    e.preventDefault()
    try {
        const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
        })
        localStorage.setItem('token', res.data.token)
      // rediriger ou stocker le token comme tu veux
    } catch (err) {
        console.error(err)
    }
}

return (
    <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Se connecter</button>
    </form>
)
}