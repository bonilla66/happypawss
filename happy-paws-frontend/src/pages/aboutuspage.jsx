import React from "react";
import Fondito from "../assets/bannerHoriz.jpg";
import Usdog1 from "../assets/usdog1.png";
import Usdog2 from "../assets/usdog2.png";

export default function AboutUs() {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${Fondito})` }}>
      <div className="relative px-4 py-4 max-w-6xl mx-auto space-y-16">
        <h1 className="text-4xl font-bold text-azulito">Acerca de Nosotros</h1>
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <p className="text-azulito font-semibold">
              <span className="font-normal">HappyPaws</span>, un lugar donde los
              perros callejeros, perdidos y abandonados encuentran un hogar en
              donde ser felices y amados.
            </p>
            <p className="text-grisito leading-relaxed">
             En Happy Paws, creemos que cada mascota merece un hogar lleno de amor y que cada persona merece
              la alegría de compartir su vida con un compañero peludo. Somos una comunidad apasionada que conecta 
              a animales rescatados con familias dispuestas a darles una segunda oportunidad.

              Nuestra plataforma nació para simplificar el proceso de adopción, haciendo que sea seguro, transparente y 
              emocionante. Trabajamos mano a mano con refugios, protectoras y adoptantes para garantizar que cada historia 
              tenga un final feliz.
            </p>
          </div>
          <div className="flex-1">
            <img
              src={Usdog1}
              alt="Perrito adopt me"
              className="w-full rounded-xl shadow-lg object-cover"/>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row-reverse items-center lg:items-start gap-8">
          <div className="flex-1 space-y-4 text-center lg:text-right">
            <h2 className="text-3xl font-semibold text-azulito">Nuestra Misión</h2>
            <p className="text-grisito leading-relaxed">
             Conectar, educar y salvar vidas.
              Facilitamos el encuentro entre mascotas y adoptantes mediante un sistema intuitivo y 
              lleno de empatía.
              Promovemos la tenencia responsable con recursos, consejos y seguimiento post-adopción.
              Cada adopción en Happy Paws es un paso hacia un mundo sin abandono animal.

              ¡Porque las patitas felices cambian el mundo!.
            </p>
          </div>
          <div className="flex-1">
            <img
              src={Usdog2}
              alt="Perrito nuestra misión"
              className="w-full rounded-xl shadow-lg object-cover"/>
          </div>
        </div>
      </div>
    </div>
  );
}
