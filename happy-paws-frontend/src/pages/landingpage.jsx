import React from "react";
import { Link } from "react-router-dom";
import fondito from "../assets/group4.jpg";
import { ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div
        className="flex-1 relative w-full bg-cover bg-center text-azulito flex items-center justify-center"
        style={{ backgroundImage: `url(${fondito})` }}>
        <div className="w-full max-w-screen-lg px-8 text-center">
          <h1 className="text-5xl lg:text-7xl leading-tight">
            <span className="font-normal">Cada </span>
            <span className="font-semibold">huella </span>
            <span className="font-normal">cuenta una </span>
            <span className="font-semibold">historia</span>
          </h1>
          <p className="mt-4 text-xl lg:text-2xl max-w-3xl mx-auto">
            <span className="font-bold">HappyPaws</span>, un lugar donde los
            perros callejeros, perdidos, abandonados encuentran un hogar.
          </p>
          <Link
            to="/mascotas"
            className="mt-8 inline-flex items-center space-x-3 px-8 py-4 bg-moradito text-negrito font-medium rounded-full hover:bg-purple-300 hover:text-white transition-colors duration-200 whitespace-nowrap">
            <span>Ver peluditos</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
