import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  UserRound,
  MoreHorizontal,
  Mail,
  Phone,
  IdCard,
  Eye,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../services/UserService";
import api from "../services/api";
import fondito from "../assets/bannerHoriz.jpg";

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const [formValues, setFormValues] = useState({
    nombre: "",
    rol: "",
    correo: "",
    telefono: "",
    dui: "",
  });

  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (user) {
      setFormValues({
        nombre: user.name || "",
        rol: user.rol || "",
        correo: user.email || "",
        telefono: user.phone || "",
        dui: user.dui || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, petsRes, requestsRes] = await Promise.all([
          api.get("/user/all"),
          api.get("/pets/all"),
          api.get("/aplication/all"),
        ]);
        setUsers(usersRes.data);
        setPets(petsRes.data);
        setRequests(requestsRes.data);
      } catch (err) {
        toast.error("Error al cargar datos del panel");
        console.error(err);
      } finally {
        setLoadingUsers(false);
        setLoadingPets(false);
        setLoadingRequests(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((v) => ({ ...v, [name]: value }));
  };

  const handleSave = async () => {
    const { nombre, correo, telefono } = formValues;

    if (!nombre || !correo || !telefono) {
      toast.error("Por favor, complete todos los campos");
      return;
    }

    try {
      const updatedData = {
        name: nombre,
        email: correo,
        phone: telefono,
        rol: formValues.rol,
      };

      const updatedUser = await updateUserProfile(user.id, updatedData);

      setFormValues({
        nombre: updatedUser.name,
        correo: updatedUser.email,
        telefono: updatedUser.phone,
        dui: updatedUser.dui,
        rol: updatedUser.rol,
      });

      toast.success("Perfil actualizado con éxito");
      setEditing(false);
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Error al actualizar perfil");
        console.error(error);
      }
    }
  };

  const getUserNameById = (id) => {
    const user = users.find((u) => u.id_user === id);
    return user ? user.name : "Usuario desconocido";
  };

  const getPetNameById = (id) => {
    const pet = pets.find((p) => p.id === id);
    return pet ? pet.name : "Mascota desconocida";
  };

  if (loadingUsers || loadingPets || loadingRequests) {
    return (
      <div className="h-screen w-full bg-amarillito flex items-center justify-center text-2xl text-negrito">
        Cargando datos del panel...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-amarillito via-rosadito to-moradito"
      style={{ backgroundImage: `url(${fondito})` }}
    >
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-20 right-6 z-[100] bg-amarillito p-2 rounded-full shadow-lg border border-grisito"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside
        ref={mobileMenuRef}
        className={`w-full lg:w-1/5 bg-amarillito shadow-2xl border-b lg:border-r border-grisito p-4 lg:p-6 fixed lg:static z-50 h-full transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="relative" ref={dropdownRef}>
          <h1 className="text-lg lg:text-xl font-light text-azulito mb-4 lg:mb-6 text-center lg:text-left">
            Información de mi perfil
          </h1>

          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="absolute top-4 right-4 text-negrito hover:text-grisito"
          >
            <MoreHorizontal size={24} />
          </button>

          {dropdownOpen && (
            <div className="absolute top-12 right-2 bg-amarillito shadow-xl rounded-md z-50 w-48">
              <button
                onClick={() => {
                  setEditing(true);
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-grisito text-sm text-negrito"
              >
                Editar perfil
              </button>
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-grisito text-sm text-negrito"
              >
                Agregar datos
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center lg:items-start gap-4 mb-4 lg:mb-6 mt-8">
          <UserRound size={80} className="text-negrito" />
          <div className="text-center lg:text-left">
            {editing ? (
              <input
                type="text"
                name="nombre"
                value={formValues.nombre}
                onChange={handleChange}
                className="w-full border-b border-grisito focus:outline-none bg-transparent text-center lg:text-left"
              />
            ) : (
              <h2 className="text-lg lg:text-xl font-semibold text-negrito mb-1 break-words max-w-[200px] lg:max-w-none">
                {formValues.nombre}
              </h2>
            )}
            <p className="text-grisito capitalize">{formValues.rol}</p>
          </div>
        </div>

        <div className="space-y-4 mb-4 lg:mb-4 text-center lg:text-left">
          <InfoField
            icon={<Mail size={20} />}
            label="Correo"
            value={formValues.correo}
            editing={editing}
            onChange={handleChange}
            name="correo"
          />
          <InfoField
            icon={<Phone size={20} />}
            label="Teléfono"
            value={formValues.telefono}
            editing={editing}
            onChange={handleChange}
            name="telefono"
          />
          <div>
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
              <IdCard size={20} className="text-grisito" />
              <span className="text-grisito text-lg lg:text-xl">DUI:</span>
            </div>
            <p className="text-lg lg:text-xl text-negrito break-all max-w-[230px] lg:max-w-none">
              {formValues.dui}
            </p>
          </div>
        </div>

        {editing && (
          <div className="flex flex-col sm:flex-row gap-2 mb-6 justify-center lg:justify-start">
            <button
              onClick={handleSave}
              className="text-negrito border border-grisito rounded-full px-4 py-1 text-lg hover:bg-purple-300 transition"
            >
              Guardar
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-negrito border border-grisito rounded-full px-4 py-1 text-lg hover:bg-red-200 transition"
            >
              Cancelar
            </button>
          </div>
        )}

        <div className="flex justify-center lg:justify-start">
          <button
            onClick={() => {
              try {
                logout();
                navigate("/");
                toast.info("Sesión cerrada");
              } catch (err) {
                toast.error("No se pudo cerrar sesión");
                console.log(err);
              }
            }}
            className="text-negrito border border-grisito rounded-full px-4 py-1 text-lg hover:bg-red-200 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="w-full lg:w-4/5 p-4 lg:p-8 space-y-8 mt-16 lg:mt-0">
        <h2 className="text-2xl lg:text-3xl font-bold text-negrito">
          Panel de administración
        </h2>

        <DataSection
          title="Usuarios"
          columns={["ID", "Nombre", "Rol", "Acción"]}
          data={users.map((u) => [
            u.id_user,
            u.name,
            u.rol,
            <Link
              to={`/usersetting/${u.id_user}`}
              className="text-azulito hover:underline flex items-center gap-1 transition-transform duration-200 transform hover:scale-105"
            >
              <Eye size={16} />
              Ver más
            </Link>,
          ])}
        />

        <DataSection
          title="Mascotas"
          columns={["ID", "Nombre", "Raza", "Acción"]}
          data={pets.map((p) => [
            p.id,
            p.name,
            p.breed || "Sin raza",
            <Link
              to="/editpet"
              state={{ id: p.id }}
              className="text-azulito hover:underline flex items-center gap-1 transition-transform duration-200 transform hover:scale-105"
            >
              <Eye size={16} />
              Ver más
            </Link>,
          ])}
        />

        <DataSection
          title="Solicitudes de Adopción"
          columns={["ID", "Usuario", "Mascota", "Estado", "Acción"]}
          data={requests.map((r) => [
            r.id,
            getUserNameById(r.userId),
            getPetNameById(r.petId),
            r.aplicationState,
            <Link
              to={`/solisetting/${r.id}`}
              className="text-azulito hover:underline flex items-center gap-1 transition-transform duration-200 transform hover:scale-105"
            >
              <Eye size={16} />
              Ver más
            </Link>,
          ])}
        />
      </main>
    </div>
  );
}

function InfoField({ icon, label, value, editing, onChange, name }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-grisito text-xl">{label}:</span>
      </div>
      {editing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border-b border-grisito focus:outline-none bg-transparent"
        />
      ) : (
        <p className="text-xl text-negrito break-all overflow-hidden">
          {value}
        </p>
      )}
    </div>
  );
}

function DataSection({ title, columns, data }) {
  const [filterText, setFilterText] = useState("");

  const normalizar = (str) =>
    str
      ?.toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredData = data.filter((row) =>
    row.some((cell) =>
      normalizar(cell).toString().includes(normalizar(filterText))
    )
  );

  return (
    <section className="bg-amarillito shadow-lg rounded-xl p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
        <h3 className="text-lg lg:text-xl font-semibold text-negrito">{title}</h3>
        <div className="relative w-full lg:w-60">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Buscar..."
            className="pl-10 pr-3 py-1 w-full rounded-full text-sm bg-blanquito text-negrito border border-grisito focus:outline-none focus:ring-2 focus:ring-rosadito"
          />
          <Search className="absolute left-3 top-1.5 w-4 h-4 text-grisito" />
        </div>
      </div>
      <div className="hidden lg:block max-h-[220px] overflow-y-auto">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-amarillito z-10">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-4 py-2 text-left text-grisito font-medium whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-grisito">
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => (
                <tr key={idx}>
                  {row.map((cell, i) => (
                    <td key={i} className="px-4 py-2 text-left break-words">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center text-grisito italic py-4"
                >
                  No hay resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="lg:hidden space-y-3">
        {filteredData.length > 0 ? (
          filteredData.map((row, idx) => (
            <div key={idx} className="bg-blanquito p-4 rounded-lg shadow">
              <div className="space-y-2">
                {row.map((cell, i) => (
                  <div key={i} className="flex flex-col sm:flex-row">
                    <span className="text-grisito font-medium sm:w-1/3">
                      {columns[i]}:
                    </span>
                    <span className="sm:w-2/3 break-all">{cell}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-grisito italic py-4">
            No hay resultados.
          </div>
        )}
      </div>
    </section>
  );
}