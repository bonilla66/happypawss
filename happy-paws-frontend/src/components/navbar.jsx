import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/icon1.png";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react"; // íconos para abrir/cerrar menú

export default function Navbar() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // estado para menú móvil

  if (loading) return null;

  const settingsRoute =
    user?.rol === "ADMIN"
      ? "/adminpage"
      : user?.rol === "COLABORADOR"
      ? "/colaboradorpage"
      : "/profilepage";

  return (
    <nav className="bg-amarillito relative z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="HappyPaws logo" className="w-8 h-8" />
          <span className="text-azulito font-bold text-xl">HappyPaws</span>
        </Link>

        {/* Botón menú hamburguesa para móviles */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6 text-azulito" /> : <Menu className="w-6 h-6 text-azulito" />}
          </button>
        </div>

        {/* Menú normal en pantallas grandes */}
        <ul className="hidden md:flex space-x-6 text-lg">
          <li>
            <Link to="/mascotas" className="text-azulito hover:underline">
              mascotas
            </Link>
          </li>
          <li>
            <Link to="/aboutus" className="text-azulito hover:underline">
              sobre nosotros
            </Link>
          </li>
          <li>
            <Link to="/contactus" className="text-azulito hover:underline">
              contáctanos
            </Link>
          </li>
        </ul>

        {/* Botón login o perfil */}
        <div className="hidden md:block">
          {!user ? (
            <Link
              to="/login"
              className="text-lg px-4 py-1.5 border border-azulito text-azulito font-medium rounded-full hover:bg-blue-300 hover:text-white transition">
              Iniciar sesión
            </Link>
          ) : (
            <Link
              to={settingsRoute}
              className="text-lg px-4 py-1.5 border border-azulito text-azulito font-medium rounded-full hover:bg-blue-300 hover:text-white transition">
              {user.name?.split(" ")[0]}
            </Link>
          )}
        </div>
      </div>

      {/* Menú desplegable para móviles */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-amarillito">
          <Link to="/mascotas" className="block text-azulito">mascotas</Link>
          <Link to="/aboutus" className="block text-azulito">sobre nosotros</Link>
          <Link to="/contactus" className="block text-azulito">contáctanos</Link>
          {!user ? (
            <Link
              to="/login"
              className="block text-lg px-4 py-2 border border-azulito text-azulito rounded-full text-center hover:bg-blue-300 hover:text-white transition">
              Iniciar sesión
            </Link>
          ) : (
            <Link
              to={settingsRoute}
              className="block text-lg px-4 py-2 border border-azulito text-azulito rounded-full text-center hover:bg-blue-300 hover:text-white transition">
              {user.name?.split(" ")[0]}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
