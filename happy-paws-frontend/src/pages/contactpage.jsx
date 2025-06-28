import React from "react";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { UseForm } from "../hooks/form";
import { toast } from "react-toastify";
import Fondito from "../assets/bannerHoriz.jpg";

export default function ContactPage() {
  const initialValues = { comment: "" };

  const validate = (vals) =>
    !vals.comment ? "Por favor escribe tu comentario" : null;

  const onSubmit = () => {
    toast.success("¡Gracias por tu comentario!");
  };

  const { values, handleChange, handleSubmit } = UseForm(
    initialValues,
    validate,
    { showErrorToast: true }
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${Fondito})` }}>
      <div className="bg-blanquito bg-opacity-90 rounded-2xl shadow-lg p-8 max-w-md w-full space-y-6">
        <h2 className="text-3xl font-bold text-azulito text-center">
          Contáctanos
        </h2>
        <p className="text-center text-grisito">
          Encuéntranos en nuestras redes:
        </p>
        <div className="flex justify-center space-x-6 text-azulito">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram size={28} className="hover:text-negrito transition" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Facebook size={28} className="hover:text-negrito transition" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter size={28} className="hover:text-negrito transition" />
          </a>
        </div>
        <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 text-negrito">Déjanos tu comentario</label>
            <textarea
              name="comment"
              value={values.comment}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-grisito rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-300"/>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-moradito text-negrito rounded-full font-medium hover:bg-purple-300 transition">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
