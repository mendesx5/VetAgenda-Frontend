import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Ao carregar o app, verifica se já existe um usuário logado no navegador
        const recoveredToken = localStorage.getItem('vetagenda_token');
        const recoveredRole = localStorage.getItem('vetagenda_role');

        if (recoveredToken && recoveredRole) {
            setUser({ token: recoveredToken, role: recoveredRole });
        }
        setLoading(false);
    }, []);

    const login = async (loginRequest, passwordRequest) => {
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: loginRequest, password: passwordRequest })
            });

            if (!response.ok) throw new Error('Usuário ou senha inválidos');

            const data = await response.json(); // Recebe { token, role } do seu Java
            
            // Salva no navegador para não deslogar ao dar F5
            localStorage.setItem('vetagenda_token', data.token);
            localStorage.setItem('vetagenda_role', data.role);

            setUser({ token: data.token, role: data.role });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('vetagenda_token');
        localStorage.removeItem('vetagenda_role');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ authenticated: !!user, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};