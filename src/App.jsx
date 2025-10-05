import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Orders from "./pages/Orders";

export default function App() {
  const [session, setSession] = useState(() => {
    const s = localStorage.getItem("supabaseSession");
    return s ? JSON.parse(s) : null;
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login setSession={setSession} />}
        />
        <Route
          path="/orders"
          element={session ? <Orders /> : <Navigate to="/login" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={session ? "/orders" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
