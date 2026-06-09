import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ToastProvider } from './hooks/ToastContext'; 

// Páginas do Sistema
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Veterinarios from './pages/Veterinarios/Veterinarios';
import Animais from './pages/Animais/Animais';
import Tutores from './pages/Tutores/Tutores';
import Agendamentos from './pages/Agendamentos/Agendamentos';
import Usuarios from './pages/Usuarios/Usuarios'; // 🌟 1. IMPORTAÇÃO DA NOVA PÁGINA

// Layout
import AppLayout from './components/layout/AppLayout'; 

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider> 
          
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />

            {/* Rotas Protegidas */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/agendamentos" element={<Agendamentos />} />
              <Route path="/animais" element={<Animais />} />
              <Route path="/tutores" element={<Tutores />} />
              <Route path="/veterinarios" element={<Veterinarios />} />
              <Route path="/usuarios" element={<Usuarios />} /> {/* 🌟 2. REGISTRO DA ROTA ADM */}
            </Route>
          </Routes>

        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;