import { useLocation, useNavigate } from "react-router-dom";
import PopUpForm from "../components/popupform.jsx";
import ConfirmDelete from "../components/confirmdelete.jsx";
import { Trash2 } from "lucide-react";
import fondito from "../assets/bannerHoriz.jpg";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import useWizard from "../hooks/useWizard.js";
import api from "../services/api.js";
import { PawPrint, Ruler, Stethoscope, Eye, BookText } from "lucide-react";
import { toast } from "react-toastify";

export default function EditPet() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = state || {};
  const { step, next, prev } = useWizard(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [form, setForm] = useState({
    photoURL: "",
    nombre: "",
    edad: "",
    edadUnidad: "",
    raza: "",
    sexo: "",
    tamaño: "",
    tipo: "",
    descripcion: "",
    esterilizado: false,
    desparasitado: false,
    vacunado: false,
    llegada: "",
    peso: "",
    shelterId: "",
    petAttributeIds: [],
    entryDate: "",
    reviewDate: "",
    history: "",
  });

  const [species, setSpecies] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [_attributes, setAttributes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [speciesRes, sizesRes, gendersRes, sheltersRes, attributesRes] =
          await Promise.all([
            api.get("/species/all"),
            api.get("/enums/sizes"),
            api.get("/enums/genders"),
            api.get("/shelters/all"),
            api.get("/pet_attributes/all"),
          ]);
        setSpecies(speciesRes.data);
        setSizes(sizesRes.data);
        setGenders(gendersRes.data);
        setShelters(sheltersRes.data);
        setAttributes(attributesRes.data);
      } catch (error) {
        console.error("Error cargando catálogos:", error);
        toast.error("Error al cargar catálogos. Intenta de nuevo.");
      }
    };
    fetchCatalogs();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchPet = async () => {
      try {
        const { data: pet } = await api.get(`/pets/${id}`);
        setForm({
           imageId: pet.imageId || null,
            photoURL: pet.photoURL || "",
          nombre: pet.name || "",
          edad: pet.ageValue?.toString() || "",
          edadUnidad: pet.ageUnit || "",
          raza: pet.breedId?.toString() || "",
          sexo:
            pet.gender === "MACHO" || pet.gender === "HEMBRA" ? pet.gender : "",
          tamaño: pet.sizeId?.toString() || "",
          tipo: pet.speciesId?.toString() || "",
          descripcion: pet.description || "",
          esterilizado: pet.sterilized || false,
          desparasitado: pet.parasiteFree || false,
          vacunado: pet.fullyVaccinated || false,
          llegada: pet.history || "",
          peso: pet.weight?.toString() || "",
          shelterId: pet.shelterId?.toString() || "",
          petAttributeIds:
            pet.petAttributeIds?.map((id) => id.toString()) || [],
          entryDate: pet.entryDate?.split("T")[0] || "",
          reviewDate: pet.reviewDate?.split("T")[0] || "",
          history: pet.history || "",
        });
      } catch (error) {
        console.error("Error al cargar la mascota:", error);
        toast.error("No se pudo cargar la información de la mascota.");
      }
    };
    fetchPet();
  }, [id]);

  useEffect(() => {
    if (!form.tipo) return setBreeds([]);
    api.get(`/breeds/byspecie/${form.tipo}`).then((res) => setBreeds(res.data));
  }, [form.tipo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const faltanCampos = [
      "nombre",
      "edad",
      "edadUnidad",
      "sexo",
      "tamaño",
      "tipo",
      "descripcion",
      "llegada",
      "entryDate",
      "reviewDate",
      "shelterId",
    ].some((campo) => !form[campo]);

    if (faltanCampos) {
      setModalType("error");
      setShowModal(true);
      toast.warn(
        "Por favor, completa todos los campos obligatorios antes de continuar."
      );
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: form.nombre,
      ageValue: parseInt(form.edad) || 0,
      ageUnit: form.edadUnidad,
      gender: form.sexo?.toUpperCase(),
      weight: form.peso ? parseFloat(form.peso) : null,
      sterilized: form.esterilizado,
      parasiteFree: form.desparasitado,
      fullyVaccinated: form.vacunado,
      entryDate: form.entryDate,
      reviewDate: form.reviewDate,
      description: form.descripcion,
      history: form.llegada,
       imageId: form.imageId || null, 
      photoURL: form.photoURL || null,
      shelterId: parseInt(form.shelterId),
      speciesId: parseInt(form.tipo),
      sizeId: parseInt(form.tamaño),
      breedId: form.raza ? parseInt(form.raza) : null,
      petAttributeIds: form.petAttributeIds.map((id) => parseInt(id)),
    };

   
    try {
      console.log("Payload a enviar:", payload);
      console.log("ID:", id);
      await api.patch(`/pets/${id}`, payload);
      toast.success("Mascota actualizada con éxito.");
      setModalType("success");
    } catch (error) {
      console.error("Error al actualizar mascota:", error);
      toast.error(
        "Ocurrió un error al actualizar la mascota. Intenta nuevamente."
      );
      setModalType("error");
      console.error(
        "Error actualizando mascota:",
        error.response?.data || error.message,
        error
      );
      toast.error(
        `Error al actualizar: ${error.response?.status} ${
          error.response?.data?.message || error.message
        }`
      );
    }
    setIsSubmitting(false);
    setShowModal(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/pets/${id}`);
      toast.success("Mascota eliminada exitosamente.");
      navigate(-1);
    } catch (error) {
      console.error("Error al eliminar mascota:", error);
      toast.error("No se pudo eliminar la mascota. Intenta nuevamente.");
    }
    setIsDeleting(false);
    setShowDeleteModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    if (modalType === "success") navigate(-1);
  };

  const inputStyle =
    "mt-1 block w-full rounded-full border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-moradito focus:border-transparent transition";

  const faltanCampos =
    !form.nombre ||
    !form.edad ||
    !form.gender ||
    !form.shelterId ||
    !form.speciesId ||
    !form.raza;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-bold text-moradito flex items-center gap-2">
                <PawPrint className="w-5 h-5" /> Datos generales
              </h4>
              <p className="text-sm text-gray-500">
                Datos obligatorios{" "}
                <span className="text-red-600 font-bold text-m">*</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
  <label className="block text-sm font-semibold text-negrito mb-1">
    Nombre de la Foto <span className="text-red-600 font-bold">*</span>
  </label>
  <input
    type="file"
    accept="image/*"
    onChange={async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await api.post("/image/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setForm((prev) => ({
          ...prev,
          photoURL: data.imgURL,
          imageId: data.id,
        }));
        toast.success("Imagen subida con éxito");
      } catch (error) {
        toast.error("Error al subir imagen");
        console.error(error);
      }
    }}
  />
  {form.photoURL && (
    <img
      src={form.photoURL}
      alt="Imagen de la mascota"
      className="w-32 h-32 mt-2 rounded-xl object-cover border border-gray-300 shadow"
    />
  )}
</div>


              <div>
                <label className="block text-sm font-semibold text-negrito mb-1">
                  Nombre de la mascota{" "}
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-negrito mb-1">
                    Edad <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    name="edad"
                    value={form.edad}
                    onChange={handleChange}
                    className={inputStyle}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-negrito mb-1">
                    Unidad <span className="text-red-600 font-bold">*</span>
                  </label>
                  <select
                    name="edadUnidad"
                    value={form.edadUnidad}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option value="">Selecciona</option>
                    <option value="MESES">Meses</option>
                    <option value="AÑOS">Años</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-negrito mb-1">
                  Refugio actual{" "}
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  name="shelterId"
                  value={form.shelterId}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Selecciona</option>
                  {shelters.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-negrito mb-1">
                  Peso aproximado (kg){" "}
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="number"
                  name="peso"
                  value={form.peso}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-bold text-moradito flex items-center gap-2">
                <Ruler className="w-5 h-5" /> Características físicas
              </h4>
              <p className="text-sm text-gray-500">
                Datos obligatorios{" "}
                <span className="text-red-600 font-bold">*</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-negrito">
                  Especie <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Selecciona</option>
                  {species.map((s) => (
                    <option key={s.id_species} value={s.id_species}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-negrito">
                  Raza
                </label>
                <select
                  name="raza"
                  value={form.raza}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Selecciona</option>
                  {breeds.map((b) => (
                    <option key={b.id_breed} value={b.id_breed}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-negrito">
                  Sexo <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  name="sexo"
                  value={form.sexo}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Selecciona</option>
                  {genders.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-negrito">
                  Tamaño <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  name="tamaño"
                  value={form.tamaño}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Selecciona</option>
                  {sizes.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-bold text-moradito flex items-center gap-2">
                <Stethoscope className="w-5 h-5" /> Información médica
              </h4>
              <p className="text-sm text-gray-500">
                Datos obligatorios{" "}
                <span className="text-red-600 font-bold">*</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-negrito">
                  Fecha de ingreso{" "}
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="date"
                  name="entryDate"
                  value={form.entryDate}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-negrito">
                  Fecha de revisión{" "}
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="date"
                  name="reviewDate"
                  value={form.reviewDate}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-600 italic mb-2">
                Marca solo las casillas que apliquen para esta mascota:
              </p>

              <div className="grid grid-cols-3 gap-4">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="esterilizado"
                    checked={form.esterilizado}
                    onChange={handleChange}
                  />
                  <span>Esterilizado</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="desparasitado"
                    checked={form.desparasitado}
                    onChange={handleChange}
                  />
                  <span>Desparasitado</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="vacunado"
                    checked={form.vacunado}
                    onChange={handleChange}
                  />
                  <span>Vacunado</span>
                </label>
              </div>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-bold text-moradito flex items-center gap-2">
                <BookText className="w-5 h-5" /> Historia y atributos
              </h4>
              <p className="text-sm text-gray-500">
                Datos obligatorios{" "}
                <span className="text-red-600 font-bold">*</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-negrito">
                Descripción <span className="text-red-600 font-bold">*</span>
              </label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-moradito focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-negrito">
                Historia de llegada{" "}
                <span className="text-red-600 font-bold">*</span>
              </label>
              <textarea
                name="llegada"
                value={form.llegada}
                onChange={handleChange}
                rows={2}
                className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-moradito focus:border-transparent transition"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-negrito mb-2">
                Atributos especiales
              </label>
              <div className="bg-white rounded-xl border border-gray-300 shadow-inner max-h-[160px] overflow-y-auto divide-y divide-gray-200">
                {_attributes.map((attr) => (
                  <div
                    key={attr.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col mr-4">
                      <span className="text-sm font-semibold text-moradito">
                        {attr.attributeName}
                      </span>
                      <span className="text-gray-600 text-xs">
                        {attr.attributeValue}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={form.petAttributeIds.includes(
                        attr.id.toString()
                      )}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        const updated = isChecked
                          ? [...form.petAttributeIds, attr.id.toString()]
                          : form.petAttributeIds.filter(
                              (id) => id !== attr.id.toString()
                            );
                        setForm((prev) => ({
                          ...prev,
                          petAttributeIds: updated,
                        }));
                      }}
                      className="h-5 w-5 accent-moradito cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-moradito flex items-center gap-2">
              <Eye className="w-5 h-5" /> Vista previa
            </h4>

            {faltanCampos && (
              <p className="text-sm text-red-500 font-medium mt-2">
                ⚠️ Hay campos obligatorios sin completar, revisa por favor antes
                de continuar.
              </p>
            )}

            <div className="flex bg-gradient-to-r from-pink-200 via-rosadito to-pink-100 rounded-3xl shadow-2xl w-full max-w-4xl mx-auto overflow-hidden border border-pink-300">
              <div className="bg-white p-4 flex items-center justify-center flex-shrink-0 w-52 h-52 m-4">
                <img
                  src={form.photoURL || "https://via.placeholder.com/150"}
                  alt={form.nombre || "preview"}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="p-6 flex flex-col gap-4 text-sm text-gray-700 flex-1 overflow-hidden">
                <h3
                  className={`text-2xl font-extrabold ${
                    !form.nombre ? "text-red-500" : "text-negrito"
                  }`}
                >
                  {form.nombre || "Nombre pendiente"}
                </h3>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 border-b border-gray-300 pb-4">
                  <p>
                    <strong>Edad:</strong>{" "}
                    <span
                      className={!form.edad ? "text-red-500 font-semibold" : ""}
                    >
                      {form.edad || "—"}{" "}
                      {form.edadUnidad === "AÑOS"
                        ? "año(s)"
                        : form.edadUnidad === "MESES"
                        ? "mes(es)"
                        : ""}
                    </span>
                  </p>
                  <p>
                    <strong>Sexo:</strong>{" "}
                    <span
                      className={!form.sexo ? "text-red-500 font-semibold" : ""}
                    >
                      {form.sexo || "—"}
                    </span>
                  </p>
                  <p>
                    <strong>Tamaño:</strong>{" "}
                    <span
                      className={
                        !form.tamaño ? "text-red-500 font-semibold" : ""
                      }
                    >
                      {form.tamaño || "—"}
                    </span>
                  </p>
                  <p>
                    <strong>Refugio:</strong>{" "}
                    <span
                      className={
                        !form.shelterId ? "text-red-500 font-semibold" : ""
                      }
                    >
                      {shelters.find((s) => s.id === parseInt(form.shelterId))
                        ?.name || "—"}
                    </span>
                  </p>
                  <p>
                    <strong>Peso:</strong> {form.peso ? `${form.peso} kg` : "—"}
                  </p>
                  <p>
                    <strong>Especie:</strong>{" "}
                    <span
                      className={!form.tipo ? "text-red-500 font-semibold" : ""}
                    >
                      {species.find((s) => s.id_species === parseInt(form.tipo))
                        ?.name || "—"}
                    </span>
                  </p>
                  <p>
                    <strong>Raza:</strong>{" "}
                    {breeds.find((b) => b.id_breed === parseInt(form.raza))
                      ?.name || "—"}
                  </p>
                  <p>
                    <strong>Ingreso:</strong>{" "}
                    <span
                      className={
                        !form.entryDate ? "text-red-500 font-semibold" : ""
                      }
                    >
                      {form.entryDate || "—"}
                    </span>
                  </p>
                  <p>
                    <strong>Revisión:</strong>{" "}
                    <span
                      className={
                        !form.reviewDate ? "text-red-500 font-semibold" : ""
                      }
                    >
                      {form.reviewDate || "—"}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 border-b border-gray-300 pb-4 pt-2">
                  <p>
                    <strong>Esterilizado:</strong>{" "}
                    {form.esterilizado ? "✅ Sí" : "❌ No"}
                  </p>
                  <p>
                    <strong>Vacunado:</strong>{" "}
                    {form.vacunado ? "✅ Sí" : "❌ No"}
                  </p>
                  <p>
                    <strong>Desparasitado:</strong>{" "}
                    {form.desparasitado ? "✅ Sí" : "❌ No"}
                  </p>
                </div>

                <div className="space-y-2 border-b border-gray-300 pb-4">
                  <p>
                    <strong>Descripción:</strong>{" "}
                    <span
                      className={
                        !form.descripcion ? "text-red-500 font-semibold" : ""
                      }
                    >
                      {form.descripcion || "—"}
                    </span>
                  </p>
                  <p>
                    <strong>Historia de llegada:</strong>{" "}
                    <span
                      className={
                        !form.llegada ? "text-red-500 font-semibold" : ""
                      }
                    >
                      {form.llegada || "—"}
                    </span>
                  </p>
                </div>

                <div className="text-sm w-full">
                  <strong>Atributos seleccionados:</strong>
                  <ul className="mt-2 space-y-1 list-disc list-inside max-h-24 overflow-y-auto pr-2">
                    {form.petAttributeIds.length > 0 ? (
                      form.petAttributeIds.map((id) => {
                        const attr = _attributes.find(
                          (a) => a.id === parseInt(id)
                        );
                        return (
                          <li key={id}>
                            <span className="font-semibold">
                              {attr?.attributeName}
                            </span>{" "}
                            —{" "}
                            <span className="text-gray-600">
                              {attr?.attributeValue}
                            </span>
                          </li>
                        );
                      })
                    ) : (
                      <li className="text-gray-600">
                        No se seleccionaron atributos
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const stepLabels = [
    "Datos generales",
    "Características físicas",
    "Información médica",
    "Historia y atributos",
    "Vista previa",
  ];

  const StepIndicator = () => (
    <div className="flex justify-center gap-8 mb-6">
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="flex flex-col items-center">
          <div
            className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-200
          ${
            n <= step
              ? "bg-moradito text-white border-moradito shadow-lg"
              : "bg-white border-gray-300 text-gray-400"
          }`}
          >
            {n}
          </div>
          <span className="text-xs text-center mt-1 w-24 text-negrito">
            {stepLabels[n - 1]}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="w-full min-h-screen bg-amarillito flex items-center justify-center px-4 py-10"
      style={{ backgroundImage: `url(${fondito})`, backgroundSize: "cover" }}
    >
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-semibold text-negrito text-center w-full">
            Editar mascota
          </h3>
          <button
            onClick={() => setShowDeleteModal(true)}
            title="Eliminar mascota"
            className="ml-4 text-red-600 hover:text-red-800 transition"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={step === 5 ? handleSubmit : (e) => e.preventDefault()}
          className="bg-white rounded-3xl p-10 space-y-10 shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all"
        >
          <StepIndicator />
          {renderStep()}

          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={prev}
                className="px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer bg-gray-200 hover:bg-gray-300"
              >
                Atrás
              </button>
            )}
            {step < 4 && (
              <button
                type="button"
                onClick={next}
                className="px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer bg-gray-200 hover:bg-gray-300"
              >
                Siguiente
              </button>
            )}
            {step === 4 && (
              <button
                type="button"
                onClick={next}
                className="px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer bg-moradito text-white hover:bg-purple-300"
              >
                Visualizar cambios
              </button>
            )}
            {step === 5 && (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-full font-medium shadow-md transition-all duration-200 cursor-pointer text-white
                ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-azulito hover:bg-sky-600"
                }`}
              >
                {isSubmitting ? "Guardando cambios..." : "Guardar cambios"}
              </button>
            )}
          </div>
        </form>

        {showModal && (
          <PopUpForm
            type={modalType}
            message={
              modalType === "success"
                ? "Mascota actualizada con éxito"
                : "Hubo un problema al actualizar la mascota"
            }
            onClose={closeModal}
          />
        )}

        <ConfirmDelete
          visible={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          message="¿Estás seguro que deseas eliminar esta mascota?"
        />
      </div>
    </div>
  );
}
