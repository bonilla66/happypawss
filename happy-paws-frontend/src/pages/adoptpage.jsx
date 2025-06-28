import React, { useState, useEffect } from "react";
import { UseForm } from "../hooks/form";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PopUpForm from "../components/popupform.jsx";
import { fetchPetById } from "../services/petService";
import api from "../services/api";

export default function AdoptionFormPage() {
  const navigate = useNavigate();
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [pet, setPet] = useState(null);
  const [petError, setPetError] = useState(null);

  useEffect(() => {
    const loadPet = async () => {
      const petId = localStorage.getItem("selectedPetId");
      if (!petId) {
        setPetError("No se seleccionó ninguna mascota para adoptar.");
        return;
      }

      try {
        const petData = await fetchPetById(petId);
        setPet(petData);
      } catch (err) {
        setPetError("Error al cargar la información de la mascota.");
        console.log(err);
      }
    };

    loadPet();
  }, []);

  const initialValues = {
    hasOtherPets: "",
    location: "",
    reasons: "",
    hasSpace: "",
    hasTime: "",
  };

  const validate = (vals) =>
    !vals.hasOtherPets ||
    !vals.location ||
    !vals.reasons ||
    !vals.hasSpace ||
    !vals.hasTime
      ? "Por favor completa todos los campos"
      : null;

  const onSubmit = async () => {
    const petId = localStorage.getItem("selectedPetId");
    try {
      await api.post("/aplication/create", {
        petId,
        other_Pets: values.hasOtherPets === "sí",
        locationDescription: values.location,
        reason_adoption: values.reasons,
        enough_space: values.hasSpace === "sí",
        enough_time: values.hasTime === "sí",
      });

      localStorage.removeItem("selectedPetId");

      setPopup({
        show: true,
        message: "¡Solicitud enviada con éxito!",
        type: "success",
      });
    } catch (error) {
      setPopup({
        show: true,
        message: "Error al enviar la solicitud, ya existe una solicitud para esa mascota.",
        type: "error",
      });
      console.log(error);
    }
  };

  const handleClose = () => {
    setPopup({ ...popup, show: false });
    if (popup.type === "success") {
      navigate("/mascotas");
    }
  };

  const { values, handleChange, handleSubmit } = UseForm(
    initialValues,
    (vals) => {
      const error = validate(vals);
      if (error) {
        setPopup({ show: true, message: error, type: "error" });
      }
      return error;
    }
  );

  return (
    <div className="min-h-screen bg-amarillito p-6 flex flex-col items-center">
      {popup.show && (
        <PopUpForm
          message={popup.message}
          type={popup.type}
          onClose={handleClose}
        />
      )}

      <button
        onClick={() => navigate(-1)}
        className="self-start mb-4 text-negrito cursor-pointer"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="w-full max-w-4xl bg-blanquito rounded-2xl shadow-2xl p-12 space-y-8">
        <h2 className="text-2xl font-bold text-azulito text-center">
          ¡Solicita la adopción de un peludito!
        </h2>

        {pet && (
          <div className="bg-white shadow rounded-xl p-6 mb-6 w-full">
            <h3 className="text-xl font-semibold text-azulito mb-4">
              Estás solicitando adoptar a:
            </h3>
            <div className="flex items-center space-x-4">
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="w-20 h-20 rounded-full object-cover border border-gray-300"
              />
              <div>
                <p className="text-lg font-bold text-negrito">{pet.name}</p>
                <p className="text-sm text-gray-600">
                  {pet.breed || "Raza desconocida"}
                </p>
              </div>
            </div>
          </div>
        )}
        {petError && (
          <div className="text-red-600 bg-red-100 p-4 rounded mb-4 text-center">
            {petError}
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-negrito">
              ¿Tiene otras mascotas en la actualidad?
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex items-center space-x-6">
              {["sí", "no"].map((opt) => (
                <label key={opt} className="inline-flex items-center space-x-2">
                  <input
                    type="radio"
                    name="hasOtherPets"
                    value={opt}
                    checked={values.hasOtherPets === opt}
                    onChange={handleChange}
                    className="h-4 w-4 accent-black cursor-pointer"
                  />
                  <span className="text-grisito capitalize">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-negrito">
              Ubicación<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              name="location"
              value={values.location}
              onChange={handleChange}
              className="w-full h-8 px-4 border border-grisito rounded-full focus:outline-none focus:ring-1 focus:ring-purple-300"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-negrito">
              Motivos para adoptarlo<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              name="reasons"
              value={values.reasons}
              onChange={handleChange}
              className="w-full h-8 px-4 border border-grisito rounded-full focus:outline-none focus:ring-1 focus:ring-purple-300"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-negrito">
              ¿Tiene espacio adecuado para la mascota?
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex items-center space-x-6">
              {["sí", "no"].map((opt) => (
                <label key={opt} className="inline-flex items-center space-x-2">
                  <input
                    type="radio"
                    name="hasSpace"
                    value={opt}
                    checked={values.hasSpace === opt}
                    onChange={handleChange}
                    className="h-4 w-4 accent-black cursor-pointer"
                  />
                  <span className="text-grisito capitalize">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-negrito">
              ¿Tiene tiempo suficiente para la mascota?
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex items-center space-x-6">
              {["sí", "no"].map((opt) => (
                <label key={opt} className="inline-flex items-center space-x-2">
                  <input
                    type="radio"
                    name="hasTime"
                    value={opt}
                    checked={values.hasTime === opt}
                    onChange={handleChange}
                    className="h-4 w-4 accent-black cursor-pointer"
                  />
                  <span className="text-grisito capitalize">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-moradito text-negrito rounded-full font-medium hover:bg-purple-300 transition"
          >
            Enviar Solicitud
          </button>
        </form>
      </div>
    </div>
  );
}
