import api from "./api";

const IMAGE_URL = "/image";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post(`${IMAGE_URL}/upload`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    //temporally log the response to see the structure
    console.log("Imagen subida correctamente", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al subir la imagen", error);
    throw error;
  }
};
