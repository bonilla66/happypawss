import React from 'react'
import { ArrowRight, Edit3 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function PetCard({ id, image, name, description }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const canEdit = user?.rol === 'ADMIN' || user?.rol === 'COLABORADOR'

  return (
    <div className="relative flex flex-col sm:flex-row bg-rosadito rounded-3xl max-w-md w-full h-auto sm:h-52 mx-auto overflow-hidden hover:-translate-y-1 transition-transform duration-200 shadow-lg">
      {canEdit && (
        <button
          aria-label="Editar mascota"
          onClick={() =>
            navigate('/editpet', {
              state: { id, image, name, description },
            })
          }
          className="absolute top-2 right-2 p-2 rounded-full bg-amarillito hover:bg-yellow-100 transition-colors duration-200 cursor-pointer z-10"
        >
          <Edit3 size={18} className="text-negrito" />
        </button>
      )}
      <div className="w-full sm:w-44 h-48 sm:h-full flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 sm:p-6 flex flex-col flex-1 min-w-0">
        <h3 className="text-xl sm:text-2xl font-bold text-negrito mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
          {name}
        </h3>
        <p className="text-sm text-negrito flex-1 overflow-hidden line-clamp-3 sm:line-clamp-4">
          {description || 'Descripción no disponible'}
        </p>
        <div className="mt-4 text-center sm:text-left">
          <Link
            to={`/mascotas/${id}`}
            state={{ id, image, name, description }}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-azulito text-blanquito font-medium rounded-full hover:bg-blue-300 transition-colors duration-200 w-full sm:w-auto"
          >
            <span>Ver más</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}