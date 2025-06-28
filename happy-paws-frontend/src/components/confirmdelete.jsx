import React from "react";
import Icon3 from "../assets/icon3.png";

export default function ConfirmDelete({
  visible,
  onConfirm,
  onCancel,
  message,
  isLoading
}) {
  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-transparent to-anaranjadito/50 backdrop-blur-sm z-40" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-anaranjadito p-6 pt-10 rounded-2xl w-96 relative shadow-xl text-center">
          <img src={Icon3} alt="Patita" className="mx-auto w-12 h-12 mb-4" />
          <p className="text-negrito mb-6">
            {message || "¿Está seguro que desea eliminar este item?"}
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="px-6 py-2 bg-grisito text-negrito rounded-full hover:bg-grisito/80 transition cursor-pointer"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="btn-confirm bg-red-300 rounded-full hover:bg-red-400 cursor-pointer px-6 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
