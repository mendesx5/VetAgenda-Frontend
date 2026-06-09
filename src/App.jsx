import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './hooks/ToastContext';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Agendamentos from './pages/Agendamentos/Agendamentos';
import Animais from './pages/Animais/Animais';
import Tutores from './pages/Tutores/Tutores';
import Veterinarios from './pages/Veterinarios/Veterinarios';
import './styles/globals.css';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/"              element={<Dashboard />} />
            <Route path="/agendamentos"  element={<Agendamentos />} />
            <Route path="/animais"       element={<Animais />} />
            <Route path="/tutores"       element={<Tutores />} />
            <Route path="/veterinarios"  element={<Veterinarios />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
