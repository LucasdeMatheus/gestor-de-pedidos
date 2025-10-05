import { useEffect, useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import OrdersList from "../components/OrdersList";
import Footer from "../components/Footer";
import styles from "./Orders.module.css";

const supabase = createClient(
  "https://ywantzjpugtoahxkadii.supabase.co",
  "sb_publishable_TbkK8KOH2cLjx0Xsa3n7rA_RIHibGjg"
);

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    status: [],
    time: "hoje",
  });

  // Verificar usuário logado
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Buscar pedidos só se logado
  useEffect(() => {
    if (!user) return;

    fetchOrders();

    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar orders:", error);
    } else {
      const mapped = data.map((o) => ({
        ...o,
        mappedStatus: o.status === "finalizado" ? "fechado" : "aberto",
      }));
      setOrders(mapped);
    }
  }

  // Filtra pedidos com base em `filters` usando useMemo para performance
  const filteredOrders = useMemo(() => {
    const now = new Date();

    return orders.filter((order) => {
      // Filtra por status
      const statusMatch =
        filters.status.length === 0 || filters.status.includes(order.mappedStatus);

      // Filtra por período
      const updatedAt = new Date(order.updated_at);
      let timeMatch = true;

      if (filters.time === "hoje") {
        timeMatch = updatedAt.toDateString() === now.toDateString();
      } else if (filters.time === "semana") {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay()); // domingo
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // sábado
        timeMatch = updatedAt >= weekStart && updatedAt <= weekEnd;
      } else if (filters.time === "mes") {
        timeMatch =
          updatedAt.getMonth() === now.getMonth() &&
          updatedAt.getFullYear() === now.getFullYear();
      }

      return statusMatch && timeMatch;
    });
  }, [orders, filters]);

  if (!user) {
    return <p style={{ textAlign: "center" }}>Você precisa fazer login para acessar os pedidos.</p>;
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.body}>
        <Sidebar filters={filters} setFilters={setFilters} />
        <OrdersList orders={filteredOrders} />
      </div>
      <Footer />
    </div>
  );
}
