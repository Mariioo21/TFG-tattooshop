import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { login } from "../services/authService";
import "../styles/Auth.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

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

      navigate("/catalog");
    } catch (error) {
      console.error("Error en login:", error);
      setErrorMessage("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="auth-shell auth-shell-login">
      <div className="auth-slider auth-mode-login">
        <section className="auth-stage">
          <div className="auth-form-panel auth-panel-login">
            <div className="auth-form-wrap">
              <p className="auth-tag">TattooShop</p>
              <h1>Iniciar sesión</h1>
              <p className="auth-lead">
                Accede a tu cuenta para explorar el catálogo y gestionar tus
                pedidos.
              </p>

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="auth-field">
                  <label htmlFor="login-username">Usuario</label>
                  <input
                    id="login-username"
                    type="text"
                    placeholder="Introduce tu usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="login-password">Contraseña</label>
                  <div className="auth-password-wrap">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Introduce tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={
                        showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {errorMessage && <p className="auth-message">{errorMessage}</p>}

                <button type="submit" className="auth-submit">
                  Entrar
                </button>
              </form>
            </div>
          </div>

          <div className="auth-form-panel auth-panel-register-preview">
            <div className="auth-form-wrap auth-form-wrap-preview">
              <p className="auth-tag">TattooShop</p>
              <h1>Crear cuenta</h1>
              <p className="auth-lead">
                Registra tu perfil para comprar o empezar a vender en la tienda.
              </p>

              <div className="auth-form auth-form-preview" aria-hidden="true">
                <div className="auth-field">
                  <label>Usuario</label>
                  <input type="text" placeholder="Tu usuario" disabled />
                </div>
                <div className="auth-field">
                  <label>Correo electrónico</label>
                  <input type="email" placeholder="Tu correo" disabled />
                </div>
                <div className="auth-field">
                  <label>Contraseña</label>
                  <input type="password" placeholder="Tu contraseña" disabled />
                </div>
                <button
                  type="button"
                  className="auth-submit auth-submit-muted"
                  onClick={() => navigate("/register")}
                >
                  Ir al registro
                </button>
              </div>
            </div>
          </div>

          <aside className="auth-overlay">
            <div className="auth-overlay-face auth-overlay-login">
              <img
                src="/logo.png"
                alt="TattooShop"
                className="auth-overlay-logo auth-overlay-logo-right"
              />
              <p className="auth-overlay-kicker">Material profesional</p>
              <h2>Todo lo que necesitas para tu estudio en un solo lugar</h2>
              <div className="auth-overlay-pills">
                <span>Cartuchos</span>
                <span>Tintas</span>
                <span>Accesorios</span>
              </div>
              <button
                type="button"
                className="auth-ghost"
                onClick={() => navigate("/register")}
              >
                Regístrate
              </button>
            </div>

            <div className="auth-overlay-face auth-overlay-register">
              <img
                src="/logo.png"
                alt="TattooShop"
                className="auth-overlay-logo auth-overlay-logo-left"
              />
              <p className="auth-overlay-kicker">Cuenta nueva</p>
              <h2>Abre tu perfil y entra en la tienda con otro ritmo visual</h2>
              <p className="auth-overlay-text">
                Crea tu cuenta para comprar, vender y moverte por la plataforma
                con una experiencia más clara.
              </p>
              <button
                type="button"
                className="auth-ghost"
                onClick={() => navigate("/register")}
              >
                Regístrate
              </button>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

export default Login;
