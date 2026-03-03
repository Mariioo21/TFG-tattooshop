import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { register, login } from "../services/authService";
import "../styles/Auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const userData = {
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
      role,
    };

    try {
      await register(userData);

      const loginResponse = await login({
        username: username.trim(),
        password: password.trim(),
      });

      localStorage.setItem("token", loginResponse.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: loginResponse.data.username,
          email: loginResponse.data.email,
          role: loginResponse.data.role,
        })
      );

      setMessage("Usuario registrado correctamente. Redirigiendo...");
      setTimeout(() => navigate("/catalog"), 1500);
    } catch (error) {
      console.error("Error en registro:", error);
      setMessage("No se pudo registrar el usuario. Verifica los datos o si ya existe.");
    }
  };

  return (
    <div className="auth-shell auth-shell-register">
      <div className="auth-slider auth-mode-register">
        <section className="auth-stage">
          <div className="auth-form-panel auth-panel-register">
            <div className="auth-form-wrap">
              <p className="auth-tag">TattooShop</p>
              <h1>Crear cuenta</h1>
              <p className="auth-lead">
                Registrate para comprar o vender dentro de la tienda.
              </p>

              <form onSubmit={handleSubmit} className="auth-form auth-form-register">
                <div className="auth-field">
                  <label htmlFor="register-username">Usuario</label>
                  <input
                    id="register-username"
                    type="text"
                    placeholder="Elige tu usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="register-email">Correo electronico</label>
                  <input
                    id="register-email"
                    type="email"
                    placeholder="Introduce tu correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="register-password">Contrasena</label>
                  <div className="auth-password-wrap">
                    <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Crea una contrasena"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="auth-field">
                  <label htmlFor="register-role">Tipo de cuenta</label>
                  <select
                    id="register-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="USER">Usuario</option>
                    <option value="SELLER">Vendedor</option>
                  </select>
                </div>

                {message && <p className="auth-message">{message}</p>}

                <button type="submit" className="auth-submit auth-submit-register">
                  Registrarse
                </button>
              </form>
            </div>
          </div>

          <div className="auth-form-panel auth-panel-login-preview">
            <div className="auth-form-wrap auth-form-wrap-preview">
              <p className="auth-tag">TattooShop</p>
              <h1>Iniciar sesion</h1>
              <p className="auth-lead">
                Si ya tienes cuenta, vuelve a entrar para seguir comprando.
              </p>

              <div className="auth-form auth-form-preview" aria-hidden="true">
                <div className="auth-field">
                  <label>Usuario</label>
                  <input type="text" placeholder="Tu usuario" disabled />
                </div>
                <div className="auth-field">
                  <label>Contrasena</label>
                  <input type="password" placeholder="Tu contrasena" disabled />
                </div>
                <button
                  type="button"
                  className="auth-submit auth-submit-muted"
                  onClick={() => navigate("/login")}
                >
                  Ir al login
                </button>
              </div>
            </div>
          </div>

          <aside className="auth-overlay">
            <div className="auth-overlay-face auth-overlay-register">
              <p className="auth-overlay-kicker">Cuenta nueva</p>
              <h2>Empieza tu recorrido en la tienda</h2>
              <p className="auth-overlay-text">
                Crea tu acceso y entra a una experiencia mas cuidada para
                clientes y vendedores.
              </p>
              <button
                type="button"
                className="auth-ghost"
                onClick={() => navigate("/login")}
              >
                Iniciar sesion
              </button>
            </div>

            <div className="auth-overlay-face auth-overlay-login">
              <p className="auth-overlay-kicker">Ya tienes cuenta</p>
              <h2>Vuelve a entrar y sigue con tus pedidos</h2>
              <p className="auth-overlay-text">
                Accede rapidamente a tu perfil, tu carrito y la gestion de tu
                tienda.
              </p>
              <button
                type="button"
                className="auth-ghost"
                onClick={() => navigate("/login")}
              >
                Iniciar sesion
              </button>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

export default Register;
