import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PopUpForm from "../components/popupform.jsx";
import useWizard from "../hooks/useWizard.js";
import api from "../services/api.js";
import { PawPrint, Ruler, Stethoscope, Eye, BookText } from "lucide-react";
import fondito from "../assets/bannerHoriz.jpg";
import { uploadImage } from "../services/ImageService";

export default function AddPetForm() {
  const navigate = useNavigate();
  const { step, next, prev } = useWizard(5);
  const [form, setForm] = useState({
    photoFile: null,
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

  const [imageData, setImageData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [species, setSpecies] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [_attributes, setAttributes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [speciesRes, _sizesRes, gendersRes, sheltersRes, attributesRes] =
          await Promise.all([
            api.get("/species/all"),
            api.get("/enums/sizes"),
            api.get("/enums/genders"),
            api.get("/shelters/all"),
            api.get("/pet_attributes/all"),
          ]);

        setSpecies(speciesRes.data);
        setSizes([
          { label: "Pequeño", value: 1 },
          { label: "Mediano", value: 2 },
          { label: "Grande", value: 3 },
        ]);

        setGenders(gendersRes.data);
        setShelters(sheltersRes.data);
        setAttributes(attributesRes.data);
      } catch (error) {
        console.error("Error cargando datos del formulario:", error);
      }
    };
    fetchData();

    setForm((prevForm) => ({
      ...prevForm,
      entryDate: new Date().toISOString().split("T")[0],
    }));
  }, []);

  useEffect(() => {
    const fetchBreedsBySpecies = async () => {
      if (!form.tipo) {
        setBreeds([]);
        return;
      }
      try {
        const res = await api.get(`/breeds/byspecie/${form.tipo}`);
        setBreeds(res.data);
      } catch (error) {
        console.error("Error al cargar razas:", error);
      }
    };
    fetchBreedsBySpecies();
  }, [form.tipo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.nombre ||
      !form.edad ||
      !form.edadUnidad ||
      !form.sexo ||
      !form.tamaño ||
      !form.tipo ||
      !form.descripcion ||
      !form.llegada ||
      !form.entryDate ||
      !form.reviewDate ||
      !form.shelterId
    ) {
      setModalType("error");
      setShowModal(true);
      return;
    }

    setIsSubmitting(true);

    let uploadResult = null;

    if (form.photoFile) {
      try {
        uploadResult = await uploadImage(form.photoFile);
        console.log("Imagen subida:", uploadResult);
        setImageData(uploadResult);
      } catch (err) {
        console.error("Error al subir la imagen:", err);
        setModalType("error");
        setShowModal(true);
        setIsSubmitting(false);
        return;
      }
    }

    const payload = {
      name: form.nombre,
      ageValue: parseInt(form.edad),
      ageUnit: form.edadUnidad,
      gender: form.sexo,
      weight: parseFloat(form.peso),
      sterilized: form.esterilizado,
      parasiteFree: form.desparasitado,
      fullyVaccinated: form.vacunado,
      entryDate: form.entryDate,
      reviewDate: form.reviewDate,
      description: form.descripcion,
      history: form.llegada,
      imageId: uploadResult?.id || null,
      shelterId: parseInt(form.shelterId),
      speciesId: parseInt(form.tipo),
      sizeId: parseInt(form.tamaño),
      breedId: form.raza ? parseInt(form.raza) : null,
      petAttributeIds: form.petAttributeIds.map((id) => parseInt(id)),
    };

    try {
      await api.post("/pets/register", payload);
      setModalType("success");
    } catch (error) {
      setModalType("error");
      console.log("Error en creación:", error.response?.data || error.message);
    }
    setIsSubmitting(false);

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    if (modalType === "success") navigate(-1);
  };

  const inputStyle =
    "mt-1 block w-full rounded-full border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-moradito focus:border-transparent transition";

  const stepLabels = [
    "Datos generales",
    "Características físicas",
    "Información médica",
    "Historia y atributos",
    "Vista previa",
  ];

  const StepIndicator = () => (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="flex flex-col items-center">
          <div
            className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-200
            ${n <= step
                ? "bg-moradito text-white border-moradito shadow-lg"
                : "bg-white border-gray-300 text-gray-400"
              }`}
          >
            {n}
          </div>
          <span className="text-xs text-center mt-1 w-20 sm:w-24 text-negrito">
            {stepLabels[n - 1]}
          </span>
        </div>
      ))}
    </div>
  );

  const faltanCampos =
    !form.nombre ||
    !form.edad ||
    !form.sexo ||
    !form.shelterId ||
    !form.tipo ||
    !form.raza;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
              <h4 className="text-lg font-bold text-moradito flex items-center gap-2">
                <PawPrint className="w-5 h-5" /> Datos generales
              </h4>
              <p className="text-sm text-gray-500">
                Datos obligatorios{" "}
                <span className="text-red-600 font-bold text-m">*</span>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-negrito mb-1">
                  Foto de la mascota{" "}
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      photoFile: e.target.files[0],
                    }))
                  }
                  className={inputStyle}
                />
                {form.photoFile && (
                  <img
                    src={URL.createObjectURL(form.photoFile)}
                    alt="preview"
                    className="w-32 h-32 mt-4 rounded-xl object-cover border border-grisito shadow"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-negrito mb-1">
                  Nombre{" "}
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
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2">
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
                <div className="w-full sm:w-1/2">
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
                  Peso (kg){" "}
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
              <h4 className="text-lg font-bold text-moradito flex items-center gap-2">
                <Ruler className="w-5 h-5" /> Características físicas
              </h4>
              <p className="text-sm text-gray-500">
                Datos obligatorios{" "}
                <span className="text-red-600 font-bold">*</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
              <h4 className="text-lg font-bold text-moradito flex items-center gap-2">
                <Stethoscope className="w-5 h-5" /> Información médica
              </h4>
              <p className="text-sm text-gray-500">
                Datos obligatorios{" "}
                <span className="text-red-600 font-bold">*</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Marca solo las casillas que apliquen:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
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
            <div className="mt-4">
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

            <div className="flex flex-col md:flex-row bg-gradient-to-r from-pink-200 via-rosadito to-pink-100 rounded-3xl shadow-2xl w-full overflow-hidden border border-pink-300">
              <div className="bg-white p-4 flex items-center justify-center w-full md:w-52 h-52 md:h-auto m-4 md:m-0 md:my-4 md:ml-4">
                <img
                  src={
                    imageData?.imgURL ||
                    (form.photoFile && URL.createObjectURL(form.photoFile)) ||
                    "https://dummyimage.com/150x150/cccccc/ffffff&text=Sin+imagen"
                  }
                  alt={form.nombre || "preview"}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="p-4 md:p-6 flex flex-col gap-3 md:gap-4 text-sm text-gray-700 flex-1 overflow-hidden">
                <h3
                  className={`text-xl md:text-2xl font-extrabold ${!form.nombre ? "text-red-500" : "text-negrito"
                    }`}
                >
                  {form.nombre || "Nombre pendiente"}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 border-b border-gray-300 pb-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-300 pb-4 pt-2">
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

  return (
    <div
      className="w-full min-h-screen bg-amarillito flex items-center justify-center px-4 py-10"
      style={{ backgroundImage: `url(${fondito})`, backgroundSize: "cover" }}
    >
      <div className="w-full max-w-5xl mx-4">
        <h3 className="text-2xl sm:text-3xl font-semibold text-negrito text-center mb-6">
          Formulario de la mascota
        </h3>

        <form
          onSubmit={step === 5 ? handleSubmit : (e) => e.preventDefault()}
          className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 space-y-8 md:space-y-10 shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all"
        >
          <StepIndicator />
          {renderStep()}

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prev}
                className="px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer bg-gray-200 hover:bg-gray-300 order-2 sm:order-1"
              >
                Atrás
              </button>
            )}
            {step < 4 && (
              <button
                type="button"
                onClick={next}
                className="px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer bg-gray-200 hover:bg-gray-300 order-1 sm:order-2"
              >
                Siguiente
              </button>
            )}
            {step === 4 && (
              <button
                type="button"
                onClick={next}
                className="px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer bg-moradito text-white hover:bg-purple-300 order-1 sm:order-2"
              >
                Visualizar mascota
              </button>
            )}
            {step === 5 && (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-full font-medium shadow-md transition-all duration-200 cursor-pointer text-white
                  ${isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-azulito hover:bg-sky-600"
                  } order-1 sm:order-2 w-full sm:w-auto`}
              >
                {isSubmitting ? "Agregando mascota..." : "Crear mascota"}
              </button>
            )}
          </div>
        </form>

        {showModal && (
          <PopUpForm
            type={modalType}
            message={
              modalType === "success"
                ? "Mascota agregada con éxito"
                : "Hubo un problema al agregar la mascota"
            }
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
}