import { useState } from 'react';
import './moduleList.css';


// hardcodeados como ejemplo
const mockConsultorios = [
  { id: 'c1', nombre: 'Consultorio 1' },
  { id: 'c2', nombre: 'Consultorio 2' },
];

const mockModulos = [
  { id: 'm1', consultorioId: 'c1', profesional: 'Luciana Gómez', tipoModulo: 'Medio módulo', mes: 'Octubre' },
  { id: 'm2', consultorioId: 'c1', profesional: 'Juan Pérez', tipoModulo: 'Módulo completo', mes: 'Septiembre' },
  { id: 'm3', consultorioId: 'c2', profesional: 'Marcelo Torres', tipoModulo: 'Sexto de módulo', mes: 'Octubre' },
];

// meses hardcodeados tambien, seguro dsp se une con el backend
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// función principal
export default function ModuleList() {
  const [consultorioSeleccionado, setConsultorioSeleccionado] = useState('todos');
  const [filtros, setFiltros] = useState({
    profesional: '',
    tipo: '',
    mes: '',
  });

  const profesionalesUnicos = Array.from(
    new Set(mockModulos.map((m) => m.profesional))
  );

  const tiposModulos = Array.from(
    new Set(mockModulos.map((m) => m.tipoModulo))
  );

  const handleConsultorioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConsultorioSeleccionado(e.target.value);
  };

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const modulosFiltrados = mockModulos.filter((modulo) => {
    const coincideConsultorio = consultorioSeleccionado === 'todos' || modulo.consultorioId === consultorioSeleccionado;
    const coincideProfesional = filtros.profesional === '' || modulo.profesional === filtros.profesional;
    const coincideTipo = filtros.tipo === '' || modulo.tipoModulo === filtros.tipo;
    const coincideMes = filtros.mes === '' || modulo.mes === filtros.mes;
    return coincideConsultorio && coincideProfesional && coincideTipo && coincideMes;
  });

  const consultoriosAMostrar = consultorioSeleccionado === 'todos'
    ? mockConsultorios
    : mockConsultorios.filter((c) => c.id === consultorioSeleccionado);

  return (
    <div className="module-list-container">
      <h1>Listado de Módulos</h1>

      <label htmlFor="consultorio-select">Filtros:</label>
      <select id="consultorio-select" onChange={handleConsultorioChange} value={consultorioSeleccionado}>
        <option value="todos">Todos los consultorios</option>
        {mockConsultorios.map((c) => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>

      <div className="filtros">
        <select
          value={filtros.profesional}
          onChange={(e) => handleFiltroChange('profesional', e.target.value)}
        >
          <option value="">Todos los profesionales</option>
          {profesionalesUnicos.map((nombre) => (
            <option key={nombre} value={nombre}>{nombre}</option>
          ))}
        </select>


          <select
            value={filtros.tipo}
            onChange={(e) => handleFiltroChange('tipo', e.target.value)}
          >
            <option value="">Todos los tipos de módulo</option>
            {tiposModulos.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>


        <select value={filtros.mes} onChange={(e) => handleFiltroChange('mes', e.target.value)}>
          <option value="">Todos los meses</option>
          {meses.map((mes) => (
            <option key={mes} value={mes}>{mes}</option>
          ))}
        </select>
      </div>

      {consultoriosAMostrar.map((consultorio) => (
        <div key={consultorio.id} className="consultorio-section">
          <h2>{consultorio.nombre}</h2>
          <table className="module-table">
            <thead>
              <tr>
                <th>Profesional</th>
                <th>Tipo de módulo</th>
                <th>Mes</th>
              </tr>
            </thead>
            <tbody>
              {modulosFiltrados
                .filter((m) => m.consultorioId === consultorio.id)
                .map((modulo) => (
                  <tr key={modulo.id}>
                    <td>{modulo.profesional}</td>
                    <td>{modulo.tipoModulo}</td>
                    <td>{modulo.mes}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
