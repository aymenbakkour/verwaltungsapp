
import React from 'react';
import type { Doctor, DoctorTableProps } from '../types';
import { EditIcon, DeleteIcon } from './icons';

const DoctorTable: React.FC<DoctorTableProps> = ({ doctors, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">Vollständiger Name</th>
            <th scope="col" className="py-3 px-6">Adresse</th>
            <th scope="col" className="py-3 px-6">Telefonnummer</th>
            <th scope="col" className="py-3 px-6">Fachgebiet</th>
            <th scope="col" className="py-3 px-6">Stadt</th>
            <th scope="col" className="py-3 px-6">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length > 0 ? doctors.map(doctor => (
            <tr key={doctor.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">{doctor.name}</td>
              <td className="py-4 px-6">{doctor.adresse}</td>
              <td className="py-4 px-6">{doctor.telefon}</td>
              <td className="py-4 px-6">{doctor.fachgebiet}</td>
              <td className="py-4 px-6">{doctor.stadt}</td>
              <td className="py-4 px-6 flex items-center space-x-3">
                <button onClick={() => onEdit(doctor)} className="text-primary-600 dark:text-primary-500 hover:underline">
                    <EditIcon />
                </button>
                <button onClick={() => onDelete(doctor.id)} className="text-red-600 dark:text-red-500 hover:underline">
                    <DeleteIcon />
                </button>
              </td>
            </tr>
          )) : (
            <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500 dark:text-gray-400">
                    Keine Ärzte gefunden. Fügen Sie einen neuen Arzt hinzu oder importieren Sie Daten.
                </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorTable;
