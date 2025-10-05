import { useState } from "react";
import styles from "./OrderCard.module.css";

export default function OrderCard({ order }) {
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(order.status);

  // Parse da forma de pagamento se existir
  let pagamento = null;
  try {
    pagamento = order.forma_de_pagamento ? JSON.parse(order.forma_de_pagamento) : null;
  } catch (err) {
    pagamento = null;
  }

  const fecharPedido = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/fechar-pedido", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, wa_id: order.wa_id }),
      });

      if (!response.ok) throw new Error("Erro ao fechar pedido");

      setStatus("finalizado");
      alert("Pedido fechado com sucesso!");
      setShowDetails(false);
    } catch (err) {
      console.error(err);
      alert("Não foi possível fechar o pedido.");
    } finally {
      setLoading(false);
    }
  };

  const visualizarPedido = () => {
    // Monta o HTML do pedido apenas com as informações essenciais
    const itensHTML = (order.pedido?.itens ?? [])
      .map(
        (item) =>
          `<div class="item">${item.quantidade}x ${item.produto} - R$${item.valor_unitario.toFixed(
            2
          )}</div>`
      )
      .join("");

    const endereco = order.endereco ?? "Localização não informada";
    const metodoPagamento = pagamento?.metodo ?? "—";
    const troco =
      pagamento?.metodo === "dinheiro" && pagamento?.troco
        ? ` (Troco: R$${pagamento.troco.toFixed(2)})`
        : "";

    const html = `
      <html>
        <head>
          <title>Pedido #${order.id}</title>
          <style>
            body { font-family: monospace; font-size: 12px; margin: 0; padding: 5px; width: 80mm; }
            h2, h3 { text-align: center; margin: 5px 0; }
            hr { border: 1px dashed #000; margin: 5px 0; }
            .item { display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <h2>Pedido #${order.id}</h2>
          <p><b>Cliente:</b> ${order.nome}</p>
          <p><b>Status:</b> ${status}</p>
          <p><b>Pagamento:</b> ${metodoPagamento}${troco}</p>
          <h3>Itens:</h3>
          ${itensHTML}
          <hr>
          <h3>Endereço:</h3>
          <p>${endereco}</p>
          <hr>
          <p><b>Valor Total:</b> R$${order.valor_pedido?.toFixed(2) ?? "—"}</p>
        </body>
      </html>
    `;

    const printWindow = window.open("", "", "width=300,height=600");
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
  };

  return (
    <>
      <div className={styles.card}>
        <h2 className={styles.title}>Pedido #{order.id}</h2>
        <p><b>Cliente:</b> {order.nome}</p>
        <p><b>Valor:</b> R${order.valor_pedido?.toFixed(2) ?? "—"}</p>
        <p className={styles.updated}>
          Atualizado: {new Date(order.updated_at).toLocaleString()}
        </p>
        <button className={styles.toggleButton} onClick={() => setShowDetails(true)}>
          Mostrar detalhes
        </button>
      </div>

      {showDetails && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Detalhes do Pedido #{order.id}</h2>
            <p><b>Cliente:</b> {order.nome}</p>
            <p><b>Status:</b> {status}</p>

            <p><b>Pagamento:</b> {pagamento?.metodo ?? "—"}</p>
            {pagamento?.metodo === "dinheiro" && pagamento?.troco && (
              <p><b>Troco:</b> R${pagamento.troco.toFixed(2)}</p>
            )}

            <h3>Itens:</h3>
            <ul>
              {(order.pedido?.itens ?? []).length > 0 ? (
                order.pedido.itens.map((item, index) => (
                  <li key={index}>
                    {item.quantidade}x {item.produto} - R${item.valor_unitario.toFixed(2)}
                  </li>
                ))
              ) : (
                <li>Nenhum item no pedido</li>
              )}
            </ul>

            <h3>Endereço:</h3>
            <p>{order.endereco ?? "Localização não informada"}</p>

            <p><b>Valor Total:</b> R${order.valor_pedido?.toFixed(2) ?? "—"}</p>

            <div className={styles.button}>
              <button className={styles.closeButton} onClick={() => setShowDetails(false)}>
                Fechar
              </button>

              <button
                className={styles.closeButton}
                onClick={fecharPedido}
                disabled={loading}
                style={{ backgroundColor: "#28a745", color: "#fff" }}
              >
                {loading ? "Fechando..." : "Fechar Pedido"}
              </button>

              <button
                className={styles.closeButton}
                onClick={visualizarPedido}
                style={{ backgroundColor: "#007bff", color: "#fff" }}
              >
                Visualizar/Imprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
