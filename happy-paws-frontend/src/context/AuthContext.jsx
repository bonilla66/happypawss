import React, { createContext, useContext, useState, useEffect } from "react";
import { login as loginService, logout as logoutService } from "../services/AuthService";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [isAuthenticated,setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login =  async (credentials) => {
  await loginService(credentials);
  const res = await api.get("/auth/me");
  setUser(res.data); 
  setIsAuthenticated(true);
  return res.data;
  }; 

  const logout = async() => {
    await logoutService();
    setUser(null);
    setIsAuthenticated(false);
    
  }

  const checkSession = async () => {
  try {
    await api.get("/auth/refresh");
    const res = await api.get("/auth/me");
    setUser(res.data);
    setIsAuthenticated(true);
    console.log(user);
  } catch (err) {
    console.error("Error al verificar sesión:", err);
    setIsAuthenticated(false);
    setUser(null);
  } finally {
    setLoading(false);
  }
};

   useEffect(() => {
  const cookies = document.cookie;
  if (cookies.includes("refresh_token")) {
    checkSession();
  } else {
    console.log("No hay refresh_token → Usuario visitante.");
    setLoading(false);
  }
}, []);


  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
