import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Fondito from "../assets/bannerHoriz.jpg";
import BannerImage from "../assets/Group5.png";
import { UseForm } from "../hooks/form";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {

  const { login } = useAuth();
  const navigate = useNavigate();


  const initialValues = { email: "", password: "" };
  const validate = (vals) =>
    !vals.email || !vals.password ? "Por favor completa todos los campos" : null;


const onSubmit = async () => {
  try {
    const user = await login({
      email: values.email,
      password: values.password,
    });

    if (user) {
      toast.success("¡Bienvenido de nuevo!");
      const route =
        user.rol === "ADMIN"
          ? "/"
          : user.rol === "COLABORADOR"
          ? "/"
          : "/";
      navigate(route);
    }
  } catch (error) {
    toast.error("Credenciales inválidas");
    console.error("Login error", error);
  }
};

  const { values, handleChange, handleSubmit } = UseForm(
    initialValues,
    validate,
    { showErrorToast: true }
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${Fondito})` }}>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-amarillito backdrop-blur-sm max-w-6xl w-full rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <img
              src={BannerImage}
              alt="Banner mascotas"
              className="w-full h-full object-cover"/>
          </div>
          <div className="md:w-1/2 p-12 flex flex-col justify-center space-y-6">
            <h2 className="text-4xl font-bold text-azulito text-center">
              ¡Qué gusto verte de nuevo!
            </h2>
            <p className="text-negrito text-center">
              Inicia sesión para seguir ayudando a encontrar hogares felices
            </p>
            <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-6">
              <div className="flex flex-col">
                <label className="mb-1 text-grisito">Correo electrónico</label>
                <input
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  type="email"
                  className="w-full h-8 px-4 border border-grisito rounded-full focus:outline-none focus:ring-1 focus:ring-purple-300"/>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-grisito">Contraseña</label>
                <input
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  type="password"
                  className="w-full h-8 px-4 border border-grisito rounded-full focus:outline-none focus:ring-1 focus:ring-purple-300"/>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-moradito text-negrito rounded-full font-medium hover:bg-purple-300 transition">
                Iniciar sesión
              </button>
            </form>
            <p className="text-center text-sm text-negrito">
              ¿Aún no tienes cuenta?{" "}
              <Link to="/signup" className="text-azulito font-medium hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
