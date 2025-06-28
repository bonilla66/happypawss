import React, { useState, useEffect } from "react";
import ModalAttribute from "../components/modalattribute";
import ModalShelter from "../components/modalshelter";
import PopUpForm from "../components/popupform";
import { Edit3, Trash2, Plus } from "lucide-react";
import ConfirmDelete from "../components/confirmdelete";
import ModalBreed from "../components/breedmodal";
import ModalSpecies from "../components/speciesmodal";
import api from "../services/api";
import { toast } from "react-toastify";
import CardTable from "../components/cardtable";
import fondito from "../assets/bannerHoriz.jpg";

export default function ShelterAttribute() {
  const [shelters, setShelters] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [species, setSpecies] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const LoadingRow = ({ colspan = 3, message = "Cargando datos..." }) => (
    <tr>
      <td
        colSpan={colspan}
        className="py-4 text-center text-grisito bg-amarillito italic"
      >
        {message}
      </td>
    </tr>
  );

  useEffect(() => {
    const isArray = (data) =>
      Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

    const fetchAll = async () => {
      try {
        setLoading(true);

        const [sheltersRes, attributesRes, speciesRes, breedsRes] =
          await Promise.all([
            api.get("/shelters/all"),
            api.get("/pet_attributes/all"),
            api.get("/species/all"),
            api.get("/breeds/all"),
          ]);

        // Logs para debug
        console.log("Shelters:", sheltersRes.data);
        console.log("Attributes:", attributesRes.data);
        console.log("Species:", speciesRes.data);
        console.log("Breeds:", breedsRes.data);

        const shelters = isArray(sheltersRes.data);
        const attributes = isArray(attributesRes.data);
        const speciesRaw = isArray(speciesRes.data);
        const breedsRaw = isArray(breedsRes.data);

        if (shelters.length) setShelters(shelters);
        else toast.error("Error al cargar refugios");

        if (attributes.length) setAttributes(attributes);
        else toast.error("Error al cargar atributos");

        if (speciesRaw.length) {
          const normalizedSpecies = speciesRaw.map((sp) => ({
            id: sp.id_species,
            name: sp.name,
          }));
          setSpecies(normalizedSpecies);
        } else {
          toast.error("Error al cargar especies");
        }

        if (breedsRaw.length) {
          const normalizedBreeds = breedsRaw.map((b) => ({
            id: b.id_breed,
            name: b.name,
            speciesId: b.speciesId,
          }));
          setBreeds(normalizedBreeds);
        } else {
          toast.error("Error al cargar razas");
        }
      } catch (err) {
        console.error("Error al cargar los datos del sistema", err);
        toast.error("Error general al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const [showShelterModal, setShowShelterModal] = useState(false);
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [showSpeciesModal, setShowSpeciesModal] = useState(false);
  const [showBreedModal, setShowBreedModal] = useState(false);

  const [editingShelter, setEditingShelter] = useState(null);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [editingSpecies, setEditingSpecies] = useState(null);
  const [editingBreed, setEditingBreed] = useState(null);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState("success");
  const [popupMessage, setPopupMessage] = useState("");

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleSaveShelter = async (data) => {
    try {
      if (editingShelter) {
        await api.put(`/shelters/${editingShelter.id}`, data);
      } else {
        await api.post("/shelters/register", data);
      }
      const res = await api.get("/shelters/all");
      setShelters(res.data);
      showSuccessPopup(
        editingShelter ? "Refugio actualizado" : "Refugio agregado"
      );
      setShowShelterModal(false);
      setEditingShelter(null);
    } catch (error) {
      console.error("Error al guardar refugio:", error);
      toast.error("No se pudo guardar el refugio");
    }
  };

  const handleSaveAttribute = async (data) => {
    try {
      if (editingAttribute) {
        await api.put(`/pet_attributes/update/${editingAttribute.id}`, data);
      } else {
        await api.post("/pet_attributes/register", data);
      }
      const res = await api.get("/pet_attributes/all");
      setAttributes(res.data);
      showSuccessPopup(
        editingAttribute ? "Atributo actualizado" : "Atributo agregado"
      );
      setShowAttributeModal(false);
      setEditingAttribute(null);
    } catch (error) {
      console.error("Error al guardar atributo:", error);
      toast.error("No se pudo guardar el atributo");
    }
  };

  const handleSaveSpecies = async (data) => {
    try {
      if (editingSpecies) {
        const resCheck = await api.get(`/species/related/${editingSpecies.id}`);
        if (resCheck.data.hasPets || resCheck.data.hasBreeds) {
          toast.error(
            "No se puede editar esta especie porque tiene mascotas o razas asociadas"
          );
          return;
        }

        await api.put(`/species/${editingSpecies.id}`, data);
      } else {
        await api.post("/species/register", data);
      }

      const res = await api.get("/species/all");
      setSpecies(res.data.map((sp) => ({ id: sp.id_species, name: sp.name })));
      showSuccessPopup(
        editingSpecies ? "Especie actualizada" : "Especie agregada"
      );
      setShowSpeciesModal(false);
      setEditingSpecies(null);
    } catch (error) {
      console.error("Error al guardar especie:", error);
      toast.error("No se pudo guardar la especie");
    }
  };

  const handleSaveBreed = async (data) => {
    try {
      if (editingBreed) {
        const resCheck = await api.get(`/breeds/related/${editingBreed.id}`);
        if (resCheck.data.hasPets) {
          toast.error(
            "No se puede editar esta raza porque tiene mascotas asociadas"
          );
          return;
        }

        await api.put(`/breeds/${editingBreed.id}`, data);
      } else {
        await api.post("/breeds/register", data);
      }

      const res = await api.get("/breeds/all");
      setBreeds(
        res.data.map((b) => ({
          id: b.id_breed,
          name: b.name,
          speciesId: b.speciesId,
        }))
      );
      showSuccessPopup(editingBreed ? "Raza actualizada" : "Raza agregada");
      setShowBreedModal(false);
      setEditingBreed(null);
    } catch (error) {
      console.error("Error al guardar raza:", error);
      toast.error("No se pudo guardar la raza");
    }
  };

  const showSuccessPopup = (msg) => {
    setPopupMessage(msg);
    setPopupType("success");
    setPopupVisible(true);
  };

  const confirmDelete = (id, type) => {
    setItemToDelete({ id, type });
    setConfirmVisible(true);
  };

  const cancelDelete = () => {
    setConfirmVisible(false);
    setItemToDelete(null);
  };

  const performDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      switch (itemToDelete.type) {
        case "shelter": {
          const resCheck = await api.get(
            `/shelters/related/${itemToDelete.id}`
          );
          if (resCheck.data.hasPets) {
            toast.error(
              "No se puede eliminar este refugio porque tiene mascotas asociadas"
            );
            cancelDelete();
            return;
          }

          await api.delete(`/shelters/${itemToDelete.id}`);
          const sheltersRes = await api.get("/shelters/all");
          setShelters(sheltersRes.data);
          setPopupMessage("Refugio eliminado con éxito");
          break;
        }

        case "attribute": {
          const resCheck = await api.get(
            `/pet_attributes/related/${itemToDelete.id}`
          );
          if (resCheck.data.hasPets) {
            toast.error(
              "No se puede eliminar este atributo porque está asociado a mascotas"
            );
            cancelDelete();
            return;
          }

          await api.delete(`/pet_attributes/delete/${itemToDelete.id}`);
          const attrRes = await api.get("/pet_attributes/all");
          setAttributes(attrRes.data);
          setPopupMessage("Atributo eliminado con éxito");
          break;
        }

        case "species": {
          const resCheck = await api.get(`/species/related/${itemToDelete.id}`);
          if (resCheck.data.hasPets || resCheck.data.hasBreeds) {
            toast.error(
              "No se puede eliminar esta especie porque tiene mascotas o razas asociadas"
            );
            cancelDelete();
            return;
          }

          await api.delete(`/species/${itemToDelete.id}`);
          const speciesRes = await api.get("/species/all");
          const normalizedSpecies = speciesRes.data.map((sp) => ({
            id: sp.id_species,
            name: sp.name,
          }));
          setSpecies(normalizedSpecies);
          setPopupMessage("Especie eliminada con éxito");
          break;
        }

        case "breed": {
          const resCheck = await api.get(`/breeds/related/${itemToDelete.id}`);
          if (resCheck.data.hasPets) {
            toast.error(
              "No se puede eliminar esta raza porque tiene mascotas asociadas"
            );
            cancelDelete();
            return;
          }

          await api.delete(`/breeds/${itemToDelete.id}`);
          const breedsRes = await api.get("/breeds/all");
          const normalizedBreeds = breedsRes.data.map((b) => ({
            id: b.id_breed,
            name: b.name,
            speciesId: b.speciesId,
          }));
          setBreeds(normalizedBreeds);
          setPopupMessage("Raza eliminada con éxito");
          break;
        }

        default:
          return;
      }
      setPopupType("success");
      setPopupVisible(true);
      setConfirmVisible(false);
      setItemToDelete(null);
    } catch (error) {
      console.error(
        "Error al eliminar:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "No se pudo eliminar el elemento"
      );
      setPopupType("error");
      setPopupMessage("Error al eliminar");
    } finally {
      setIsDeleting(false);
    }
  };

  const closePopup = () => setPopupVisible(false);

  return (
    <div
      className="h-full p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100"
      style={{ backgroundImage: `url(${fondito})` }}
    >
      <div className="flex flex-col gap-6 w-full">
        <CardTable
          title={`Refugios (${shelters.length})`}
          columns={["ID", "Nombre", "Acciones"]}
          data={shelters}
          loading={loading}
          loadingColspan={3}
          onAdd={() => {
            setEditingShelter(null);
            setShowShelterModal(true);
          }}
          onEdit={(shelter) => {
            setEditingShelter(shelter);
            setShowShelterModal(true);
          }}
          onDelete={(id) => confirmDelete(id, "shelter")}
          renderRow={(s) => (
            <tr key={s.id} className="border-b border-grisito last:border-0">
              <td className="py-2 text-center">{s.id}</td>
              <td className="py-2 text-center">{s.name}</td>
              <td className="py-2 flex gap-6 justify-center items-center">
                <Edit3
                  className="cursor-pointer text-azulito hover:scale-110 hover:text-azulito/80 transition duration-200"
                  size={20}
                  onClick={() => {
                    setEditingShelter(s);
                    setShowShelterModal(true);
                  }}
                />
                <Trash2
                  className="cursor-pointer text-red-500 hover:scale-110 hover:text-red-400 transition duration-200"
                  size={20}
                  onClick={() => confirmDelete(s.id, "shelter")}
                />
              </td>
            </tr>
          )}
          modalComponent={
            <ModalShelter
              show={showShelterModal}
              onClose={() => setShowShelterModal(false)}
              onSave={handleSaveShelter}
              initialData={editingShelter}
            />
          }
          showModal={showShelterModal}
          setShowModal={setShowShelterModal}
        />
      </div>

      <div className="flex flex-col gap-6 w-full">
        <CardTable
          title={`Atributos (${attributes.length})`}
          columns={["ID", "Nombre", "Valor", "Acciones"]}
          data={attributes}
          loading={loading}
          loadingColspan={4}
          onAdd={() => {
            setEditingAttribute(null);
            setShowAttributeModal(true);
          }}
          onEdit={(attr) => {
            setEditingAttribute(attr);
            setShowAttributeModal(true);
          }}
          onDelete={(id) => confirmDelete(id, "attribute")}
          renderRow={(a) => (
            <tr key={a.id} className="border-b border-grisito last:border-0">
              <td className="py-2 text-center">{a.id}</td>
              <td className="py-2 text-center">{a.attributeName}</td>
              <td className="py-2 text-center">{a.attributeValue}</td>
              <td className="py-2 flex gap-6 justify-center items-center">
                <Edit3
                  className="cursor-pointer text-azulito hover:scale-110 hover:text-azulito/80 transition duration-200"
                  size={20}
                  onClick={() => {
                    setEditingAttribute(a);
                    setShowAttributeModal(true);
                  }}
                />
                <Trash2
                  className="cursor-pointer text-red-500 hover:scale-110 hover:text-red-400 transition duration-200"
                  size={20}
                  onClick={() => confirmDelete(a.id, "attribute")}
                />
              </td>
            </tr>
          )}
          modalComponent={
            <ModalAttribute
              show={showAttributeModal}
              onClose={() => setShowAttributeModal(false)}
              onSave={handleSaveAttribute}
              initialData={editingAttribute}
            />
          }
          showModal={showAttributeModal}
          setShowModal={setShowAttributeModal}
        />
      </div>

      <div className="flex flex-col gap-6 w-full">
        <CardTable
          title={`Especies (${species.length})`}
          columns={["ID", "Nombre", "Acciones"]}
          data={species}
          loading={loading}
          loadingColspan={3}
          onAdd={() => {
            setEditingSpecies(null);
            setShowSpeciesModal(true);
          }}
          onEdit={(sp) => {
            setEditingSpecies(sp);
            setShowSpeciesModal(true);
          }}
          onDelete={(id) => confirmDelete(id, "species")}
          renderRow={(sp) => (
            <tr key={sp.id} className="border-b border-grisito last:border-0">
              <td className="py-2 text-center">{sp.id}</td>
              <td className="py-2 text-center">{sp.name}</td>
              <td className="py-2 flex gap-6 justify-center items-center">
                <Edit3
                  className="cursor-pointer text-azulito hover:scale-110 hover:text-azulito/80 transition duration-200"
                  size={20}
                  onClick={() => {
                    setEditingSpecies(sp);
                    setShowSpeciesModal(true);
                  }}
                />
                <Trash2
                  className="cursor-pointer text-red-500 hover:scale-110 hover:text-red-400 transition duration-200"
                  size={20}
                  onClick={() => confirmDelete(sp.id, "species")}
                />
              </td>
            </tr>
          )}
          modalComponent={
            <ModalSpecies
              show={showSpeciesModal}
              onClose={() => setShowSpeciesModal(false)}
              onSave={handleSaveSpecies}
              initialData={editingSpecies}
            />
          }
          showModal={showSpeciesModal}
          setShowModal={setShowSpeciesModal}
        />
      </div>

      <div className="flex flex-col gap-6 w-full">
        <CardTable
          title={`Razas (${breeds.length})`}
          columns={["ID", "Nombre", "ID Especie", "Acciones"]}
          data={breeds}
          loading={loading}
          loadingColspan={4}
          onAdd={() => {
            setEditingBreed(null);
            setShowBreedModal(true);
          }}
          onEdit={(b) => {
            setEditingBreed(b);
            setShowBreedModal(true);
          }}
          onDelete={(id) => confirmDelete(id, "breed")}
          renderRow={(b) => (
            <tr key={b.id} className="border-b border-grisito last:border-0">
              <td className="py-2 text-center">{b.id}</td>
              <td className="py-2 text-center">{b.name}</td>
              <td className="py-2 text-center">{b.speciesId}</td>
              <td className="py-2 flex gap-6 justify-center items-center">
                <Edit3
                  className="cursor-pointer text-azulito hover:scale-110 hover:text-azulito/80 transition duration-200"
                  size={20}
                  onClick={() => {
                    setEditingBreed(b);
                    setShowBreedModal(true);
                  }}
                />
                <Trash2
                  className="cursor-pointer text-red-500 hover:scale-110 hover:text-red-400 transition duration-200"
                  size={20}
                  onClick={() => confirmDelete(b.id, "breed")}
                />
              </td>
            </tr>
          )}
          modalComponent={
            <ModalBreed
              show={showBreedModal}
              onClose={() => setShowBreedModal(false)}
              onSave={handleSaveBreed}
              initialData={editingBreed}
              species={species}
            />
          }
          showModal={showBreedModal}
          setShowModal={setShowBreedModal}
        />
      </div>

      {popupVisible && (
        <PopUpForm
          type={popupType}
          message={popupMessage}
          onClose={closePopup}
        />
      )}
      <ConfirmDelete
        visible={confirmVisible}
        onConfirm={performDelete}
        onCancel={cancelDelete}
        message="¿Está seguro que desea eliminar este item?"
        isLoading={isDeleting}
      />
    </div>
  );
}
