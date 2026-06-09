import styles from './Form.module.css';

export function FormGrid({ children, cols = 2 }) {
  return (
    <div className={`${styles.grid} ${styles[`cols${cols}`]}`}>
      {children}
    </div>
  );
}

export function FormGroup({ children, span = 1 }) {
  return (
    <div className={`${styles.group} ${span === 2 ? styles.span2 : ''}`}>
      {children}
    </div>
  );
}

export function Label({ children, required }) {
  return (
    <label className={styles.label}>
      {children}
      {required && <span className={styles.required}> *</span>}
    </label>
  );
}

export function Input({ ...props }) {
  return <input className={styles.input} {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <select className={styles.select} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ ...props }) {
  return <textarea className={styles.textarea} {...props} />;
}

export function FormHint({ children }) {
  return <span className={styles.hint}>{children}</span>;
}
