"use client";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();  // For navigation

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            alert('Login successful!');
            localStorage.setItem('user', JSON.stringify(res.data.user));  // Store user data
            router.push('/dashboard');  // Redirect to dashboard or home
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed!');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>

            <p>Don't have an account?
                <button onClick={() => router.push('/auth/register')} style={{ marginLeft: '10px' }}>
                    Register Here
                </button>
            </p>
        </div>
    );
}
