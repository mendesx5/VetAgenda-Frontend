import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { authenticated, user, loading } = useContext(AuthContext);

    if (loading) return <div>Carregando sistema...</div>;

    if (!authenticated) {
        // Redireciona para o login se não estiver autenticado
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Se estiver autenticado mas não tiver o cargo necessário (ex: USER tentando ver tela de ADMIN)
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;