import { useState, useEffect, useMemo } from 'react';
import { agendamentosApi, animaisApi, veterinariosApi } from '../../api/client';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { FormGrid, FormGroup, Label, Input, Select, Textarea } from '../../components/ui/Form';
import EmptyState from '../../components/ui/EmptyState';
import { useToastContext } from '../../hooks/ToastContext';
import { formatDate, animalEmoji } from '../../utils/helpers';
import styles from './Agendamentos.module.css';

const FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'AGENDADO', label: 'Agendados' },
  { key: 'CONFIRMADO', label: 'Confirmados' },
  { key: 'CONCLUIDO', label: 'Concluídos' },
  { key: 'CANCELADO', label: 'Cancelados' },
];

export default function Agendamentos() {
  const toast = useToastContext();

  const [agendamentos, setAgendamentos] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState('todos');
  const [search, setSearch] = useState('');

  // Novo agendamento modal
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ animalId: '', veterinarioId: '', dataHora: '' });

  // Cancelar modal
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelId, setCancelId] = useState(null);

  async function loadAll() {
    try {
      const [ags, animaisData, vetsData] = await Promise.all([
        agendamentosApi.listar(),
        animaisApi.listar().catch(() => []),
        veterinariosApi.listar().catch(() => []),
      ]);
      setAgendamentos(ags);
      setAnimais(animaisData);
      setVets(vetsData);
    } catch {
      toast('Erro ao carregar agendamentos. Verifique a API.', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  const filtered = useMemo(() => {
    let data = agendamentos;
    if (filter !== 'todos') data = data.filter((a) => a.status === filter);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (a) =>
          (a.nomeAnimal || '').toLowerCase().includes(q) ||
          (a.nomeVeterinario || '').toLowerCase().includes(q) ||
          String(a.id).includes(q),
      );
    }
    return data;
  }, [agendamentos, filter, search]);

  async function handleCriar() {
    const { animalId, veterinarioId, dataHora } = form;
    if (!animalId || !veterinarioId || !dataHora) {
      toast('Preencha todos os campos obrigatórios.', 'error');
      return;
    }
    try {
      await agendamentosApi.criar({
        animalId: Number(animalId),
        veterinarioId: Number(veterinarioId),
        dataHora: dataHora + ':00',
        status: 'AGENDADO',
      });
      toast('Agendamento criado com sucesso!');
      setModalOpen(false);
      setForm({ animalId: '', veterinarioId: '', dataHora: '' });
      loadAll();
    } catch (e) {
      toast('Erro: ' + e.message, 'error');
    }
  }

  async function handleStatus(id, acao) {
    try {
      if (acao === 'confirmar') await agendamentosApi.confirmar(id);
      else if (acao === 'concluir') await agendamentosApi.concluir(id);
      toast('Status atualizado!');
      loadAll();
    } catch (e) {
      toast('Erro: ' + e.message, 'error');
    }
  }

  async function handleCancelar() {
    try {
      await agendamentosApi.cancelar(cancelId);
      toast('Agendamento cancelado.');
      setCancelModal(false);
      loadAll();
    } catch (e) {
      toast('Erro: ' + e.message, 'error');
    }
  }

  async function handleDeletar(id) {
    if (!confirm('Deseja excluir este agendamento?')) return;
    try {
      await agendamentosApi.deletar(id);
      toast('Agendamento excluído.');
      loadAll();
    } catch (e) {
      toast('Erro: ' + e.message, 'error');
    }
  }

  return (
    <div>
      <div className={styles.sectionHeader}>
        <div>
          <h1 className={styles.heading}>Agendamentos</h1>
          <p className={styles.desc}>Gerencie todas as consultas e procedimentos veterinários</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <IconPlus /> Novo Agendamento
        </Button>
      </div>

      <div className={styles.filtersBar}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`${styles.chip} ${filter === f.key ? styles.chipActive : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
        <div className={styles.searchWrap}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Animal</th>
                <th>Veterinário</th>
                <th>Data / Hora</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className={styles.emptyCell}>Carregando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className={styles.emptyCell}>Nenhum agendamento encontrado.</td></tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id}>
                    <td><span className={styles.idCell}>#{a.id}</span></td>
                    <td>
                      <div className={styles.animalChip}>
                        <div className={styles.animalAvatar}>🐾</div>
                        {a.nomeAnimal || '—'}
                      </div>
                    </td>
                    <td>{a.nomeVeterinario || '—'}</td>
                    <td className={styles.dateCell}>{formatDate(a.dataHora)}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>
                      <div className={styles.actions}>
                        {a.status === 'AGENDADO' && (
                          <Button variant="ghost" size="sm" onClick={() => handleStatus(a.id, 'confirmar')}>
                            ✓ Confirmar
                          </Button>
                        )}
                        {a.status === 'CONFIRMADO' && (
                          <Button variant="ghost" size="sm" onClick={() => handleStatus(a.id, 'concluir')}>
                            ✓ Concluir
                          </Button>
                        )}
                        {(a.status === 'AGENDADO' || a.status === 'CONFIRMADO') && (
                          <Button variant="danger" size="sm" onClick={() => { setCancelId(a.id); setCancelModal(true); }}>
                            Cancelar
                          </Button>
                        )}
                        <Button variant="danger" size="icon" onClick={() => handleDeletar(a.id)}>
                          <IconTrash />
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

      {/* Modal: Novo Agendamento */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo Agendamento"
        subtitle="Preencha os dados da consulta"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleCriar}>Salvar Agendamento</Button>
          </>
        }
      >
        <FormGrid cols={1}>
          <FormGroup>
            <Label required>Animal</Label>
            <Select value={form.animalId} onChange={(e) => setForm({ ...form, animalId: e.target.value })}>
              <option value="">Selecione um animal...</option>
              {animais.map((a) => (
                <option key={a.id} value={a.id}>
                  {animalEmoji(a.especie)} {a.name}
                </option>
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <Label required>Veterinário</Label>
            <Select value={form.veterinarioId} onChange={(e) => setForm({ ...form, veterinarioId: e.target.value })}>
              <option value="">Selecione um veterinário...</option>
              {vets.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — {v.crmv || ''}
                </option>
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <Label required>Data e Hora</Label>
            <Input
              type="datetime-local"
              value={form.dataHora}
              onChange={(e) => setForm({ ...form, dataHora: e.target.value })}
            />
          </FormGroup>
        </FormGrid>
      </Modal>

      {/* Modal: Cancelar */}
      <Modal
        open={cancelModal}
        onClose={() => setCancelModal(false)}
        title="Cancelar Agendamento"
        subtitle="Confirme o cancelamento"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCancelModal(false)}>Voltar</Button>
            <Button variant="danger" onClick={handleCancelar}>Confirmar Cancelamento</Button>
          </>
        }
      >
        <p style={{ fontSize: 14, color: 'var(--stone-600)' }}>
          Tem certeza que deseja cancelar este agendamento? Esta ação pode ser revertida alterando o status manualmente.
        </p>
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
