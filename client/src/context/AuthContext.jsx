import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const checkToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            logout();
            return false;
        }
        return true;
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            if (checkToken()) {
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
            if (user) {
                checkToken();
            }
        }, 60000); 

        return () => clearInterval(intervalId);
    }, [user]);

    const login = (userData) => {
        const { name, email, token } = userData;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ name, email }));
        setUser({ name, email });
        navigate('/chat');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
