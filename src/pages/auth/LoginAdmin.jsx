import React, { useState } from 'react';
import useRequestStore from '../../store/request-store';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { actionLoginAdmin, loading, error } = useRequestStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await actionLoginAdmin(username, password, navigate);
        } catch (err) {
            // จัดการ Error เพิ่มเติมหากต้องการ
            console.error("Admin login failed in component:", err);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-8">LOGIN ADMIN</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'LOGGING IN...' : 'LOGIN'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginAdmin;