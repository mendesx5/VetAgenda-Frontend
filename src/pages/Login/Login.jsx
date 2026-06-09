import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    // 1. Estados locais para capturar os inputs e gerenciar erros
    const [loginInput, setLoginInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 2. Injeta a função global de login do nosso Contexto e o navegador de rotas
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // 3. Função disparada ao submeter o formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validação básica antes de enviar ao Java
        if (!loginInput || !passwordInput) {
            setError('Por favor, preencha todos os campos.');
            setLoading(false);
            return;
        }

        // Dispara a requisição através do Contexto
        const result = await login(loginInput, passwordInput);

        if (result.success) {
            // Se o Java validou o token de 200 OK, redireciona para a tela principal
            navigate('/dashboard');
        } else {
            // Se deu erro (403, senha errada, etc.), exibe a mensagem na tela
            setError(result.message || 'Erro ao realizar login. Tente novamente.');
        }

        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Cabeçalho do Card */}
                <div style={styles.header}>
                    <div style={styles.logo}>🐾</div>
                    <h2 style={styles.title}>VetAgenda</h2>
                    <p style={styles.subtitle}>Sistema Veterinário</p>
                </div>

                {/* Exibição de Erros */}
                {error && <div style={styles.errorBadge}>{error}</div>}

                {/* Formulário de Login */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Usuário / E-mail</label>
                        <input
                            type="text"
                            placeholder="Ex: admin@vetagenda.com"
                            value={loginInput}
                            onChange={(e) => setLoginInput(e.target.value)}
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Senha</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Autenticando...' : 'Entrar no Sistema'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// 🎨 Estilos Inline simples para manter o padrão moderno e limpo do seu projeto original
const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f4', // stone-100
        fontFamily: 'sans-serif'
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        width: '100%',
        maxWidth: '400px'
    },
    header: {
        textAlign: 'center',
        marginBottom: '24px'
    },
    logo: {
        fontSize: '32px',
        marginBottom: '8px'
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#111827',
        margin: '0 0 4px 0'
    },
    subtitle: {
        fontSize: '14px',
        color: '#6b7280',
        margin: 0
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151'
    },
    input: {
        padding: '10px 14px',
        borderRadius: '6px',
        border: '1.5px solid #d6d3d1',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.2s'
    },
    button: {
        backgroundColor: '#10b981',
        color: '#ffffff',
        padding: '12px',
        borderRadius: '6px',
        border: 'none',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px',
        transition: 'background-color 0.2s'
    },
    buttonDisabled: {
        backgroundColor: '#a7f3d0',
        cursor: 'not-allowed'
    },
    errorBadge: {
        backgroundColor: '#fee2e2',
        color: '#ef4444',
        padding: '10px',
        borderRadius: '6px',
        fontSize: '14px',
        marginBottom: '16px',
        textAlign: 'center',
        fontWeight: '500'
    }
};

export default Login;