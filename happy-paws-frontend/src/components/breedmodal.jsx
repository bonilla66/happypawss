import React, { useState, useEffect } from "react";

export default function ModalBreed({
  show,
  onClose,
  onSave,
  initialData,
  species,
}) {
  const [name, setName] = useState("");
  const [speciesId, setSpeciesId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSpeciesId(initialData.speciesId);
    } else {
      setName("");
      setSpeciesId("");
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Ingrese el nombre de la raza");
      return;
    }
    if (!speciesId) {
      alert("Seleccione la especie");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      await onSave({ name: name.trim(), speciesId });
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-transparent to-anaranjadito/50 backdrop-blur-sm z-40 flex items-center justify-center">
      <div className="bg-anaranjadito p-6 rounded-2xl w-80 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer text-negrito hover:text-grisito text-2xl"
        >
          ×
        </button>
        <h3 className="text-lg font-bold mb-4">
          {initialData ? "Editar Raza" : "Agregar Raza"}
        </h3>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <select
          value={speciesId}
          onChange={(e) => setSpeciesId(Number(e.target.value))}
          className="w-full border p-2 rounded bg-anaranjadito text-negrito"
        >
          <option value="">Seleccione una especie</option>
          {species.map((sp) => (
            <option key={sp.id} value={sp.id}>
              {sp.name}
            </option>
          ))}
        </select>

        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="btn btn-secondary px-4 py-2 rounded-full hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`btn btn-primary px-4 py-2 rounded-full hover:bg-red-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
