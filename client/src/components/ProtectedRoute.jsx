import { Navigate } from "react-router-dom";
import { useAuth } from '@/context/authContext'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/auth" />;
    }

    return children;
};

export default ProtectedRoute;

