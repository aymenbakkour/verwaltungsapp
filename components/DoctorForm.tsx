
import React, { useState, useEffect } from 'react';
import type { Doctor, DoctorFormProps } from '../types';

const DoctorForm: React.FC<DoctorFormProps> = ({ onSave, onUpdate, onClose, doctorToEdit }) => {
  const [doctor, setDoctor] = useState({
    name: '',
    adresse: '',
    telefon: '',
    fachgebiet: '',
    stadt: ''
  });

  useEffect(() => {
    if (doctorToEdit) {
      setDoctor(doctorToEdit);
    } else {
      setDoctor({ name: '', adresse: '', telefon: '', fachgebiet: '', stadt: '' });
    }
  }, [doctorToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDoctor(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (doctorToEdit) {
      onUpdate({ ...doctorToEdit, ...doctor });
    } else {
      onSave(doctor);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Vollständiger Name</label>
        <input type="text" name="name" id="name" value={doctor.name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
      </div>
      <div>
        <label htmlFor="adresse" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Adresse</label>
        <input type="text" name="adresse" id="adresse" value={doctor.adresse} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
      </div>
      <div>
        <label htmlFor="telefon" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Telefonnummer</label>
        <input type="text" name="telefon" id="telefon" value={doctor.telefon} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
      </div>
      <div>
        <label htmlFor="fachgebiet" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Fachgebiet</label>
        <input type="text" name="fachgebiet" id="fachgebiet" value={doctor.fachgebiet} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
      </div>
      <div>
        <label htmlFor="stadt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Stadt</label>
        <input type="text" name="stadt" id="stadt" value={doctor.stadt} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onClose} className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
          Abbrechen
        </button>
        <button type="submit" className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
          {doctorToEdit ? 'Änderungen speichern' : 'Arzt hinzufügen'}
        </button>
      </div>
    </form>
  );
};

export default DoctorForm;
