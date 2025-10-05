import styles from "./Sidebar.module.css";

export default function Sidebar({ filters, setFilters }) {
  // filters = { status: [], time: 'hoje' }

  const handleStatusChange = (e) => {
    const { value, checked } = e.target;
    let newStatus = [...filters.status];
    if (checked) {
      newStatus.push(value);
    } else {
      newStatus = newStatus.filter((s) => s !== value);
    }
    setFilters({ ...filters, status: newStatus });
  };

  const handleTimeChange = (e) => {
    setFilters({ ...filters, time: e.target.value });
  };

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Filtros</h2>

      {/* Status */}
      <div className={styles.section}>
        <h3 className={styles.subtitle}>Status</h3>
        <label className={styles.label}>
          <input
            type="checkbox"
            value="aberto"
            checked={filters.status.includes("aberto")}
            onChange={handleStatusChange}
          />
          <span className={styles.customCheckbox}></span>
          Aberto
        </label>
        <label className={styles.label}>
          <input
            type="checkbox"
            value="fechado"
            checked={filters.status.includes("fechado")}
            onChange={handleStatusChange}
          />
          <span className={styles.customCheckbox}></span>
          Fechado
        </label>
      </div>

      {/* Time */}
      <div className={styles.section}>
        <h3 className={styles.subtitle}>Período</h3>
        <label className={styles.label}>
          <input
            type="radio"
            name="time"
            value="hoje"
            checked={filters.time === "hoje"}
            onChange={handleTimeChange}
          />
          <span className={styles.customRadio}></span>
          Hoje
        </label>
        <label className={styles.label}>
          <input
            type="radio"
            name="time"
            value="semana"
            checked={filters.time === "semana"}
            onChange={handleTimeChange}
          />
          <span className={styles.customRadio}></span>
          Semana
        </label>
        <label className={styles.label}>
          <input
            type="radio"
            name="time"
            value="mes"
            checked={filters.time === "mes"}
            onChange={handleTimeChange}
          />
          <span className={styles.customRadio}></span>
          Mês
        </label>
      </div>
    </aside>
  );
}
