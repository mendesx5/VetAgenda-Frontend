import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Veterinarios from './pages/Veterinarios/Veterinarios';
import Animais from './pages/Animais/Animais';
import Tutores from './pages/Tutores/Tutores';
import Agendamentos from './pages/Agendamentos/Agendamentos';

// 🌟 1. ADICIONE O IMPORT DO SEU COMPONENTE DE LAYOUT AQUI:
import AppLayout from './components/layout/AppLayout'; 
import { ToastProvider } from './hooks/ToastContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/veterinarios" element={<Veterinarios />} />
              <Route path="/animais" element={<Animais />} />
              <Route path="/tutores" element={<Tutores />} />
              <Route path="/agendamentos" element={<Agendamentos />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;