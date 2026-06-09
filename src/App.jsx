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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rota Inicial: Redireciona para o login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Rota Pública (Não usa o AppLayout para não mostrar o menu na tela de login) */}
          <Route path="/login" element={<Login />} />

          {/* 🌟 2. ROTAS PROTEGIDAS: Envelopadas com o AppLayout */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/veterinarios" element={<Veterinarios />} />
            <Route path="/animais" element={<Animais />} />
            <Route path="/tutores" element={<Tutores />} />
            <Route path="/agendamentos" element={<Agendamentos />} />
          </Route>


        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;