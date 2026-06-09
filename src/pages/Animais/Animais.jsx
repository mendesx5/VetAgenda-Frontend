import { useState, useEffect } from 'react';
import { animaisApi, tutoresApi } from '../../api/client';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { FormGrid, FormGroup, Label, Input, Select, FormHint } from '../../components/ui/Form';
import { useToastContext } from '../../hooks/ToastContext';
import { animalEmoji, toBackendDate } from '../../utils/helpers';
import pageStyles from '../Agendamentos/Agendamentos.module.css';

export default function Animais() {
  const toast = useToastContext();
  const [animais, setAnimais] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', especie: '', raca: '', dataNascimento: '', peso: '', tutorId: '',
  });

  async function load() {
    try {
      const [a, t] = await Promise.all([
        animaisApi.listar(),
        tutoresApi.listar().catch(() => []),
      ]);
      setAnimais(a);
      setTutores(t);
    } catch {
      toast('Erro ao carregar animais.', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function field(key) {
    return (e) => setForm({ ...form, [key]: e.target.value });
  }

  async function handleCriar() {
    if (!form.name || !form.tutorId) {
      toast('Nome e tutor são obrigatórios.', 'error');
      return;
    }
    try {
      await animaisApi.criar({
        name: form.name,
        especie: form.especie || null,
        raca: form.raca || null,
        dataNascimento: toBackendDate(form.dataNascimento), // DD/MM/YYYY
        peso: form.peso ? Number(form.peso) : null,
        tutorId: Number(form.tutorId),
      });
      toast('Animal cadastrado!');
      setModalOpen(false);
      setForm({ name: '', especie: '', raca: '', dataNascimento: '', peso: '', tutorId: '' });
      load();
    } catch (e) {
      toast('Erro: ' + e.message, 'error');
    }
  }

  async function handleDeletar(id) {
    if (!confirm('Excluir este animal?')) return;
    try {
      await animaisApi.deletar(id);
      toast('Animal removido.');
      load();
    } catch (e) {
      toast('Erro: ' + e.message, 'error');
    }
  }

  return (
    <div>
      <div className={pageStyles.sectionHeader}>
        <div>
          <h1 className={pageStyles.heading}>Animais</h1>
          <p className={pageStyles.desc}>Pacientes cadastrados na clínica</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <IconPlus /> Cadastrar Animal
        </Button>
      </div>

      <div className={pageStyles.card}>
        <div className={pageStyles.tableWrap}>
          <table className={pageStyles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Espécie</th>
                <th>Raça</th>
                <th>Peso</th>
                <th>Tutor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className={pageStyles.emptyCell}>Carregando...</td></tr>
              ) : animais.length === 0 ? (
                <tr><td colSpan={7} className={pageStyles.emptyCell}>Nenhum animal cadastrado.</td></tr>
              ) : (
                animais.map((a) => (
                  <tr key={a.id}>
                    <td><span className={pageStyles.idCell}>#{a.id}</span></td>
                    <td>
                      <div className={pageStyles.animalChip}>
                        <div className={pageStyles.animalAvatar}>{animalEmoji(a.especie)}</div>
                        <strong>{a.name}</strong>
                      </div>
                    </td>
                    <td>{a.especie || '—'}</td>
                    <td>{a.raca || '—'}</td>
                    <td>{a.peso ? `${a.peso} kg` : '—'}</td>
                    <td>{a.nomeTutor || '—'}</td>
                    <td>
                      <Button variant="danger" size="icon" onClick={() => handleDeletar(a.id)}>
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
        title="Cadastrar Animal"
        subtitle="Novo paciente da clínica"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleCriar}>Cadastrar Animal</Button>
          </>
        }
      >
        <FormGrid cols={2}>
          <FormGroup span={2}>
            <Label required>Nome</Label>
            <Input placeholder="Ex: Rex, Bolinha, Mia..." value={form.name} onChange={field('name')} />
          </FormGroup>
          <FormGroup>
            <Label>Espécie</Label>
            <Select value={form.especie} onChange={field('especie')}>
              <option value="">Selecione...</option>
              <option value="Cachorro">🐕 Cachorro</option>
              <option value="Gato">🐈 Gato</option>
              <option value="Ave">🦜 Ave</option>
              <option value="Coelho">🐇 Coelho</option>
              <option value="Hamster">🐹 Hamster</option>
              <option value="Réptil">🦎 Réptil</option>
              <option value="Outro">Outro</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Raça</Label>
            <Input placeholder="Ex: Golden Retriever" value={form.raca} onChange={field('raca')} />
          </FormGroup>
          <FormGroup>
            <Label>Data de Nascimento</Label>
            <Input type="date" value={form.dataNascimento} onChange={field('dataNascimento')} />
          </FormGroup>
          <FormGroup>
            <Label>Peso (kg)</Label>
            <Input type="number" placeholder="Ex: 8.5" step="0.1" min="0" value={form.peso} onChange={field('peso')} />
          </FormGroup>
          <FormGroup span={2}>
            <Label required>Tutor</Label>
            <Select value={form.tutorId} onChange={field('tutorId')}>
              <option value="">Selecione o tutor...</option>
              {tutores.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>
            {tutores.length === 0 && (
              <FormHint>Nenhum tutor cadastrado. Cadastre um tutor primeiro na aba Tutores.</FormHint>
            )}
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
