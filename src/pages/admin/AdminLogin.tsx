import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === 'admin@constil.com' && password === 'admin123') {
            localStorage.setItem('constil_admin_auth', 'true');
            navigate('/admin/dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-border">
                <h2 className="text-2xl font-bold text-center mb-6 text-foreground">Admin Login</h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Email</label>
                        <input 
                            type="email" 
                            className="w-full border border-border rounded-lg p-2 focus:ring-primary focus:border-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700">Password</label>
                        <input 
                            type="password" 
                            className="w-full border border-border rounded-lg p-2 focus:ring-primary focus:border-primary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
