import styles from './Badge.module.css';
import { STATUS_LABELS, ESPECIALIDADE_LABELS } from '../../utils/helpers';

export function StatusBadge({ status }) {
  if (!status) return <span>—</span>;
  return (
    <span className={`${styles.badge} ${styles[status.toLowerCase()]}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function EspBadge({ especialidade }) {
  if (!especialidade) return <span>—</span>;
  return (
    <span className={styles.espBadge}>
      {ESPECIALIDADE_LABELS[especialidade] || especialidade}
    </span>
  );
}
