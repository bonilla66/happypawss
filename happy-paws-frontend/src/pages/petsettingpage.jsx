import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PopUpForm from "../components/popupform.jsx";
import ClickPopup from "../components/clickpopup.jsx";
import useWizard from "../hooks/useWizard.js";

export default function PetDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { step, next, prev } = useWizard(2);
    const [form, setForm] = useState({
        photo: null,
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
        disponible: true,
    });
    const [preview, setPreview] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("success");
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const pet = {
            nombre: "Luna",
            edad: "2",
            edadUnidad: "Años",
            raza: "Husky",
            sexo: "Hembra",
            tamaño: "Mediano",
            tipo: "Perro",
            descripcion: "Muy activa y amigable",
            esterilizado: true,
            desparasitado: true,
            vacunado: true,
            llegada: "lalalalllaa",
            disponible: true,
        };
        setForm(pet);
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm((f) => ({ ...f, photo: file }));
        setPreview(URL.createObjectURL(file));
    };

    useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.nombre || !form.edad) {
            setModalType("error");
        } else {
            setModalType("success");
        }
        setShowModal(true);
    };

    const handleDeleteClick = () => setShowConfirm(true);
    const closeConfirm = () => setShowConfirm(false);
    const handleConfirmDelete = () => {
        setShowConfirm(false);
        toast.success("Mascota eliminada con éxito", {
            //aqui navegamos despues de la confirmacion de toast, se mira bonis
            onClose: () => navigate(-1)
        });
    };

    const closeModal = () => {
        setShowModal(false);
        if (modalType === "success") navigate(-1);
    };

    return (
        <div className="min-h-screen bg-amarillito py-6">
            <h2 className="text-xl font-semibold text-negrito ml-3">Editar mascota</h2>
            <div className="max-w-3xl mx-auto bg-blanquito rounded-2xl shadow-lg overflow-hidden">
                <div className="flex justify-between items-center px-6 py-3">
                    <button
                        onClick={handleDeleteClick}
                        className="text-rojo hover:text-rojo/80 cursor-pointer">
                        <Trash2 size={24} />
                    </button>
                </div>
                <form
                    onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()}
                    className="grid md:grid-cols-[200px,1fr] gap-6 px-6 py-4">
                    <div className="flex flex-col items-center">
                        <div className="w-28 h-28 bg-grisito rounded-xl overflow-hidden border border-grisito mb-2 shadow-inner">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-grisito">
                                    <ImageIcon size={48} />
                                </div>
                            )}
                        </div>
                        <label className="px-4 py-1 bg-grisito text-negrito rounded-full cursor-pointer hover:bg-grisito/80 transition">
                            Cambiar Foto
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFile}
                                className="hidden" />
                        </label>
                    </div>
                    <div className="space-y-4">
                        {step === 1 ? (
                            <>
                                <h4 className="text-lg font-medium text-negrito">Datos básicos</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { label: "Nombre", name: "nombre", required: true },
                                        { label: "Edad", name: "edad", required: true },
                                        { label: "Raza", name: "raza" },
                                        {
                                            label: "Sexo",
                                            name: "sexo",
                                            type: "select",
                                            options: ["", "Macho", "Hembra"],
                                        },
                                        {
                                            label: "Tamaño",
                                            name: "tamaño",
                                            type: "select",
                                            options: ["Pequeño", "Mediano", "Grande"],
                                        },
                                        { label: "Tipo", name: "tipo" },
                                    ].map((fld) => (
                                        <div key={fld.name}>
                                            <label className="block text-sm font-medium text-grisito mb-1">
                                                {fld.label}
                                            </label>
                                            {fld.name === "edad" ? (
                                                <div className="flex gap-2">
                                                    <input
                                                        name="edad"
                                                        value={form.edad}
                                                        onChange={handleChange}
                                                        className="flex-1 px-2 py-1 border border-grisito rounded focus:outline-none"
                                                        required />
                                                    <select
                                                        name="edadUnidad"
                                                        value={form.edadUnidad}
                                                        onChange={handleChange}
                                                        className="w-24 px-2 py-1 border border-grisito rounded focus:outline-none">
                                                        <option value="">Unidad</option>
                                                        <option value="Meses">Meses</option>
                                                        <option value="Años">Años</option>
                                                    </select>
                                                </div>
                                            ) : fld.type === "select" ? (
                                                <select
                                                    name={fld.name}
                                                    value={form[fld.name]}
                                                    onChange={handleChange}
                                                    className="w-full px-2 py-1 border border-grisito rounded focus:outline-none">
                                                    {fld.options.map((opt) => (
                                                        <option key={opt} value={opt}>
                                                            {opt || "Selecciona"}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    name={fld.name}
                                                    value={form[fld.name]}
                                                    onChange={handleChange}
                                                    className="w-full px-2 py-1 border border-grisito rounded focus:outline-none"
                                                    required={fld.required}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-grisito mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        name="descripcion"
                                        value={form.descripcion}
                                        onChange={handleChange}
                                        rows={2}
                                        className="w-full px-2 py-1 border border-grisito rounded focus:outline-none" />
                                </div>
                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={next}
                                        className="px-4 py-1 bg-grisito text-negrito rounded-full hover:bg-grisito/80 transition">
                                        Siguiente
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h4 className="text-lg font-medium text-negrito">Historial Médico</h4>
                                <div className="space-y-2">
                                    {[

                                        { label: "Esterilizado", name: "esterilizado" },
                                        { label: "Desparasitado", name: "desparasitado" },
                                        { label: "Vacunado", name: "vacunado" },

                                    ].map((fld) => (
                                        <div key={fld.name} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name={fld.name}
                                                checked={form[fld.name]}
                                                onChange={handleChange}
                                                className="form-checkbox h-4 w-4 text-moradito"
                                            />
                                            <label className="ml-2 text-sm text-grisito">{fld.label}</label>
                                        </div>
                                    ))}
                                    <div>
                                        <label className="block text-sm font-medium text-grisito mb-1">
                                            Llegada al refugio
                                        </label>
                                        <textarea
                                            name="llegada"
                                            value={form.llegada}
                                            onChange={handleChange}
                                            rows={1}
                                            className="w-full px-2 py-1 border border-grisito rounded focus:outline-none" />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="disponible"
                                            checked={form.disponible}
                                            onChange={handleChange}
                                            className="form-checkbox h-4 w-4 text-moradito" />
                                        <label className="ml-2 text-sm text-grisito">Disponible</label>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={prev}
                                        className="px-4 py-1 bg-grisito text-negrito rounded-full hover:bg-grisito/80 transition">
                                        Atrás
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-1 bg-moradito text-negrito rounded-full hover:bg-moradito/90 transition">
                                        Guardar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </form>
                {showModal && (
                    <PopUpForm
                        type={modalType}
                        message={
                            modalType === "success"
                                ? "Mascota actualizada con éxito"
                                : "Error al actualizar"
                        }
                        onClose={closeModal} />
                )}
                {showConfirm && (
                    <ClickPopup
                        message="¿Estás seguro que quieres eliminar esta mascota?"
                        onConfirm={handleConfirmDelete}
                        onCancel={closeConfirm} />
                )}
            </div>
        </div>
    );
}
