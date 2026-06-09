export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return (
    d.toLocaleDateString('pt-BR') +
    ' ' +
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );
}

export function formatCurrentDate() {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Converte "YYYY-MM-DD" (input[type=date]) → "DD/MM/YYYY" (backend Java)
 */
export function toBackendDate(raw) {
  if (!raw) return null;
  const [year, month, day] = raw.split('-');
  return `${day}/${month}/${year}`;
}

export function animalEmoji(especie) {
  const map = {
    Cachorro: '🐕',
    Gato: '🐈',
    Ave: '🦜',
    Coelho: '🐇',
    Hamster: '🐹',
    Réptil: '🦎',
  };
  return map[especie] || '🐾';
}

export const STATUS_LABELS = {
  AGENDADO: 'Agendado',
  CONFIRMADO: 'Confirmado',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
};

export const ESPECIALIDADE_LABELS = {
  CLINICO_GERAL: 'Clínico Geral',
  DERMATOLOGIA: 'Dermatologia',
  ORTOPEDIA: 'Ortopedia',
  CARDIOLOGIA: 'Cardiologia',
  OFTAMOLOGIA: 'Oftalmologia',
};

export function getInitials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
