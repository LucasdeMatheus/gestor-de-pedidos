import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p className={styles.copy}>© 2025 Painel de Pedidos. Todos os direitos reservados.</p>
        
      </div>
    </footer>
  );
}
