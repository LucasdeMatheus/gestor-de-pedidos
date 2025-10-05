import styles from "./OrdersList.module.css";
import OrderCard from "./OrderCard";

export default function OrdersList({ orders }) {
  return (
    <div className={styles.list}>
      {orders.map((o) => (
        <OrderCard key={o.id} order={o} />
      ))}
    </div>
  );
}
