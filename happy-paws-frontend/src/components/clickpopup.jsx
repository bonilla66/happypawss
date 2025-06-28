import React from "react";
import Icon3 from "../assets/icon3.png";

export default function ClickPopup({ message, onConfirm, onCancel, isLoading }) {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-transparent to-anaranjadito/50 backdrop-blur-sm z-40" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="relative w-80 bg-anaranjadito rounded-xl shadow-lg">
          <button
            onClick={onCancel}
            className="absolute top-2 right-2 text-negrito hover:text-grisito text-3xl leading-none cursor-pointer"
          >
            ×
          </button>
          <div className="p-6 pt-10 text-center">
            <img
              src={Icon3}
              alt="warning icon"
              className="mx-auto w-12 h-12 mb-3"
            />
            <p className="text-negrito leading-snug mb-6">{message}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-full ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Eliminando usuario..." : "Sí, eliminar"}
              </button>

              <button
                onClick={onCancel}
                className="px-6 py-2 bg-grisito text-negrito rounded-full hover:bg-grisito/80 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
