import { useState, useEffect } from 'react';
import { tutoresApi } from '../../api/client';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { FormGrid, FormGroup, Label, Input } from '../../components/ui/Form';
import { useToastContext } from '../../hooks/ToastContext';
import { getInitials } from '../../utils/helpers';
import pageStyles from '../Agendamentos/Agendamentos.module.css';
import styles from './Tutores.module.css';

export default function Tutores() {
  const toast = useToastContext();
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', cpf: '', email: '', telefone: '' });

  async function load() {
    try {
      setTutores(await tutoresApi.listar());
    } catch {
      toast('Erro ao carregar tutores.', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function field(key) {
    return (e) => setForm({ ...form, [key]: e.target.value });
  }

  async function handleCriar() {
    if (!form.name || !form.cpf) {
      toast('Nome e CPF são obrigatórios.', 'error');
      return;
    }
    try {
      await tutoresApi.criar({
        name: form.name,
        cpf: form.cpf,
        email: form.email || null,
        telefone: form.telefone || null,
      });
      toast('Tutor cadastrado!');
      setModalOpen(false);
      setForm({ name: '', cpf: '', email: '', telefone: '' });
      load();
    } catch (e) {
      toast('Erro: ' + e.message, 'error');
    }
  }

  async function handleDeletar(id) {
    if (!confirm('Excluir este tutor?')) return;
    try {
      await tutoresApi.deletar(id);
      toast('Tutor removido.');
      load();
    } catch (e) {
      toast('Erro: ' + e.message, 'error');
    }
  }

  return (
    <div>
      <div className={pageStyles.sectionHeader}>
        <div>
          <h1 className={pageStyles.heading}>Tutores</h1>
          <p className={pageStyles.desc}>Donos e responsáveis pelos animais</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <IconPlus /> Novo Tutor
        </Button>
      </div>

      <div className={pageStyles.card}>
        <div className={pageStyles.tableWrap}>
          <table className={pageStyles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className={pageStyles.emptyCell}>Carregando...</td></tr>
              ) : tutores.length === 0 ? (
                <tr><td colSpan={6} className={pageStyles.emptyCell}>Nenhum tutor cadastrado.</td></tr>
              ) : (
                tutores.map((t) => (
                  <tr key={t.id}>
                    <td><span className={pageStyles.idCell}>#{t.id}</span></td>
                    <td>
                      <div className={styles.tutorChip}>
                        <div className={styles.avatar}>{getInitials(t.name)}</div>
                        <strong>{t.name}</strong>
                      </div>
                    </td>
                    <td className={styles.mutedCell}>{t.cpf || '—'}</td>
                    <td className={styles.mutedCell}>{t.email || '—'}</td>
                    <td className={styles.mutedCell}>{t.telefone || '—'}</td>
                    <td>
                      <Button variant="danger" size="icon" onClick={() => handleDeletar(t.id)}>
                        <IconTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo Tutor"
        subtitle="Dono ou responsável pelo animal"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleCriar}>Salvar Tutor</Button>
          </>
        }
      >
        <FormGrid cols={2}>
          <FormGroup span={2}>
            <Label required>Nome completo</Label>
            <Input placeholder="Ex: João da Silva" value={form.name} onChange={field('name')} />
          </FormGroup>
          <FormGroup span={2}>
            <Label required>CPF</Label>
            <Input placeholder="000.000.000-00" value={form.cpf} onChange={field('cpf')} />
          </FormGroup>
          <FormGroup span={2}>
            <Label>E-mail</Label>
            <Input type="email" placeholder="joao@email.com" value={form.email} onChange={field('email')} />
          </FormGroup>
          <FormGroup span={2}>
            <Label>Telefone</Label>
            <Input placeholder="(84) 99999-9999" value={form.telefone} onChange={field('telefone')} />
          </FormGroup>
        </FormGrid>
      </Modal>
    </div>
  );
}

function IconPlus() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
}
function IconTrash() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
}
