import React, { useState } from "react";
import { login } from "./services/authService";
import { useNavigate } from "react-router-dom";
import "./styles/Auth.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = {
      username: username.trim(),
      password: password.trim(),
    };

    try {
      const response = await login(credentials);

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
        })
      );

      console.log("✅ Login correcto:", response.data);
      navigate("/catalog");
    } catch (error) {
      console.error("❌ Error en login:", error);
      setErrorMessage("❌ Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Iniciar sesión</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Entrar</button>
        </form>

        {errorMessage && <p className="auth-message">{errorMessage}</p>}

        {/* SOLO alineado al centro, sin romper nada */}
        <p className="auth-switch center-text">
          ¿No tienes cuenta?{" "}
          <span onClick={() => navigate("/register")}>Regístrate</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
