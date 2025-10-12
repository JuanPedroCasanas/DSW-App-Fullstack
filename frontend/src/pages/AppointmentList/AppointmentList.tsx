import { useState } from 'react';
import './appointmentList.css';


// hardcodeados como ejemplo
const turnosMock = [
  {
    id: 't1',
    paciente: { nombre: 'Ana', apellido: 'López', obraSocial: 'OSDE' },
    fecha: '2025-10-14',
    hora: '10:00',
    estado: 'disponible',
  },
  {
    id: 't2',
    paciente: { nombre: 'Carlos', apellido: 'Pérez', obraSocial: 'Swiss Medical' },
    fecha: '2025-10-14',
    hora: '11:00',
    estado: 'disponible',
  },
  {
    id: 't3',
    paciente: { nombre: 'Lucía', apellido: 'Gómez', obraSocial: 'OSDE' },
    fecha: '2025-10-15',
    hora: '09:30',
    estado: 'ocupado',
  },
];

export default function AppointmentList() {
  const [filtros, setFiltros] = useState({
    paciente: '',
    obraSocial: '',
    fecha: '',
  });

  // esto es parte del hardcodeado, hay que borrarlo (creo)
  const pacientesUnicos = Array.from(
    new Set(turnosMock.map((t) => `${t.paciente.nombre} ${t.paciente.apellido}`))
  );

  const obrasSocialesUnicas = Array.from(
    new Set(turnosMock.map((t) => t.paciente.obraSocial))
  );

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };


  const turnosFiltrados = turnosMock.filter((t) => { //ojo que este filtro responde al hardcodeado
    const coincideEstado = t.estado === 'disponible';
    const coincidePaciente =
      filtros.paciente === '' ||
      `${t.paciente.nombre} ${t.paciente.apellido}` === filtros.paciente;
    const coincideObraSocial =
      filtros.obraSocial === '' || t.paciente.obraSocial === filtros.obraSocial;
    const coincideFecha = filtros.fecha === '' || t.fecha === filtros.fecha;
    return coincideEstado && coincidePaciente && coincideObraSocial && coincideFecha;
  });

  return (
    <div className="appointment-list-container">
      <h1>Listado de turnos</h1>

      <div className="filtros">
        <select
          value={filtros.paciente}
          onChange={(e) => handleFiltroChange('paciente', e.target.value)}
        >
          <option value="">Todos los pacientes</option>
          {pacientesUnicos.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          value={filtros.obraSocial}
          onChange={(e) => handleFiltroChange('obraSocial', e.target.value)}
        >
          <option value="">Todas las obras sociales</option>
          {obrasSocialesUnicas.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>

        <input
          type="date"
          value={filtros.fecha}
          onChange={(e) => handleFiltroChange('fecha', e.target.value)}
        />
      </div>

      <table className="appointment-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Obra Social</th>
            <th>Fecha</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          {turnosFiltrados.map((t) => (
            <tr key={t.id}>
              <td>{t.paciente.nombre}</td>
              <td>{t.paciente.apellido}</td>
              <td>{t.paciente.obraSocial}</td>
              <td>{t.fecha}</td>
              <td>{t.hora}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}