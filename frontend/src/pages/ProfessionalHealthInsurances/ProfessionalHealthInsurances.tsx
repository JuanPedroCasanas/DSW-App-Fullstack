import { useState, useEffect } from 'react';
import './ProfessionalHealthInsurance.css';
import { Professional } from '../AppointmentSchedule/appointmentSchedule.types';

async function handleResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));

  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.professional?.id}, Apellido y nombre: ${resJson.professional?.lastName} ${resJson.professional?.firstName}`;
    return { message: successMessage, type: "success" };
  } else {
    if (res.status === 500 || res.status === 400) {
      return { message: resJson.message ?? "Error interno del servidor", type: "error" };
    } else {
      const errorMessage = `Error: ${resJson.error} Codigo: ${resJson.code} ${resJson.message}`
      return { message: errorMessage.trim(), type: "error" };
    }
  }
}


export default function ProfessionalHealthInsurances() {
  const [filtros, setFiltros] = useState({
    paciente: '',
    obraSocial: '',
    fecha: '',
  });
  const [list, setList] = useState<Professional[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  useEffect(() => {(async () => {
   
         const res = await fetch("http://localhost:2000/Professional/getProfessionalsByHealthInsurance");
  
        if (!res.ok){
          const toastData = await handleResponse(res);
          setToast(toastData);
        } else {
          const data: Professional[] = await res.json();
          const processedData = data.map(professional => ({
          id: professional.id,
          nombre: professional.firstName,
          apellido: professional.lastName,
          ocupacion: professional.occupation,
          healthInsurances: professional.healthInsurances
        }));
        setList(processedData);

        }
  
     })()
   }, []); 
  
  

  
    return (
    <h1>Listado de obras sociales admitidas por el profesional</h1>
    
    
  );
} 
