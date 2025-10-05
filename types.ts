
// Definiert die Struktur für ein Arzt-Objekt
export interface Doctor {
  id: string;
  name: string;
  adresse: string;
  telefon: string;
  fachgebiet: string;
  stadt: string;
}

// Definiert die Props für die DoctorForm Komponente
export interface DoctorFormProps {
  onSave: (doctor: Omit<Doctor, 'id'>) => void;
  onUpdate: (doctor: Doctor) => void;
  onClose: () => void;
  doctorToEdit: Doctor | null;
}

// Definiert die Props für die DoctorTable Komponente
export interface DoctorTableProps {
    doctors: Doctor[];
    onEdit: (doctor: Doctor) => void;
    onDelete: (id: string) => void;
}

// Definiert die Props für die Modal Komponente
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}
