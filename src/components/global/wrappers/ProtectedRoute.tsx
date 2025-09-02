import React from "react";
import useSessionTimeout from "../utils/useSessionTimeout"; 
import { Navigate } from "react-router-dom";
import { useAuth } from "../wrappers/AuthContext"; 

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    useSessionTimeout();

    return user ? <>{children}</> : <Navigate to="/acceso-admn2-Y25a" replace />;
};

export default ProtectedRoute;
