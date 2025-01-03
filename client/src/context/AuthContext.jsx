import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const checkTokenExpiration = () => {
        const token = localStorage.getItem('token');
        const expiresTime = localStorage.getItem('expiresAt');
        
        if (!token || !expiresTime) {
            logout();
            return false;
        }

        const now = new Date();
        const expirationDate = new Date(expiresTime);
        
        if (now >= expirationDate) {
            logout();
            return false;
        }
        return true;
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            if (checkTokenExpiration()) {
                setIsAuthenticated(true);
                setUser(JSON.parse(userData));
            } else {
                logout();
            }
        } else if (window.location.pathname !== '/' && window.location.pathname !== '/auth') {
            navigate('/auth');
        }
    }, [navigate]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isAuthenticated) {
                checkTokenExpiration();
            }
        }, 60000); 

        return () => clearInterval(intervalId);
    }, [isAuthenticated]);

    const login = (userData) => {
        const { name, email, token, expires_at } = userData;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ name, email }));
        localStorage.setItem('expiresAt', expires_at);
        setUser({ name, email });
        setIsAuthenticated(true);
        navigate('/chat');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('expiresAt');
        setUser(null);
        setIsAuthenticated(false);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
