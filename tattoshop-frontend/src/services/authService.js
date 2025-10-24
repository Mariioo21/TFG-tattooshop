import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

// ✅ Registrar usuario
export const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// ✅ Iniciar sesión
export const login = (credentials) => {
  return axios.post(`${API_URL}/login`, credentials, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// ✅ Cerrar sesión
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ✅ Obtener token del localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// ✅ Decodificar usuario desde el token guardado (sin librerías externas)
export const getUserFromToken = () => {
  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch (e) {
    console.error("Error parseando usuario del token:", e);
    return null;
  }
};
