import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Plus, ListFilter } from "lucide-react";
import PetCard from "../components/petcard.jsx";
import api from "../services/api";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import fondito from "../assets/bannerHoriz.jpg";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full bg-amarillito">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-moradito"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded text-center">
    {message}
  </div>
);

const usePagination = (items = [], itemsPerPage = 6) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    currentPage,
    totalPages,
    currentItems,
    nextPage: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
    prevPage: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
    goToPage: (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages))),
  };
};

export default function PetsPage() {
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("DISPONIBLE");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const canAddPet = user?.rol === "ADMIN" || user?.rol === "COLABORADOR";

  const statusOptions = [
    { value: "", label: "Todos" },
    { value: "DISPONIBLE", label: "Disponibles" },
    { value: "ADOPTADO", label: "Adoptados" },
    { value: "VACCINATED", label: "Vacunados" },
    { value: "STERILIZED", label: "Esterilizados" },
    { value: "DEWORMED", label: "Desparasitados" },
  ];

  const [species, setSpecies] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [shelters, setShelters] = useState([]);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    if (allPets.length) {
      console.log("Ejemplo pet 🐾:", allPets[0]);
      console.log("Tipos => speciesId:", typeof allPets[0].speciesId);
    }
  }, [allPets]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [speciesRes, breedsRes, sheltersRes] = await Promise.all([
          api.get("/species/all"),
          api.get("/breeds/all"),
          api.get("/shelters/all"),
        ]);

        const mappedSpecies = speciesRes.data.map((s) => ({
          id: s.id_species,
          name: s.name,
        }));
        console.log("🎯 mappedSpecies:", mappedSpecies);
        setSpecies(mappedSpecies);

        const mappedBreeds = breedsRes.data.map((b) => ({
          id: b.id_breed,
          name: b.name,
          speciesId: b.speciesId,
        }));
        console.log("🎯 mappedBreeds:", mappedBreeds);
        setBreeds(mappedBreeds);

        console.log("🎯 sheltersData:", sheltersRes.data);
        setShelters(sheltersRes.data);
      } catch (error) {
        console.error(
          "Error al cargar filtros:",
          error.response?.data || error.message
        );
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFiltersOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadPets = async () => {
      try {
        setLoading(true);
        const petsData = await api.get("/pets/all");

        console.log("🐾 Todas las mascotas:", petsData.data);
        setAllPets(
          petsData.data.map((p) => ({
            ...p,
            speciesId: String(p.speciesId),
            breedId: p.breedId !== null ? String(p.breedId) : "",
            shelterId: p.shelterId !== null ? String(p.shelterId) : "",
          }))
        );
      } catch (err) {
        console.error("Error loading pets:", err);
        setError(err.message || "Error al cargar las mascotas");
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  const [selectedSpecie, setSelectedSpecie] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");
  const [selectedShelter, setSelectedShelter] = useState("");

  console.log("🎯 selectedSpecie:", selectedSpecie, typeof selectedSpecie);
  console.log("🎯 selectedBreed:", selectedBreed, typeof selectedBreed);
  console.log("🎯 selectedShelter:", selectedShelter, typeof selectedShelter);

  const filteredPets = allPets.filter((pet) => {
    const matchesName = pet.name
      ? pet.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesSpecie =
      selectedSpecie === "" || String(pet.speciesId) === selectedSpecie;

    const matchesBreed =
      selectedBreed === "" ||
      (pet.breedId !== null && String(pet.breedId) === selectedBreed);

    const matchesShelter =
      selectedShelter === "" ||
      (pet.shelterId !== null && String(pet.shelterId) === selectedShelter);

    const matchesStatus =
      statusFilter === "" ||
      pet.status === statusFilter ||
      (statusFilter === "VACCINATED" && pet.fullyVaccinated) ||
      (statusFilter === "STERILIZED" && pet.sterilized) ||
      (statusFilter === "DEWORMED" && pet.parasiteFree);

    return (
      matchesName &&
      matchesSpecie &&
      matchesBreed &&
      matchesShelter &&
      matchesStatus
    );
  });

  console.log("Filtrados:", filteredPets);
  console.log(
    "selectedSpecie",
    selectedSpecie,
    "selectedBreed",
    selectedBreed,
    "selectedShelter",
    selectedShelter
  );

  const {
    currentPage,
    totalPages,
    currentItems,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(filteredPets);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  console.log("🧪 species:", species);
  console.log("🧪 breeds:", breeds);
  console.log("🧪 shelters:", shelters);
  console.log("🧪 selectedSpecie:", selectedSpecie);
  console.log(
    "🧪 filtered breeds visibles:",
    breeds.filter(
      (b) => !selectedSpecie || String(b.speciesId) === selectedSpecie
    )
  );

  return (
    <div className="min-h-screen overflow-auto bg-amarillito px-6 py-10 sm:px-12 lg:px-24 space-y-8">
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-start gap-4 flex-wrap">
        <div className="w-full md:w-auto">
          <h1 className="text-3xl font-bold text-negrito">
            Peluditos buscando hogar
          </h1>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="relative">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-100 text-sm text-negrito transition"
            >
              <ListFilter size={18} />
              <span>Filtros</span>
            </button>
            {filtersOpen && (
              <div
                ref={filterRef}
                className="absolute right-0 mt-2 w-[260px] bg-amarillito border border-moradito rounded-2xl shadow-md p-4 z-20 flex flex-col gap-2 text-sm text-negrito"
              >
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    goToPage(1);
                  }}
                  className="w-full px-3 py-1.5 rounded-full border border-gray-300 bg-white focus:ring-moradito focus:border-moradito"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedSpecie}
                  onChange={(e) => {
                    setSelectedSpecie(e.target.value);
                    setSelectedBreed("");
                    goToPage(1);
                  }}
                  className="w-full px-3 py-1.5 rounded-full border border-gray-300 bg-white focus:ring-moradito focus:border-moradito"
                >
                  <option value="">Todas las especies</option>
                  {species
                    .filter((s) => s.id !== undefined && s.id !== null)
                    .map((s) => (
                      <option key={s.id} value={String(s.id)}>
                        {s.name}
                      </option>
                    ))}
                </select>

                <select
                  value={selectedBreed}
                  onChange={(e) => {
                    setSelectedBreed(e.target.value);
                    goToPage(1);
                  }}
                  className="w-full px-3 py-1.5 rounded-full border border-gray-300 bg-white focus:ring-moradito focus:border-moradito"
                >
                  <option value="">Todas las razas</option>
                  {breeds
                    .filter(
                      (b) =>
                        !selectedSpecie ||
                        String(b.speciesId) === selectedSpecie
                    )
                    .map((b) => (
                      <option key={b.id} value={String(b.id)}>
                        {b.name}
                      </option>
                    ))}
                </select>

                <select
                  value={selectedShelter}
                  onChange={(e) => {
                    setSelectedShelter(e.target.value);
                    goToPage(1);
                  }}
                  className="w-full px-3 py-1.5 rounded-full border border-gray-300 bg-white focus:ring-moradito focus:border-moradito"
                >
                  <option value="">Todos los refugios</option>
                  {shelters
                    .filter((sh) => sh.id !== undefined && sh.id !== null)
                    .map((sh) => (
                      <option key={sh.id} value={String(sh.id)}>
                        {sh.name}
                      </option>
                    ))}
                </select>

                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    goToPage(1);
                  }}
                  className="w-full px-3 py-1.5 rounded-full border border-moradito bg-white focus:outline-none focus:ring-2 focus:ring-moradito"
                />

                <button
                  onClick={() => {
                    setStatusFilter("");
                    setSearchTerm("");
                    setSelectedSpecie("");
                    setSelectedBreed("");
                    setSelectedShelter("");
                    goToPage(1);
                  }}
                  className="text-m text-center mt-1 text-gray-500 underline hover:text-gray-800 transition"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>

          {canAddPet && (
            <button
              onClick={() => navigate("/addpetform")}
              className="bg-red-300 text-negrito text-sm font-medium px-4 py-1 rounded-full hover:bg-red-400 cursor-pointer inline-flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Agregar una mascota</span>
            </button>
          )}
        </div>
      </div>
      {currentItems.length > 0 ? (
        <>
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map((pet) => (
              <PetCard
                key={pet.id}
                id={pet.id}
                image={pet.photoUrl}
                name={pet.name}
                description={pet.description}
              />
            ))}
          </div>
          {allPets.length > 6 && (
            <div className="max-w-7xl mx-auto mt-16 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="text-gray-600 text-sm sm:text-base">
                Mostrando {currentItems.length} de {allPets.length} mascotas
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center px-4 py-2 rounded-full ${
                    currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-moradito text-white hover:bg-purple-700"
                  } transition-colors`}
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Anterior
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i + 1)}
                      className={`w-10 h-10 rounded-full text-sm font-medium ${
                        currentPage === i + 1
                          ? "bg-moradito text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      } transition-colors`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-4 py-2 rounded-full ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-moradito text-white hover:bg-purple-700"
                  } transition-colors`}
                >
                  Siguiente
                  <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div
          className="max-w-3xl mx-auto mt-20 text-center py-12 bg-white rounded-xl shadow"
          style={{ backgroundImage: `url(${fondito})` }}
        >
          <h2 className="text-2xl font-bold text-gray-900">¡Oops!</h2>
          <h3 className="text-xl font-semibold text-gray-800">
            No se encontraron peluditos con ese filtro 🐾
          </h3>
          <p className="mt-2 text-gray-500">
            No hay mascotas disponibles con el filtro seleccionado.
          </p>
        </div>
      )}
    </div>
  );
}