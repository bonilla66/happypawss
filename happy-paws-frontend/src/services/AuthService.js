import api from "./api";

const AUTH_URL = "/auth";

export const login = async (credentials) => {
   await api.post(`${AUTH_URL}/login`, credentials);
   const response = await api.get(`${AUTH_URL}/me`);
  return response.data;
};

export const register = async (userData) => {
  try {
    const response = await api.post(`${AUTH_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error; 
  }
};

export const logout = async () => {
  return await api.post(`${AUTH_URL}/logout`);
};

