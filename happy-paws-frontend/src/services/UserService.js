import api from "./api"; 

export const updateUserProfile = async (id, data) => {
  try {
    const response = await api.patch(`/user/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error en UserService:", error.response?.data || error.message);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error("Error al actualizar el perfil");
  }
};

export const getUserApplications = async () => {
  const res = await api.get("/aplication/by-user"); 
  return res.data;
};

export const getAcceptedApplications = async () => {
  const response = await api.get(`/aplication/accepted`);
  return response.data;
};

export const deleteUserById = async (id) => {
  try {
    await api.delete(`/user/${id}`);
  } catch (error) {
    const status = error.response?.status;
    const backendError = error.response?.data?.error;

    if (status === 404) {
      throw new Error("El usuario no fue encontrado");
    }

    if (backendError) {
      throw new Error(backendError); 
    }

    throw new Error("No se pudo eliminar el usuario");
  }
};


