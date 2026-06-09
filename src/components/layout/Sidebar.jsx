import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const NAV = [
  {
    label: 'Principal',
    items: [
      { to: '/', label: 'Dashboard', icon: <IconDashboard /> },
      { to: '/agendamentos', label: 'Agendamentos', icon: <IconCalendar /> },
    ],
  },
  {
    label: 'Cadastros',
    items: [
      { to: '/animais', label: 'Animais', icon: <IconPaw /> },
      { to: '/tutores', label: 'Tutores', icon: <IconUser /> },
      { to: '/veterinarios', label: 'Veterinários', icon: <IconActivity /> },
    ],
  },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`} onClick={onClose} />
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <PawSvg />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoName}>VetAgenda</span>
            <span className={styles.logoSub}>Sistema Veterinário</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV.map((section) => (
            <div key={section.label}>
              <span className={styles.sectionLabel}>{section.label}</span>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.active : ''}`
                  }
                  onClick={onClose}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className={styles.footer}>
          <div className={styles.apiBadge}>
            <div className={styles.apiDot} />
            <div className={styles.apiInfo}>
              <span className={styles.apiLabel}>API conectada</span>
              <span className={styles.apiUrl}>localhost:8080</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ── Inline SVG icons ── */
function IconDashboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IconPaw() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="8" r="2" /><circle cx="17" cy="8" r="2" />
      <circle cx="10" cy="5" r="1.5" /><circle cx="14" cy="5" r="1.5" />
      <path d="M12 11c-3.5 0-6 2.5-6 4.5C6 18 8.5 20 12 20s6-2 6-4.5C18 13.5 15.5 11 12 11z" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconActivity() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
function PawSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="white">
      <ellipse cx="5.5" cy="8.5" rx="2.5" ry="3" />
      <ellipse cx="18.5" cy="8.5" rx="2.5" ry="3" />
      <ellipse cx="9" cy="5" rx="2" ry="2.5" />
      <ellipse cx="15" cy="5" rx="2" ry="2.5" />
      <path d="M12 10c-4 0-7 3-7 5.5C5 18 8 20 12 20s7-2 7-4.5C19 13 16 10 12 10z" />
    </svg>
  );
}
