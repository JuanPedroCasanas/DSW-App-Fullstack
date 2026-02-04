# Documentación del Proyecto

Bienvenidos a la documentación técnica y de gestión del proyecto.

## 1. Propuesta del Proyecto (Proposal)
> *Estado: Actualizada*
### Objetivo del Sistema
Desarrollar una plataforma integral para la gestión de un **Centro Psicopedagógico** que resuelva dos problemáticas principales: la administración de espacios físicos (alquiler de consultorios) y la gestión clínica (turnos y pacientes).

### Alcance Funcional
El sistema abarca los siguientes módulos:

* **Gestión de Espacios (Coworking):**
    * Permite a los profesionales alquilar consultorios basándose en módulos de tiempo (bloques horarios).
* **Gestión de Pacientes y Responsables Legales:**
    * Soporte para pacientes adultos y **menores de edad**.
    * Implementación del rol **Responsable Legal** obligatorio para pacientes menores de 18 años.
    * Gestión de cobertura médica (Obras Sociales) asociada al paciente.
* **Gestión de Turnos:**
    * **Pacientes:** Pueden filtrar y seleccionar profesionales según su Obra Social y disponibilidad.
    * **Profesionales:** Visualización y administración de su agenda de turnos asignados.
* **Seguridad y Accesos:**
    * Login unificado con redirección según el rol del usuario.
    * Validación de identidad: cada usuario (Profesional, Paciente, Responsable Legal) debe estar asociado a una persona física registrada.

### Actores del Sistema (Roles)
1.  **Profesional:** Alquila espacios y atiende pacientes.
2.  **Paciente:** Solicita turnos (si es mayor de edad).
3.  **Responsable Legal:** Gestiona la cuenta y turnos de los pacientes menores a su cargo.

- [Ver propuesta detallada](https://github.com/JuanPedroCasanas/DSW-TP-Casanas-Ochoa-Piazza-C305/blob/165d6d091b9e80e4372a4092e3be5c7a5d97902a/proposal.md)

## 2. Links a PR/MR (Pull Requests / Merge Requests)
Lista de los PRs más importantes o enlace al listado de PRs cerrados en el repositorio.
-[Ver historial de Pull Requests Cerrados](https://github.com/JuanPedroCasanas/DSW-TP-Casanas-Ochoa-Piazza-C305/pulls?q=is%3Apr+is%3Aclosed)

## 3. Instrucciones de Instalación

### Prerrequisitos
- ![Node.js](https://nodejs.org/es/download)
- ![NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)


### Pasos
Pasos para levantar el proyecto localmente:
1. **Clonar el repositorio:** git clone [https://github.com/JuanPedroCasanas/DSW-App-Fullstack.git](https://github.com/JuanPedroCasanas/DSW-App-Fullstack.git)
2. Cambiar a la rama main utilizando el comando 'git checkout main'
3. Dentro de la carpeta "/backend":
   3.a Generar un archivo .env.
   3.b Copiar el el contenido enviado en el mail de entrega por los alumnos al archivo recién generado .env - O bien copiar el archivo adjuntado en el mail y pegarlo en la dirección correspondiente.
4. Dentro de la carpeta "/frontend":
   4.a Generar un archivo .env.
   4.b Copiar el el contenido enviado en el mail de entrega por los alumnos al archivo recién generado .env - O bien copiar el archivo adjuntado en el mail y pegarlo en la dirección correspondiente.
5. Ejecutar el script 'setup_project.bat'
6. Ejecutar el script 'run_project.bat'
7. Visualizar el proyecto en http://localhost:3000

## 4. Minutas de Reunión y Avance
Registro de las reuniones del equipo y decisiones tomadas.

| Fecha      | Temas Tratados                 | Asistentes              |
|------------|--------------------------------|-------------------------|
| 31/03/2025 | Definición de tipo de sistema  | Todos                   |
| 07/04/2025 | Se presenta la idea base       | Todos                   |
| 19/04/2025 | Comienzo con la conexion de    | Pedro
|            |la base de datos con  el backend|  
| 10/06/2025 | Creacion de los controladores  | Todos
|            |Creacion de los cruds en backend|
|            | Empezamos frontend             |
|            | Presentamos proyecto regular   |
| 04/12/2025 | Correcciones y migracion a Zod | 


## 5. Tracking de Features, Bugs e Issues
Dado que no utilizamos herramientas externas, llevamos el seguimiento de las funcionalidades (Backlog) mediante la siguiente lista de control:

### Estado del Proyecto

| Funcionalidad / Tarea | Prioridad | Estado |
| :--- | :---: | :---: |
| **Autenticación y Roles** | Alta | Completado |
| Registro de Usuarios (Profesional, Paciente, Tutor) | Alta | Completado |
| Login/logout con validación de credenciales | Alta | Completado |
| **Gestión de Usuarios** | Alta | Completado |
| Alta/Baja/Modificación de Profesional | Alta | Completado |
| Alta/Baja/Modificación de Paciente | Alta | Completado |
| Alta/Baja/Modificación de Tutor Legal | Alta | Completado |
| **Gestión de Consultorios** | Alta | Completado |
| Alta/Baja/Modificación de Consultorios | Media | Completado |
| **Gestión de Turnos** | Alta | Completado |
| Solicitud de turno por parte del Paciente | Media | Completado |
| Visualización de agenda (Profesional) | Media | Completado |
| **Panel de Profesional** | Media | Completado |
| Alta/Baja/Modificación Obra Sociales | Media | Completado |
| Reserva de espacios por bloques de tiempo | Alta | Completado |
| **Listados** | Media | Completado |
| Listado de turnos (Filtros: Profesional, Paciente, Consultorio, Fecha) | Media | Completado |
| Listado de módulos (Filtros: Profesional, Tipo, Mes, Consultorio) | Media | Completado |
| Listar Personas filtradas por Obra Social | Baja | Completado |
| Listado de turnos detallado (Rango de fechas, Estado, Apellido) | Media | Completado |


### 6. Documentación de la API
Endpoints principales hechos con Swagger UI.
- [Link a Documentación]()

### 7. Evidencia de Tests Automáticos
Capturas de pantalla o logs de los tests pasando.
![Link a las captura de pantalla de los test pasando](https://drive.google.com/drive/folders/1S_xhw0hNJAoQu3Ij2SzH-uS82aCH3Hpi)

### 8. Demo de la App
Enlace al video demostrativo de la aplicación funcionando.
- [Ver video en YouTube/Drive](https://drive.google.com/file/d/1DhwZBUYeHs4a3Nn_0tbBvNyjiczjA4hZ/view?usp=sharing)

### 9. Deploy
Url donde la aplicación está desplegada y funcionando.
- [FrontEnd](https://dsw-app-frontend.vercel.app/)
- [BackEnd](https://dsw-app-fullstack.onrender.com/)

