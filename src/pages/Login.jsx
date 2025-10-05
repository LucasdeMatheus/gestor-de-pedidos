import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import styles from "./Login.module.css";

export default function Login({ setSession }) { // 👈 recebe a prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Salva a sessão no localStorage
        localStorage.setItem("supabaseSession", JSON.stringify(data.session));

        // Atualiza o estado global no App
        setSession(data.session);

        // Redireciona para /orders
        navigate("/orders");
      }
    } catch (err) {
      setError("Erro inesperado. Tente novamente.");
      console.error(err);
    }
  }

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
