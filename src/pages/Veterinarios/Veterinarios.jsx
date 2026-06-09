import { useState, useEffect } from 'react';
import { veterinariosApi, agendamentosApi } from '../../api/client';
import { EspBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { FormGrid, FormGroup, Label, Input, Select } from '../../components/ui/Form';
import { useToastContext } from '../../hooks/ToastContext';
import { getInitials } from '../../utils/helpers';
import pageStyles from '../Agendamentos/Agendamentos.module.css';
import styles from './Veterinarios.module.css';

export default function Veterinarios() {
  const toast = useToastContext();
  const [vets, setVets] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', crmv: '', especialidade: '' });

  async function load() {
    try {
      const [v, a] = await Promise.all([
        veterinariosApi.listar(),
        agendamentosApi.listar().catch(() => []),
      ]);
      setVets(v);
      setAgendamentos(a);
    } catch {
      toast('Erro ao carregar veterinários.', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function field(key) {
    return (e) => setForm({ ...form, [key]: e.target.value });
  }

  // Calcula consultas ativas por nome (mesmo critério do script.js corrigido)
  function consultasAtivas(vetName) {
    return agendamentos.filter(
      (a) =>
        a.nomeVeterinario === vetName &&
        (a.status === 'AGENDADO' || a.status === 'CONFIRMADO'),
    ).length;
  }

  async function handleCriar() {
    if (!form.name || !form.crmv) {
      toast('Nome e CRMV são obrigatórios.', 'error');
      return;
    }
    try {
      await veterinariosApi.criar({
        name: form.name,
        crmv: form.crmv,
        especialidade: form.especialidade || null,
      });
      toast('Veterinário cadastrado!');
      setModalOpen(false);
      setForm({ name: '', crmv: '', especialidade: '' });
      load();
    } catch (e) {
      toast('Erro: ' + e.message, 'error');
    }
  }

  async function handleDeletar(id) {
    if (!confirm('Excluir este veterinário?')) return;
    try {
      await veterinariosApi.deletar(id);
      toast('Veterinário removido.');
      load();
    } catch (e) {
      toast('Erro: ' + e.message, 'error');
    }
  }

  return (
    <div>
      <div className={pageStyles.sectionHeader}>
        <div>
          <h1 className={pageStyles.heading}>Veterinários</h1>
          <p className={pageStyles.desc}>Profissionais registrados na clínica</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <IconPlus /> Novo Veterinário
        </Button>
      </div>

      <div className={pageStyles.card}>
        <div className={pageStyles.tableWrap}>
          <table className={pageStyles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>CRMV</th>
                <th>Especialidade</th>
                <th>Consultas ativas</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className={pageStyles.emptyCell}>Carregando...</td></tr>
              ) : vets.length === 0 ? (
                <tr><td colSpan={6} className={pageStyles.emptyCell}>Nenhum veterinário cadastrado.</td></tr>
              ) : (
                vets.map((v) => (
                  <tr key={v.id}>
                    <td><span className={pageStyles.idCell}>#{v.id}</span></td>
                    <td>
                      <div className={styles.vetChip}>
                        <div className={styles.avatar}>{getInitials(v.name)}</div>
                        <strong>{v.name}</strong>
                      </div>
                    </td>
                    <td>
                      <code className={styles.crmv}>{v.crmv || '—'}</code>
                    </td>
                    <td><EspBadge especialidade={v.especialidade} /></td>
                    <td>
                      <span className={styles.consultasCount}>
                        {consultasAtivas(v.name)} consultas
                      </span>
                    </td>
                    <td>
                      <Button variant="danger" size="icon" onClick={() => handleDeletar(v.id)}>
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
        title="Cadastrar Veterinário"
        subtitle="Profissional da clínica"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleCriar}>Cadastrar</Button>
          </>
        }
      >
        <FormGrid cols={2}>
          <FormGroup span={2}>
            <Label required>Nome</Label>
            <Input placeholder="Dr(a). Nome Sobrenome" value={form.name} onChange={field('name')} />
          </FormGroup>
          <FormGroup>
            <Label required>CRMV</Label>
            <Input placeholder="CRMV-RN 12345" value={form.crmv} onChange={field('crmv')} />
          </FormGroup>
          <FormGroup>
            <Label>Especialidade</Label>
            <Select value={form.especialidade} onChange={field('especialidade')}>
              <option value="">Selecione...</option>
              <option value="CLINICO_GERAL">Clínico Geral</option>
              <option value="DERMATOLOGIA">Dermatologia</option>
              <option value="ORTOPEDIA">Ortopedia</option>
              <option value="CARDIOLOGIA">Cardiologia</option>
              <option value="OFTAMOLOGIA">Oftalmologia</option>
            </Select>
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
