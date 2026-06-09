import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { agendamentosApi, animaisApi, tutoresApi, veterinariosApi } from '../../api/client';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useToastContext } from '../../hooks/ToastContext';
import { animalEmoji } from '../../utils/helpers';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const toast = useToastContext();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('vetagenda_role');
  const normalizedRole = userRole ? userRole.toUpperCase() : '';

  const [stats, setStats] = useState({
    total: '—', agendados: '—', confirmados: '—', concluidos: '—', cancelados: '—',
    animais: '—', tutores: '—', vets: '—',
  });
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ags, animais, tutores, vets] = await Promise.all([
          agendamentosApi.listar().catch(() => []),
          animaisApi.listar().catch(() => []),
          tutoresApi.listar().catch(() => []),
          veterinariosApi.listar().catch(() => []),
        ]);

        setStats({
          total: ags.length,
          agendados: ags.filter((a) => a.status === 'AGENDADO').length,
          confirmados: ags.filter((a) => a.status === 'CONFIRMADO').length,
          concluidos: ags.filter((a) => a.status === 'CONCLUIDO').length,
          cancelados: ags.filter((a) => a.status === 'CANCELADO').length,
          animais: animais.length,
          tutores: tutores.length,
          vets: vets.length,
        });

        const next = ags
          .filter((a) => a.status !== 'CANCELADO' && a.status !== 'CONCLUIDO')
          .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
          .slice(0, 6);

        setUpcoming(next);
      } catch {
        toast('Erro ao carregar dados. Verifique se a API está rodando.', 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      {/* Banner */}
      <div className={styles.banner}>
        <div className={styles.bannerText}>
          <h2>Bem-vindo ao VetAgenda</h2>
          <p>Gerencie consultas, pacientes e veterinários em um só lugar.</p>
        </div>
        <div className={styles.bannerPaw}>🐾</div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard color="green" value={stats.total} label="Total de agendamentos" icon={<IconCalendar />} />
        <StatCard color="blue"  value={stats.agendados} label="Agendados" icon={<IconClock />} />
        <StatCard color="amber" value={stats.confirmados} label="Confirmados" icon={<IconCheck />} />
        <StatCard color="teal"  value={stats.concluidos} label="Concluídos" icon={<IconCheckDouble />} />
        <StatCard color="red"   value={stats.cancelados} label="Cancelados" icon={<IconX />} />
      </div>

      {/* Grid */}
      <div className={styles.dashGrid}>
        {/* Timeline */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitle}>Próximos Agendamentos</div>
              <div className={styles.cardSub}>Consultas ativas ordenadas por data</div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate('/agendamentos')}>
              Ver todos
            </Button>
          </div>

          {loading ? (
            <div className={styles.timelineEmpty}>Carregando...</div>
          ) : upcoming.length === 0 ? (
            <div className={styles.timelineEmpty}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <p>Sem agendamentos próximos. Crie um para começar!</p>
            </div>
          ) : (
            <div className={styles.timeline}>
              {upcoming.map((a) => {
                const d = new Date(a.dataHora);
                const timeStr = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                return (
                  <div key={a.id} className={styles.timelineItem}>
                    <div className={`${styles.dot} ${styles[a.status?.toLowerCase()]}`} />
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineTitle}>
                        {animalEmoji(a.animalEspecie)} {a.nomeAnimal || '—'} — {a.nomeVeterinario || '—'}
                      </div>
                      <div className={styles.timelineMeta}>{dateStr} às {timeStr}</div>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className={styles.sidePanel}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Resumo rápido</div>
            </div>
            <div className={styles.resumo}>
              <div className={styles.resumoRow}>
                <span>🐕 Animais cadastrados</span>
                <strong>{stats.animais}</strong>
              </div>
              <div className={styles.resumoRow}>
                <span>👤 Tutores</span>
                <strong>{stats.tutores}</strong>
              </div>
              <div className={styles.resumoRow}>
                <span>👨‍⚕️ Veterinários</span>
                <strong>{stats.vets}</strong>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Ações rápidas</div>
            </div>
            <div className={styles.actions}>
              <Button variant="primary" fullWidth onClick={() => navigate('/agendamentos')}>
                <IconPlus /> Novo Agendamento
              </Button>
              <Button variant="secondary" fullWidth onClick={() => navigate('/animais')}>
                <IconPlus /> Cadastrar Animal
              </Button>
              
              {normalizedRole === 'ADMIN' && (
                <Button variant="secondary" fullWidth onClick={() => navigate('/veterinarios')}>
                  <IconPlus /> Cadastrar Veterinário
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ color, value, label, icon }) {
  return (
    <div className={`${styles.statCard} ${styles[`stat_${color}`]}`}>
      <div className={`${styles.statIcon} ${styles[`icon_${color}`]}`}>{icon}</div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function IconCalendar() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function IconClock() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function IconCheck() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>; }
function IconCheckDouble() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>; }
function IconX() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>; }
function IconPlus() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>; }
