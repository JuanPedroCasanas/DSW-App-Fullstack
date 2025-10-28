import { useEffect, useMemo, useState } from 'react';
import { Toast } from '@/components/Toast';
import './moduleList.css';
import type { Module, Professional,  ConsultingRoom } from './moduleList.types';
import {
  handleConsultingRoomControllerResponse,
  handleModuleControllerResponse,
  handleProfessionalControllerResponse
} from './moduleListHandleResponses';

// para el nombre completo de profesional
const fullName = (p?: { firstName?: string; lastName?: string }) =>
  `${p?.firstName ?? ''} ${p?.lastName ?? ''}`.trim();

// todos los meses -> para pasarlo a una descripcion (en vez de numero)
const ALL_MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1));

const monthLabel = (m: string | number): string => {
  const idx = Number(m) - 1;
  if (Number.isNaN(idx) || idx < 0 || idx > 11) return '-';
  const name = new Date(2000, idx, 1).toLocaleString('es-AR', { month: 'long' });
  return name.charAt(0).toUpperCase() + name.slice(1);
};


export default function ModuleList() {

  const [modules, setModules] = useState<Module[]>([]);
  const [consultingRooms, setConsultingRooms] = useState<ConsultingRoom[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  //const [moduleTypes, setModuleTypes] = useState<ModuleType[]>([]);


  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Filtros
  const [filters, setFilters] = useState<{
    professionalId: string;
    moduleTypeId: string;
    month: string;
    consultingRoomId: string;
  }>({
    professionalId: '',
    moduleTypeId: '',
    month: '',
    consultingRoomId: '',
  });

  const handleFilterChange = (
    field: 'professionalId' | 'moduleTypeId' | 'month' | 'consultingRoomId',
    value: string
  ) => setFilters((prev) => ({ ...prev, [field]: value }));

  const clearFilters = () => {
    setFilters({
      professionalId: '',
      moduleTypeId: '',
      month: '',
      consultingRoomId: '',
    });
  };

  const getModules = async (): Promise<Module[] | undefined> => {
    const res = await fetch('http://localhost:2000/Module/getAll');
    if (!res.ok) {
      const toastData = await handleModuleControllerResponse(res);
      setToast(toastData);
      return;
    }
    const data: Module[] = await res.json();
    return Array.isArray(data) ? (data as Module[]).filter((m) => m?.id != null) : [];
  };

  const getProfessionals = async (): Promise<Professional[] | undefined> => {
    const res = await fetch('http://localhost:2000/Professional/getAll');
    if (!res.ok) {
      const toastData = await handleProfessionalControllerResponse(res);
      setToast(toastData);
      return;
    }
    const data: Professional[] = await res.json();
    return Array.isArray(data) ? (data as Professional[]).filter((pr) => pr?.id != null) : [];
  };

  const getConsultingRooms = async (): Promise<ConsultingRoom[] | undefined> => {
    const res = await fetch('http://localhost:2000/ConsultingRoom/getAll');
    if (!res.ok) {
      const toastData = await handleConsultingRoomControllerResponse(res);
      setToast(toastData);
      return;
    }
    const data: ConsultingRoom[] = await res.json();
    return Array.isArray(data) ? (data as ConsultingRoom[]).filter((c) => c?.id != null) : [];
  };

    // ESTE NO ANDA ME DI CUENTA QUE NO TIENE CONTROLADOR NI RUTAS...
  /*const getModuleTypes = async (): Promise<ModuleType[] | undefined> => {
    const res = await fetch('http://localhost:2000/ModuleType/getAll');
    if (!res.ok) {
      const toastData = await handleModuleTypeControllerResponse(res);
      setToast(toastData);
      return;
    }
    const data: ModuleType[] = await res.json();
    return Array.isArray(data) ? (data as ModuleType[]).filter((t) => t?.id != null) : [];
  }; */

  const loadData = async () => {
    setLoading(true);
    try {
      const mods = await getModules(); 
      const crooms = await getConsultingRooms();
      const profs = await getProfessionals();
      //const mtypes = await getModuleTypes();

      if (!mods || !crooms || !profs){
        return;
      }

      if (mods) setModules(mods);
      if (crooms) setConsultingRooms(crooms);
      if (profs) setProfessionals(profs);

      //if (mtypes) setModuleTypes(mtypes);
      
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // para traer los tipos d emodulos de los modulos... para no hacer un get
  const derivedModuleTypes = useMemo(
    () => Array.from(
        new Map(
          modules
            .filter(m => m.moduleType?.id != null)
            .map(m => {
              const id = String(m.moduleType!.id);
              return [id, m.moduleType?.name ?? `Tipo ${id}`] as const;
            })
        ),
        ([id, name]) => ({ id, name })
      ).sort((a, b) => a.name.localeCompare(b.name, 'es')),
    [modules]
  );

  // filtros
  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      const matchProfessional =
        !filters.professionalId || String(m.professional?.id) === filters.professionalId;

      const matchType =
        !filters.moduleTypeId || String(m.moduleType?.id) === filters.moduleTypeId;

    
      const moduleMonth = String(Number(m.validMonth));
      const matchMonth = !filters.month || moduleMonth === filters.month;

      const matchConsultingRoom =
        !filters.consultingRoomId || String(m.consultingRoom?.id ?? '') === filters.consultingRoomId;

      return matchProfessional && matchType && matchMonth && matchConsultingRoom;
    });
  }, [modules, filters]);

