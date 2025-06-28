import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserRound, Trash2, SquarePen } from "lucide-react";
import PopUpForm from "../components/popupform.jsx";
import ClickPopup from "../components/clickpopup.jsx";
import api from "../services/api.js";
import bgimage from "../assets/bannerHoriz.jpg";
import { deleteUserById, updateUserProfile } from "../services/UserService";

export default function UserSettingPage() {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const [editing, setEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [rolesList, setRolesList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  const [form, setForm] = useState({
    nombre: "",
    rol: "",
    correo: "",
    telefono: "",
    dui: "",
  });

  const fetchUser = async () => {
    try {
      const res = await api.get(`/user/${routeId}`);
      const user = res.data;
      setForm({
        nombre: user.name,
        rol: user.rol,
        correo: user.email,
        telefono: user.phone,
        dui: user.dui,
      });
    } catch (error) {
      toast.error("No se pudo cargar la información del usuario");
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/enums/roles");
        setRolesList(res.data);
      } catch (err) {
        toast.error("Error al cargar roles");
        console.error(err);
      }
    };
    fetchRoles();
    fetchUser();
  }, [routeId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const { nombre, correo, telefono, dui, rol } = form;

    if (!nombre || !correo || !telefono || !dui || !rol) {
      setModalType("error");
      setShowModal(true);
      setIsSaving(false);
      return;
    }

    try {
      await updateUserProfile(routeId, {
        name: nombre,
        email: correo,
        phone: telefono,
        DUI: dui,
        rol: rol,
      });
      setModalType("success");
      setEditing(false);
    } catch (error) {
      console.error(error);
      setModalType("error");
    } finally {
      setShowModal(true);
    }
  };

  const handleDeleteClick = () => setShowConfirm(true);
  const closeConfirm = () => setShowConfirm(false);

  const handleConfirmDelete = async () => {
    console.log("ID que se está enviando:", routeId);
    setIsDeleting(true);
    try {
      await deleteUserById(routeId);
      toast.success("Usuario eliminado con éxito");
      navigate(-1);
    } catch (error) {
      const backendMsg =
        error.response?.data?.message ||
        error.message ||
        "Error al eliminar usuario";
      console.error(">>> ERROR RAW:", error);
      console.log(">>> backendMsg:", backendMsg);

      if (
        backendMsg.toLowerCase().includes("relaciones activas") ||
        backendMsg.toLowerCase().includes("constraint")
      ) {
        toast.error(
          "No se puede eliminar este usuario porque tiene solicitudes u otros datos vinculados."
        );
      } else if (error.response?.status === 404) {
        toast.error("El usuario no fue encontrado.");
      } else {
        toast.error(`Error al eliminar usuario: ${backendMsg}`);
      }
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (modalType === "success") {
      toast.success("Cambios guardados correctamente");
      navigate(-1);
    }
  };

  if (rolesList.length === 0) {
    return (
      <div className="text-center text-grisito mt-10">Cargando datos...</div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center py-10 px-4 flex flex-col items-center"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      <h2 className="text-4xl font-bold text-negrito drop-shadow-lg mb-10">
        Gestión de Usuario
      </h2>

      <div className="w-full max-w-3xl bg-white/90 rounded-3xl shadow-xl p-10 relative backdrop-blur-md transition-all duration-300">
        <div className="absolute top-4 right-4 flex gap-3">
          <button
            onClick={handleDeleteClick}
            className="text-red-600 transition-transform transform hover:scale-125"
            aria-label="Eliminar usuario"
          >
            <Trash2 size={24} />
          </button>
          <button
            onClick={() => setEditing((e) => !e)}
            className="text-negrito transition-transform transform hover:scale-125"
            aria-label="Editar usuario"
          >
            <SquarePen size={22} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-6 mb-4">
            <UserRound size={80} className="text-negrito drop-shadow" />
            {editing ? (
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="text-xl font-semibold px-4 py-2 border border-grisito rounded-lg w-full bg-white focus:outline-none shadow-inner"
                placeholder="Nombre del usuario"
              />
            ) : (
              <h3 className="text-2xl font-semibold text-negrito drop-shadow-md">
                {form.nombre}
              </h3>
            )}
          </div>

          <Field
            label="Rol"
            name="rol"
            type="select"
            value={form.rol}
            options={rolesList}
            onChange={handleChange}
            editing={editing}
          />

          <Field
            label="Correo"
            name="correo"
            type="text"
            value={form.correo}
            onChange={handleChange}
            editing={editing}
          />

          <Field
            label="Teléfono"
            name="telefono"
            type="text"
            value={form.telefono}
            onChange={handleChange}
            editing={editing}
          />

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-moradito">
              DUI
            </label>
            <p className="text-negrito text-lg drop-shadow">{form.dui}</p>
            <p className="text-sm text-red-500 italic">
              * El campo DUI no se puede editar
            </p>
          </div>

          {editing && (
            <div className="flex justify-end pt-6 gap-4">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  fetchUser(); 
                }}
                className="px-6 py-2 rounded-full font-semibold bg-gray-300 text-negrito hover:bg-gray-400 transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className={`px-8 py-2 font-semibold rounded-full shadow transition duration-300 ${
                  isSaving
                    ? "bg-moradito hover:bg-purple-300 cursor-not-allowed text-white"
                    : "bg-moradito hover:bg-purple-300 text-negrito hover:scale-105"
                }`}
              >
                {isSaving ? "Actualizando usuario..." : "Guardar cambios"}
              </button>
            </div>
          )}
        </form>
      </div>

      {showModal && (
        <PopUpForm
          type={modalType}
          message={
            modalType === "success"
              ? "Usuario actualizado con éxito"
              : "Error al actualizar usuario"
          }
          onClose={closeModal}
        />
      )}
      {showConfirm && (
        <ClickPopup
          message="¿Estás seguro que quieres eliminar este usuario?"
          onConfirm={handleConfirmDelete}
          onCancel={closeConfirm}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}

function Field({ label, name, type, value, onChange, editing, options }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-moradito">
        {label}
      </label>
      {editing ? (
        type === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full border border-grisito rounded-lg px-4 py-2 focus:outline-none bg-white shadow-inner"
          >
            <option value="">Selecciona un rol</option>
            {options.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full border border-grisito rounded-lg px-4 py-2 focus:outline-none bg-white shadow-inner"
          />
        )
      ) : (
        <p className="text-negrito text-lg drop-shadow">{value}</p>
      )}
    </div>
  );
}
