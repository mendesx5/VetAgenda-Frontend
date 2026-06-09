import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Login.module.css';

const Login = () => {
    const [loginInput, setLoginInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!loginInput || !passwordInput) {
            setError('Por favor, preencha todos os campos.');
            setLoading(false);
            return;
        }

        const result = await login(loginInput, passwordInput);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message || 'Erro ao realizar login. Tente novamente.');
        }

        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* Cabeçalho do Card */}
                <div className={styles.header}>
                    <div className={styles.logo}>🐾</div>
                    <h2 className={styles.title}>VetAgenda</h2>
                    <p className={styles.subtitle}>Sistema Veterinário</p>
                </div>

                {/* Exibição de Erros */}
                {error && <div className={styles.errorBadge}>{error}</div>}

                {/* Formulário de Login */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Usuário / E-mail</label>
                        <input
                            type="text"
                            placeholder="Ex: admin@vetagenda.com"
                            value={loginInput}
                            onChange={(e) => setLoginInput(e.target.value)}
                            className={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Senha</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={`${styles.button} ${loading ? styles.buttonDisabled : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Autenticando...' : 'Entrar no Sistema'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;