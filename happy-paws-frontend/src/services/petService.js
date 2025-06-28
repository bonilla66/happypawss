import api from "./api";

export const fetchAllPets = async (status = null) => {
  try {
    let url = "/pets";
    if (status) {
      url += `/status/${encodeURIComponent(status)}`; 
    } else {
      url += `/all`; 
    }

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    throw error;
  }
};

export const fetchPetById = async (id) => {
  try {
    const response = await api.get(`/pets/${id}`);
    if (response.status !== 200) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error al obtener la mascota:", error);
    throw error;
  }
};

export const createPet = async (petData) => {
  try {
    const response = await api.post("/pets", petData);
    return response.data;
  } catch (error) {
    console.error("Error al crear mascota:", error);
    throw error;
  }
};

export const updatePet = async (id, updatedData) => {
  try {
    const response = await api.patch(`/pets/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar mascota:", error);
    throw error;
  }
};

export const deletePet = async (id) => {
  try {
    const response = await api.delete(`/pets/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar mascota:", error);
    throw error;
  }
};

export const fetchVaccinatedPets = async () => {
  try {
    const response = await api.get("/pets/vaccinated");
    return response.data;
  } catch (error) {
    console.error("Error al obtener mascotas vacunadas:", error);
    throw error;
  }
};

export const fetchSterilizedPets = async () => {
  try {
    const response = await api.get("/pets/sterilized");
    return response.data;
  } catch (error) {
    console.error("Error al obtener mascotas esterilizadas:", error);
    throw error;
  }
};

export const fetchDewormedPets = async () => {
  try {
    const response = await api.get("/pets/dewormed");
    return response.data;
  } catch (error) {
    console.error("Error al obtener mascotas desparasitadas:", error);
    throw error;
  }
};

export const fetchPetsByUser = async (userId) => {
  try {
    const response = await api.get(`/pets/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener mascotas por usuario:", error);
    throw error;
  }
};
