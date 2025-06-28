import { Plus, Edit3, Trash2 } from "lucide-react";

export default function CardTable({
  title,
  columns,
  data,
  loading,
  loadingColspan,
  onAdd,
  renderRow,
  modalComponent,
}) {
  return (
<div className="flex flex-col bg-amarillito rounded-2xl p-4 h-full shadow-md hover:shadow-lg transition-shadow mt-10">
      <div className="flex justify-between items-center mb-2">
<h2 className="text-xl font-bold text-azulito text-center w-full">{title}</h2>
        <button
          className=" text-black hover:bg-purple-200 hover:text-white w-10 h-10 flex items-center justify-center rounded-full transition-all cursor-pointer"
          onClick={onAdd}
          aria-label={`Agregar ${title}`}
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table className="table-auto w-full text-sm">
          <thead>
            <tr className="sticky top-0 bg-amarillito text-negrito border-b border-grisito">
              {columns.map((col, i) => (
                <th key={i} className="py-2 text-center">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={loadingColspan}
                  className="py-4 text-center text-grisito italic"
                >
                  Cargando datos...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={loadingColspan}
                  className="py-4 text-center text-grisito italic"
                >
                  Sin resultados
                </td>
              </tr>
            ) : (
              data.map(renderRow)
            )}
          </tbody>
        </table>
      </div>
      {modalComponent && modalComponent}
    </div>
  );
}
