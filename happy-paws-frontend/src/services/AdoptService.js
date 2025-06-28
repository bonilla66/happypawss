import axios from "axios";

export const submitApplication = async (data, token) => {
  return await axios.post("https://happypaws-backend-latest.onrender.com/aplication/create", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const updateAplicationState = (id, newState) => {
  return api.put(`/aplication/${id}`, { aplicationStatus: newState });
};

export const deleteAplication = (id) => {
  return api.delete(`/aplication/${id}`);
};

export const applyToPet = async (petId) => {
  return await api.post(`/aplication/create?petId=${petId}`);
};

export const acceptSolicitud = async (solicitudId) => {
  return await api.post(`/aplication/accept?solicitudId=${solicitudId}`);
};

