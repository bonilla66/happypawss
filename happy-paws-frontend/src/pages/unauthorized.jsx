import React from "react";
import { useNavigate } from "react-router-dom";
import unauth from "../assets/unauthorized-access.png"; 
import fondito from "../assets/bannerHoriz.jpg";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div
        className="w-full bg-cover h-full flex flex-col justify-center items-center"
        style={{ backgroundImage: `url(${fondito})` }}>
      <img src={unauth} alt="Acceso no autorizado" className="w-72 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">¡401! ¡Alto ahí!</h1>
      <p className="text-lg text-gray-600 mb-6">
        Lo sentimos, no tienes autorización para ver esta página.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-moradito hover:bg-purple-200 text-negrito px-4 py-2 rounded-full transition">
          Volver al inicio
        </button>
        <button
          onClick={() => navigate("/contactus")}
          className=" bg-moradito text-negrito hover:bg-purple-200 px-4 py-2 rounded-full transition">
          Contáctanos
        </button>
      </div>
    </div>
  );
}
