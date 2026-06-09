import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Login.module.css';

const Login = () => {
    // Controla se a tela está em modo de Login ou modo de Registro
    const [isRegister, setIsRegister] = useState(false);

    const [loginInput, setLoginInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [roleInput, setRoleInput] = useState('USER'); // Padrão: Funcionário comum
    
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Limpa os campos e mensagens ao alternar de tela
    const toggleMode = () => {
        setIsRegister(!isRegister);
        setError('');
        setSuccessMessage('');
        setLoginInput('');
        setPasswordInput('');
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
            // LÓGICA DE REGISTRO (Chama o seu endpoint /auth/register do Java)
            try {
                const response = await fetch('http://localhost:8080/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ login: loginInput, password: passwordInput, role: roleInput })
                });

                if (response.ok) {
                    setSuccessMessage('Usuário cadastrado com sucesso! Faça o login.');
                    setIsRegister(false); // Volta para a tela de login
                    setPasswordInput(''); // Limpa a senha por segurança
                } else {
                    const textError = await response.text();
                    setError(textError || 'Erro ao cadastrar usuário.');
                }
            } catch (err) {
                setError('Não foi possível conectar ao servidor.');
            }
        } else {
            // LÓGICA DE LOGIN COMUM
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
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>🐾</div>
                    <h2 className={styles.title}>VetAgenda</h2>
                    <p className={styles.subtitle}>
                        {isRegister ? 'Criar Nova Conta no Sistema' : 'Sistema Veterinário'}
                    </p>
                </div>

                {error && <div className={styles.errorBadge}>{error}</div>}
                {successMessage && <div style={{backgroundColor: '#d1fae5', color: '#065f46'}} className={styles.errorBadge}>{successMessage}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Usuário / E-mail</label>
                        <input
                            type="text"
                            placeholder="Ex: funcionario@vetagenda.com"
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

                    {/* Campo extra que SÓ APARECE se estiver no modo de Registro */}
                    {isRegister && (
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Nível de Acesso</label>
                            <select 
                                value={roleInput} 
                                onChange={(e) => setRoleInput(e.target.value)}
                                className={styles.input}
                                style={{backgroundColor: 'white', height: '42px'}}
                            >
                                <option value="USER">USER (Veterinário/Funcionário)</option>
                                <option value="ADMIN">ADMIN (Dono/Gestor)</option>
                            </select>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className={`${styles.button} ${loading ? styles.buttonDisabled : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Processando...' : isRegister ? 'Cadastrar Funcionário' : 'Entrar no Sistema'}
                    </button>
                </form>

                {/* Link amigável para alternar entre as duas telas */}
                <div style={{marginTop: '20px', textAlign: 'center', fontSize: '14px'}}>
                    <span style={{color: '#6b7280'}}>
                        {isRegister ? 'Já tem uma conta? ' : 'Precisa de um novo acesso? '}
                    </span>
                    <button 
                        onClick={toggleMode}
                        style={{background: 'none', border: 'none', color: '#10b981', fontWeight: 'bold', cursor: 'pointer', padding: 0, textDecoration: 'underline'}}
                    >
                        {isRegister ? 'Fazer Login' : 'Criar Conta (Dev)'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;