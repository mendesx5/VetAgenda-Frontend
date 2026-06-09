import { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { FormGrid, FormGroup, Label, Input } from '../../components/ui/Form';
import { useToastContext } from '../../hooks/ToastContext';
import pageStyles from '../Agendamentos/Agendamentos.module.css';

export default function Usuarios() {
  const toast = useToastContext();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para o Modal de Redefinição de Senha
  const [modalSenhaOpen, setModalSenhaOpen] = useState(false);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState(null);
  const [novaSenha, setNovaSenha] = useState('');

  // 🔍 1. Busca todos os funcionários do Back-end
  async function load() {
    try {
      const response = await fetch('http://localhost:8080/api/usuarios', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vetagenda_token')}` // Garante o envio do JWT se houver
        }
      });
      if (!response.ok) throw new Error('Erro ao buscar dados');
      const dados = await response.json();
      setUsuarios(dados);
    } catch {
      toast('Erro ao carregar lista de funcionários.', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // 🔄 2. Dispara a inversão de status (Ativo <-> Desativado)
  async function handleToggleStatus(id) {
    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vetagenda_token')}`
        }
      });
      if (!response.ok) throw new Error('Erro ao alterar status');
      
      toast('Status do usuário atualizado com sucesso!');
      load(); // Recarrega a tabela automaticamente sem dar F5
    } catch (e) {
      toast('Erro ao alterar status: ' + e.message, 'error');
    }
  }

  // 🔑 3. Dispara a redefinição de senha para o back-end
  async function handleRedefinirSenha() {
    if (!novaSenha) {
      toast('A nova senha não pode estar em branco.', 'error');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${selectedUsuarioId}/redefinir-senha`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ password: novaSenha })
      });
      if (!response.ok) throw new Error('Erro ao redefinir senha');

      toast('Senha redefinida com sucesso!');
      setModalSenhaOpen(false);
      setNovaSenha('');
    } catch (e) {
      toast('Erro: ' + e.message, 'error');
    }
  }

  function abrirModalSenha(id) {
    setSelectedUsuarioId(id);
    setModalSenhaOpen(true);
  }

  return (
    <div>
      <div className={pageStyles.sectionHeader}>
        <div>
          <h1 className={pageStyles.heading}>Gerenciamento de Equipe</h1>
          <p className={pageStyles.desc}>Controle de acessos, cargos e permissões dos funcionários</p>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className={pageStyles.card}>
        <div className={pageStyles.tableWrap}>
          <table className={pageStyles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuário / E-mail</th>
                <th>Cargo / Nível</th>
                <th>Status da Conta</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className={pageStyles.emptyCell}>Carregando equipe...</td></tr>
              ) : usuarios.length === 0 ? (
                <tr><td colSpan={5} className={pageStyles.emptyCell}>Nenhum usuário encontrado.</td></tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id}>
                    <td><span className={pageStyles.idCell}>#{u.id}</span></td>
                    <td><strong>{u.login}</strong></td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px', 
                        fontWeight: 'bold',
                        backgroundColor: u.role === 'ADMIN' ? '#fef3c7' : '#e0f2fe',
                        color: u.role === 'ADMIN' ? '#d97706' : '#0284c7'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: u.ativo ? '#16a34a' : '#dc2626' 
                      }}>
                        {u.ativo ? '● Ativo' : '○ Bloqueado'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button 
                          variant={u.ativo ? 'danger' : 'secondary'} 
                          size="sm" 
                          onClick={() => handleToggleStatus(u.id)}
                        >
                          {u.ativo ? 'Bloquear' : 'Ativar'}
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => abrirModalSenha(u.id)}
                        >
                          <IconKey /> Alterar Senha
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Redefinição de Senha */}
      <Modal
        open={modalSenhaOpen}
        onClose={() => setModalSenhaOpen(false)}
        title="Redefinir Senha"
        subtitle="Digite as novas credenciais de acesso para este funcionário"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalSenhaOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleRedefinirSenha}>Salvar Nova Senha</Button>
          </>
        }
      >
        <FormGrid cols={1}>
          <FormGroup>
            <Label required>Nova Senha</Label>
            <Input 
              type="password" 
              placeholder="Mínimo 6 caracteres" 
              value={novaSenha} 
              onChange={(e) => setNovaSenha(e.target.value)} 
            />
          </FormGroup>
        </FormGrid>
      </Modal>
    </div>
  );
}

// Ícone Auxiliar para o botão de chave
function IconKey() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginRight: '4px', verticalAlign: 'middle' }}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
}