import React, { useState, useEffect } from "react";
import { X, Tag, Edit3 } from "lucide-react";

export default function ModalAttribute({ show, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    attributeName: "",
    attributeValue: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ attributeName: "", attributeValue: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.attributeName || !form.attributeValue) {
      alert("Complete todos los campos");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      await onSave(form);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-transparent to-anaranjadito/50 backdrop-blur-sm z-40 flex items-center justify-center">
      <div className="bg-anaranjadito p-6 rounded-2xl w-96 relative">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          aria-label="Cerrar"
          disabled={loading}
        >
          <X size={20} />
        </button>
        <h3 className="text-lg font-bold mb-4">
          {initialData ? "Editar atributo" : "Agregar atributo"}
        </h3>
        <div className="mb-3 flex items-center gap-2">
          <Tag size={18} className="text-gray-500" />
          <input
            name="attributeName"
            placeholder="Nombre del atributo"
            value={form.attributeName}
            onChange={handleChange}
            disabled={loading}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <Edit3 size={18} className="text-gray-500" />
          <input
            name="attributeValue"
            placeholder="Valor del atributo"
            value={form.attributeValue}
            onChange={handleChange}
            disabled={loading}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="cursor-pointer btn btn-secondary px-4 py-2 rounded-full hover:bg-gray-400"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`cursor-pointer btn btn-primary px-4 py-2 rounded-full hover:bg-red-200 ${
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
