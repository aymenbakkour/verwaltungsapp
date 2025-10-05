
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Doctor } from './types';
import DoctorTable from './components/DoctorTable';
import DoctorForm from './components/DoctorForm';
import Modal from './components/Modal';
import { AddIcon, ImportIcon, ExportIcon } from './components/icons';
// @ts-ignore
import * as XLSX from 'xlsx';

// Haupt-App-Komponente
const App: React.FC = () => {
  // Zustand für die Liste der Ärzte
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  // Zustand für den Suchbegriff
  const [searchTerm, setSearchTerm] = useState('');
  // Zustand für den Stadt-Filter
  const [stadtFilter, setStadtFilter] = useState('all');
  // Zustand für den Fachgebiet-Filter
  const [fachgebietFilter, setFachgebietFilter] = useState('all');
  // Zustand für die Sichtbarkeit des Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Zustand für den Arzt, der gerade bearbeitet wird
  const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lade Ärzte aus dem localStorage beim ersten Rendern
  useEffect(() => {
    try {
      const storedDoctors = localStorage.getItem('doctors');
      if (storedDoctors) {
        setDoctors(JSON.parse(storedDoctors));
      }
    } catch (error) {
      console.error("Fehler beim Laden der Ärzte aus dem localStorage:", error);
    }
  }, []);

  // Speichere Ärzte im localStorage, wenn sich die Liste ändert
  useEffect(() => {
    try {
        localStorage.setItem('doctors', JSON.stringify(doctors));
    } catch (error) {
        console.error("Fehler beim Speichern der Ärzte im localStorage:", error);
    }
  }, [doctors]);

  // Gefilterte Ärzte basierend auf Suche und Filtern
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const searchMatch = Object.values(doctor).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
      const stadtMatch = stadtFilter === 'all' || doctor.stadt === stadtFilter;
      const fachgebietMatch = fachgebietFilter === 'all' || doctor.fachgebiet === fachgebietFilter;
      return searchMatch && stadtMatch && fachgebietMatch;
    });
  }, [doctors, searchTerm, stadtFilter, fachgebietFilter]);

  // Eindeutige Städte und Fachgebiete für die Filter-Dropdowns
  const uniqueStädte = useMemo(() => ['all', ...new Set(doctors.map(d => d.stadt))], [doctors]);
  const uniqueFachgebiete = useMemo(() => ['all', ...new Set(doctors.map(d => d.fachgebiet))], [doctors]);

  // Funktion zum Hinzufügen eines neuen Arztes
  const handleAddDoctor = (doctor: Omit<Doctor, 'id'>) => {
    setDoctors(prev => [...prev, { ...doctor, id: crypto.randomUUID() }]);
  };
  
  // Funktion zum Aktualisieren eines Arztes
  const handleUpdateDoctor = (updatedDoctor: Doctor) => {
    setDoctors(prev => prev.map(d => d.id === updatedDoctor.id ? updatedDoctor : d));
  };
  
  // Funktion zum Löschen eines Arztes
  const handleDeleteDoctor = (id: string) => {
    if (window.confirm("Sind Sie sicher, dass Sie diesen Arzt löschen möchten?")) {
        setDoctors(prev => prev.filter(d => d.id !== id));
    }
  };

  // Öffnet das Modal zum Hinzufügen eines neuen Arztes
  const openAddModal = () => {
    setDoctorToEdit(null);
    setIsModalOpen(true);
  };
  
  // Öffnet das Modal zum Bearbeiten eines Arztes
  const openEditModal = (doctor: Doctor) => {
    setDoctorToEdit(doctor);
    setIsModalOpen(true);
  };

  // Funktion zum Importieren von Ärzten aus einer Excel-Datei
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json: Omit<Doctor, 'id'>[] = XLSX.utils.sheet_to_json(worksheet, {
                // Map German headers to English keys of Doctor interface
                header: ["name", "adresse", "telefon", "fachgebiet", "stadt"], 
                range: 1 // Skip header row in Excel
            });

            // Add new doctors with unique IDs
            const newDoctors: Doctor[] = json.map(doc => ({
                ...doc,
                id: crypto.randomUUID(),
            }));

            setDoctors(prev => [...prev, ...newDoctors]);
            alert(`${newDoctors.length} Ärzte erfolgreich importiert!`);
        } catch (error) {
            console.error("Fehler beim Importieren der Excel-Datei:", error);
            alert("Fehler beim Importieren der Datei. Stellen Sie sicher, dass die Spaltenüberschriften korrekt sind: Name, Adresse, Telefon, Fachgebiet, Stadt");
        }
    };
    reader.readAsBinaryString(file);
    // Reset file input to allow re-uploading the same file
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  // Funktion zum Exportieren der Ärzte in eine Excel-Datei
  const handleExport = useCallback(() => {
    const dataToExport = filteredDoctors.map(({ id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    
    // Set German headers
    const headers = ["Vollständiger Name", "Adresse", "Telefonnummer", "Fachgebiet", "Stadt"];
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ärzte");
    XLSX.writeFile(wb, "aerzte-export.xlsx");
  }, [filteredDoctors]);


  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">Ärzteverwaltung</h1>
          <p className="text-center text-lg text-gray-600 dark:text-gray-400 mt-2">Eine moderne Lösung zur Verwaltung Ihrer Ärzte-Kontakte</p>
        </header>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            {/* Aktionsleiste: Hinzufügen, Import, Export */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex gap-2">
                    <button onClick={openAddModal} className="flex items-center justify-center bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 transition duration-300">
                        <AddIcon /> Arzt hinzufügen
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImport} accept=".xlsx, .xls" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300">
                        <ImportIcon /> Importieren
                    </button>
                    <button onClick={handleExport} className="flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                        <ExportIcon /> Exportieren
                    </button>
                </div>
            </div>

            {/* Filter- und Suchleiste */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                type="text"
                placeholder="Suchen..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
                <select value={stadtFilter} onChange={e => setStadtFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                {uniqueStädte.map(stadt => <option key={stadt} value={stadt}>{stadt === 'all' ? 'Alle Städte' : stadt}</option>)}
                </select>
                <select value={fachgebietFilter} onChange={e => setFachgebietFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                {uniqueFachgebiete.map(fg => <option key={fg} value={fg}>{fg === 'all' ? 'Alle Fachgebiete' : fg}</option>)}
                </select>
            </div>
            
            {/* Tabelle der Ärzte */}
            <DoctorTable doctors={filteredDoctors} onEdit={openEditModal} onDelete={handleDeleteDoctor} />
        </div>

        {/* Modal für Hinzufügen/Bearbeiten */}
        <Modal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            title={doctorToEdit ? 'Arzt bearbeiten' : 'Neuen Arzt hinzufügen'}
        >
          <DoctorForm 
            onSave={handleAddDoctor} 
            onUpdate={handleUpdateDoctor} 
            onClose={() => setIsModalOpen(false)} 
            doctorToEdit={doctorToEdit} 
          />
        </Modal>
      </main>

      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        <p>Entworfen von Programmierer Ayman Bakkour</p>
      </footer>
    </div>
  );
};

export default App;
