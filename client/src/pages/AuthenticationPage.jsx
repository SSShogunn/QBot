import { useState, useEffect } from 'react'
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Bot } from 'lucide-react'

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
            `${import.meta.env.VITE_BACKEND_URL}/auth/login` : 
            `${import.meta.env.VITE_BACKEND_URL}/auth/register`

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.detail || 'Authentication failed')
            }

            if (data.token) {
                login(data);
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <div className="flex items-center gap-2 mb-8">
                <Bot className="h-6 w-6 text-primary" />
                <span className="text-2xl font-bold">QBot</span>
            </div>
            
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <h2 className="text-2xl font-bold text-center">
                        {isLogin ? 'Welcome back' : 'Create an account'}
                    </h2>
                    <p className="text-sm text-muted-foreground text-center">
                        {isLogin 
                            ? 'Enter your credentials to access your account' 
                            : 'Enter your details to create your account'}
                    </p>
                </CardHeader>
                
                <CardContent>
                    {error && (
                        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </Button>
                    </form>
                </CardContent>
                
                <CardFooter>
                    <p className="text-sm text-center w-full text-muted-foreground">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin)
                                setError('')
                                setFormData({ name: '', email: '', password: '' })
                            }}
                            className="text-primary hover:underline font-medium"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default AuthenticationPage

