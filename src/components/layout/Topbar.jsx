import { useLocation } from 'react-router-dom';
import { formatCurrentDate } from '../../utils/helpers';
import styles from './Topbar.module.css';

const TITLES = {
  '/': 'Dashboard',
  '/agendamentos': 'Agendamentos',
  '/animais': 'Animais',
  '/tutores': 'Tutores',
  '/veterinarios': 'Veterinários',
};

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const title = TITLES[pathname] || 'VetAgenda';

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button className={styles.hamburger} onClick={onMenuClick} aria-label="Abrir menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.right}>
        <span className={styles.date}>{formatCurrentDate()}</span>
      </div>
    </header>
  );
}
