import React, { useState } from "react";
import { register, login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
      role: role,
    };

    try {
      // Registrar usuario
      await register(userData);

      // Login automático
      const loginResponse = await login({
        username: username.trim(),
        password: password.trim(),
      });

      // ✅ Guardar token
      localStorage.setItem("token", loginResponse.data.token);

      // ✅ Guardar usuario completo incluyendo email
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: loginResponse.data.username,
          email: loginResponse.data.email,
          role: loginResponse.data.role,
        })
      );

      setMessage("✅ Usuario registrado correctamente. Redirigiendo...");
      setTimeout(() => navigate("/catalog"), 1500);
    } catch (error) {
      console.error("❌ Error en registro:", error);
      setMessage("❌ No se pudo registrar el usuario. Verifica los datos o si ya existe.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Crear cuenta</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="USER">Usuario</option>
            <option value="SELLER">Vendedor</option>
          </select>

          <button type="submit">Registrarse</button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-switch">
          ¿Ya tienes cuenta?{" "}
          <span onClick={() => navigate("/login")}>Inicia sesión</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
