import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function AuthenticationPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: ''
    })
    const [error, setError] = useState('')
    const { login, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/chat');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        
        const endpoint = isLogin ? 
            'http://127.0.0.1:8000/auth/login' : 
            'http://127.0.0.1:8000/auth/register'

        try {
            console.log('Submitting form:', formData);
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            console.log('Response data:', data);

            if (!response.ok) {
                throw new Error(data.detail || 'Authentication failed')
            }

            if (data.token) {
                login({
                    name: data.name,
                    email: data.email,
                    token: data.token
                });
            } else {
                if (isLogin) {
                    throw new Error('No token received')
                } else {
                    setIsLogin(true)
                    setFormData({ name: '', email: '', password: '' })
                }
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isLogin ? 'Login' : 'Register'}
                </h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block mb-2">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    )}
                    
                    <div className="mb-4">
                        <label className="block mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="block mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                
                <p className="mt-4 text-center">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin)
                            setError('')
                            setFormData({ name: '', email: '', password: '' })
                        }}
                        className="text-blue-500 hover:text-blue-600"
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    )
}

export default AuthenticationPage

