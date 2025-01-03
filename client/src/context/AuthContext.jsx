import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const navigate = useNavigate();

    const checkToken = () => {
        const token = localStorage.getItem('token');
        const expiresAt = localStorage.getItem('expiresAt');
        
        if (!token || !expiresAt) {
            return false;
        }

        if (new Date(expiresAt) < new Date()) {
            return false;
        }
        
        return true;
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const currentPath = window.location.pathname;
        
        if (token && userData && checkToken()) {
            setUser(JSON.parse(userData));
            if (currentPath === '/auth') {
                navigate('/chat');
            }
        } else {
            logout();
            if (currentPath !== '/' && currentPath !== '/auth') {
                navigate('/auth');
            }
        }
        
        setIsInitialized(true);
    }, [navigate]);

    const login = (userData) => {
        const { name, email, token, expires_at } = userData;
        localStorage.setItem('token', token);
        localStorage.setItem('expiresAt', expires_at);
        localStorage.setItem('user', JSON.stringify({ name, email }));
        setUser({ name, email });
        navigate('/chat');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('expiresAt');
        setUser(null);
        if (window.location.pathname !== '/' && window.location.pathname !== '/auth') {
            navigate('/auth');
        }
    };

    if (!isInitialized) {
        return null; 
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
