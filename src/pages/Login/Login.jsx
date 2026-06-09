import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Ajustado os níveis dos pontinhos
import styles from './Login.module.css';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [loginInput, setLoginInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [roleInput, setRoleInput] = useState('RECEPCIONISTA');
    
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const toggleMode = () => {
        setIsRegister(!isRegister);
        setError('');
        setSuccessMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        if (!loginInput || !passwordInput) {
            setError('Por favor, preencha todos os campos.');
            setLoading(false);
            return;
        }

        if (isRegister) {
            try {
                const response = await fetch('http://localhost:8080/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ login: loginInput, password: passwordInput, role: roleInput })
                });

                if (response.ok) {
                    setSuccessMessage('Conta cadastrada com sucesso! Faça o login.');
                    setIsRegister(false);
                    setPasswordInput('');
                } else {
                    const textError = await response.text();
                    setError(textError || 'Erro ao cadastrar usuário.');
                }
            } catch (err) {
                setError('Não foi possível conectar ao servidor.');
            }
        } else {
            const result = await login(loginInput, passwordInput);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message || 'Erro ao realizar login. Tente novamente.');
            }
        }
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.card} ${isRegister ? styles.cardRegister : ''}`}>
                <div className={styles.header}>
                    <div className={styles.logo}>🐾</div>
                    <h2 className={styles.title}>VetAgenda</h2>
                    <p className={styles.subtitle}>
                        {isRegister ? 'Criar Nova Conta no Sistema' : 'Sistema Veterinário'}
                    </p>
                </div>

                {error && <div className={styles.errorBadge}>{error}</div>}
                {successMessage && <div className={styles.successBadge}>{successMessage}</div>}

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

                    <div className={styles.extraFields}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Nível de Acesso</label>
                            <select 
                                value={roleInput} 
                                onChange={(e) => setRoleInput(e.target.value)}
                                className={styles.input}
                                style={{ backgroundColor: 'white', height: '42px' }}
                            >
                                <option value="RECEPCIONISTA">RECEPCIONISTA (Atendimento/Agenda)</option>
                                <option value="VETERINARIO">VETERINÁRIO (Médico Veterinário)</option>
                                <option value="ADMIN">ADMIN (Dono/Gestor)</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className={`${styles.button} ${loading ? styles.buttonDisabled : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Processando...' : isRegister ? 'Cadastrar Funcionário' : 'Entrar no Sistema'}
                    </button>
                </form>

                <div className={styles.toggleContainer}>
                    <span className={styles.toggleText}>
                        {isRegister ? 'Já tem uma conta? ' : 'Precisa de um novo acesso? '}
                    </span>
                    <button type="button" onClick={toggleMode} className={styles.toggleButton}>
                        {isRegister ? 'Fazer Login' : 'Criar Conta (Dev)'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;