// para traer la descripcion en vez de la id de consultorio
  const resolveRoomDescription = (m: Module): string => {
    const id = m.consultingRoom?.id != null ? String(m.consultingRoom.id) : '';
    if (!id) return '-';
    if (m.consultingRoom?.description) return m.consultingRoom.description;
    const found = consultingRooms.find((r) => String(r.id) === id);
    return found?.description ?? '-';
  };


  return (
    <section className="module-list-container">
      <h1>Listado de módulos</h1>

      {/* Filtros */}
      <div className="filtros" aria-label="Filtros de módulos">

        {/* Profesional */}
        <label htmlFor="filter-professional">Profesional:</label>
        <select
          id="filter-professional"
          value={filters.professionalId}
          onChange={(e) => handleFilterChange('professionalId', e.target.value)}
          aria-label="Profesionales"
          title="Profesionales"
        >
          <option value="">Todos</option>
          {professionals.map((pr) => (
            <option key={`${pr.id}`} value={String(pr.id)}>
              {fullName(pr)}
            </option>
          ))}
        </select>

        {/* Tipo de módulo */}
        <label htmlFor="filter-module-type">Tipo de módulo:</label>
        <select
          id="filter-module-type"
          value={filters.moduleTypeId}
          onChange={(e) => handleFilterChange('moduleTypeId', e.target.value)}
          aria-label="Tipos de módulo"
          title="Tipos de módulo"
        >
          {/* Mes */} 
        <option value="">Todos</option>
          {derivedModuleTypes.map((t) => (
            <option key={`type-${t.id}`} value={String(t.id)}>
              {t.name}
            </option>
          ))} 
        </select>

        {/* Mes */}
        <label htmlFor="filter-month">Mes:</label>
        <select
          id="filter-month"
          value={filters.month}
          onChange={(e) => handleFilterChange('month', e.target.value)}
          aria-label="Mes"
          title="Mes"
        >
          <option value="">Todos</option>
          {ALL_MONTHS.map((m) => (
            <option key={`month-${m}`} value={m}>
              {monthLabel(m)}
            </option>
          ))}
        </select>

        {/* Consultorio */}
        <label htmlFor="filter-room">Consultorio:</label>
        <select
          id="filter-room"
          value={filters.consultingRoomId}
          onChange={(e) => handleFilterChange('consultingRoomId', e.target.value)}
          aria-label="Consultorios"
          title="Consultorios"
        >
          <option value="">Todos</option>
          {consultingRooms.map((c) => (
            <option key={`room-${c.id}`} value={String(c.id)}>
              {c.description}
            </option>
          ))}
        </select>

        <button type="button" className="btn" onClick={clearFilters} aria-label="Limpiar filtros">
          Limpiar filtros
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <p>Cargando módulos...</p>
      ) : (
        <table className="module-table" role="table">
          <thead>
            <tr>
              <th>Profesional</th>
              <th>Tipo de módulo</th>
              <th>Mes</th>
              <th>Consultorio</th>
            </tr>
          </thead>
          <tbody>
            {filteredModules.map((m) => (
              <tr key={m.id}>
                <td>{fullName(m.professional)}</td>
                <td>{m.moduleType?.name}</td>
                <td>{monthLabel(String(Number(m.validMonth)))}</td>
                <td>{resolveRoomDescription(m)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </section>
  );
}