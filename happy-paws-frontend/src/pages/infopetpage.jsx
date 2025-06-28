import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  PawPrint,
  Syringe,
  Bug,
  CheckCircle,
  Heart,
  Info,
  AlignLeft,
  BookText,
} from "lucide-react";
import { fetchPetById } from "../services/petService";
import { useAuth } from "../context/AuthContext";

export default function InfoPagePet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawPet = await fetchPetById(id);
        setPet(normalizePetData(rawPet));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  function normalizePetData(rawPet) {
    return {
      id: rawPet.id,
      name: rawPet.name || "Sin nombre",
      species: rawPet.species?.name || rawPet.species || "Desconocido",
      breed: rawPet.breed?.name || rawPet.breed || "Desconocido",
      gender:
        rawPet.gender === "HEMBRA"
          ? "Femenino"
          : rawPet.gender === "MACHO"
          ? "Masculino"
          : "Desconocido",
      size: rawPet.size?.name || rawPet.size || "Desconocido",
      age:
        typeof rawPet.ageValue === "number" && rawPet.ageUnit
          ? `${rawPet.ageValue} ${rawPet.ageUnit.toLowerCase()}`
          : "Edad no especificada",

      sterilized: rawPet.sterilized || false,
      vaccinated: rawPet.fullyVaccinated || false,
      dewormed: rawPet.parasiteFree || false,
      status: rawPet.status === "DISPONIBLE",
      photoUrl: rawPet.photoUrl || "/default-pet.jpg",
      description: rawPet.description || "Sin descripción disponible",
      history: rawPet.history || "Sin historia disponible",
      attributes: rawPet.attributes || [],
    };
  }

  const handleAdopt = () => {
    if (!user) {
      alert("Debes iniciar sesión para adoptar una mascota.");
      navigate("/login");
      return;
    }
    localStorage.setItem("selectedPetId", pet.id);
    navigate("/adoptform");
  };

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-amarillito text-negrito text-xl animate-pulse">
        Cargando mascota...
      </div>
    );
  if (error)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-amarillito text-red text-xl">
        {error}
      </div>
    );
  if (!pet)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-amarillito text-negrito text-xl">
        Mascota no encontrada
      </div>
    );

  return (
    <div className="bg-amarillito min-h-screen py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() =>
            window.history.length > 2 ? navigate(-1) : navigate("/mascotas")
          }
          className="flex items-center gap-2 text-negrito hover:text-azulito transition mb-4"
        >
          <ArrowLeft size={24} />
          Volver
        </button>

        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-azulito">{pet.name}</h1>
          <p className="text-lg text-azulito mt-1">({pet.species})</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="w-full md:w-64 aspect-square rounded-2xl overflow-hidden shadow-xl mx-auto md:mx-0">
            <img
              src={pet.photoUrl}
              alt={pet.name}
              onError={(e) => (e.target.src = "/default-pet.jpg")}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300">
            <h2 className="text-2xl font-semibold text-azulito mb-4 flex items-center gap-2">
              <Info size={22} /> Sobre mí…
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <InfoItem title="Tamaño" value={pet.size} />
              <InfoItem title="Género" value={pet.gender} />
              <InfoItem title="Raza" value={pet.breed} />
              <InfoItem title="Edad" value={pet.age} />
            </div>
            <div className="bg-rosadito p-4 rounded-xl">
              <h3 className="font-bold text-azulito text-lg mb-2 flex items-center gap-2">
                <AlignLeft size={18} /> Descripción
              </h3>
              <p className="text-negrito text-sm">{pet.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-anaranjadito p-4 rounded-2xl shadow-xl mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 justify-items-center">
            <MedicalItem
              icon={<PawPrint size={26} />}
              label="Esterilizad@"
              value={pet.sterilized}
            />
            <MedicalItem
              icon={<Syringe size={26} />}
              label="Vacunad@"
              value={pet.vaccinated}
            />
            <MedicalItem
              icon={<Bug size={26} />}
              label="Desparasitad@"
              value={pet.dewormed}
            />
            <MedicalItem
              icon={<CheckCircle size={26} />}
              label={pet.status ? "Disponible" : "No disponible"}
              value={pet.status}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-4">
            <h3 className="text-xl font-bold text-azulito mb-2 flex items-center gap-2">
              <BookText size={20} /> Historia
            </h3>
            <p className="text-negrito text-sm leading-relaxed">
              {pet.history}
            </p>
          </div>

          {pet.attributes.length > 0 && (
            <div className="w-full md:w-1/2 bg-azulito text-blanquito p-4 rounded-2xl shadow-xl">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Heart size={20} /> Atributos especiales
              </h2>
              <ul className="max-h-28 overflow-y-auto pr-2 space-y-2 text-sm scrollbar-thin scrollbar-thumb-white/30">
                {pet.attributes.map((attr) => (
                  <li
                    key={attr.id}
                    className="bg-white/10 px-3 py-1 rounded-md shadow-sm backdrop-blur-sm"
                  >
                    <p className="font-medium">{attr.attributeName}</p>
                    <p className="text-white/90 text-xs">
                      {attr.attributeValue}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="text-center mt-4 mb-2">
          <button
            onClick={handleAdopt}
            disabled={!pet.status}
            className={`px-6 py-2 text-sm rounded-full font-medium transition shadow-md ${
              pet.status
                ? "bg-moradito hover:bg-purple-300 text-negrito"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            {pet.status ? "Adóptame →" : "No disponible"}
          </button>
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ title, value }) => (
  <div>
    <h3 className="font-bold text-azulito text-md">{title}</h3>
    <p className="text-negrito text-sm">{value}</p>
  </div>
);

const MedicalItem = ({ icon, label, value }) => (
  <div className="flex flex-col items-center text-center">
    {icon}
    <span className="text-sm font-medium">{label}</span>
    <span className="text-xs">{value ? "Sí" : "No"}</span>
  </div>
);
