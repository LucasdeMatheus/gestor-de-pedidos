import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <img src="pedido.png" alt="pedido.png" className={styles.icon}/>
      <h1 className={styles.title}> Painel de Pedidos</h1>
    </header>
  );
}
