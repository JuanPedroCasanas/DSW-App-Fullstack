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
* **Gestión de Pacientes y Tutores:**
    * Soporte para pacientes adultos y **menores de edad**.
    * Implementación del rol **Tutor/Responsable Legal** obligatorio para pacientes menores de 18 años.
    * Gestión de cobertura médica (Obras Sociales) asociada al paciente.
* **Gestión de Turnos:**
    * **Pacientes:** Pueden filtrar y seleccionar profesionales según su Obra Social y disponibilidad.
    * **Profesionales:** Visualización y administración de su agenda de turnos asignados.
* **Seguridad y Accesos:**
    * Login unificado con redirección según el rol del usuario.
    * Validación de identidad: cada usuario (Profesional, Paciente, Tutor) debe estar asociado a una persona física registrada.

### Actores del Sistema (Roles)
1.  **Profesional:** Alquila espacios y atiende pacientes.
2.  **Paciente:** Solicita turnos (si es mayor de edad).
3.  **Tutor Legal:** Gestiona la cuenta y turnos de los pacientes menores a su cargo.

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
    1. Clonar el repositorio  "gh repo clone JuanPedroCasanas/DSW-App-Fullstack"
    2. Cambiar a la rama de entrega regularidad utilizando el comando 'git checkout entrega-reg'
    3. Dentro de la carpeta "/backend":
        3.a Generar un archivo .env.
         3.b Copiar el el contenido enviado en el mail de entrega por los alumnos al archivo recién generado .env - O bien copiar el archivo adjuntado en el mail y pegarlo en la dirección correspondiente.
    4. Ejecutar el script 'setup_project.bat'
    5. Ejecutar el script 'run_project.bat'
    6. Visualizar el proyecto en http://localhost:3000

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

| Funcionalidad / Tarea                               | Prioridad               | Estado         |
|------------------------------------------------------------------------------------------------| 
| **Autenticación y Roles**                           | Alta                    | ✅ Completado |
| Registro de Usuarios (Profesional, Paciente, Tutor) | Alta                    | ✅ Completado |
| Login/logout con validación de credenciales         | Alta                    | ✅ Completado |
| ***Gestion de Usuarios**                            | Alta                                     |
| Alta/Baja/Modificación de Profesional               |
| Alta/Baja/Modificación de Paciente                  |
| Alta/Baja/Modificación de Tutor Legal               |
| **Gestión de Consultorios**                         | Alta                    | ✅ Completado |
| Alta/Baja/Modificación de Consultorios              | Media                   | ✅ Completado |                                       
| **Gestión de Turnos**                               | Alta                    | 🚧 En Progreso|
| Solicitud de turno por parte del Paciente           | Alta                    | ✅ Completado |
| Visualización de agenda (Profesional)               |
| **Panel de Profesional**                            | Baja                    | ⏳ Pendiente  | 
| Alta/Baja/Modificación Obra Sociales                | Media                   | ⏳ Pendiente  |
| Reserva de espacios por bloques de tiempo           | Media                   | ⏳ Pendiente  |
| **Listados**                                        |
| Listado de turnos filtrado por: Profesional,        |
| paciente, consultorio y/o fecha                     |
| Listado de modulos filtrado por: Profesional,       |
| tipo de modulo, mes y/o consultorio                 |
| Listar Personas filtradas por Obra Social           |
| Listado de turnos filtrado por profesional          |
| y rango de fecha, muestra fecha y hora de turno,    |
| estado del mismo y apellido de Persona              |



### 6. Documentación de la API
Endpoints principales (puedes usar Swagger o describirlos aquí).
###  Autenticación y Usuarios
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/login` | Inicia sesión y devuelve el token/usuario. |
| `GET`  | `/api/users/:id` | Obtiene los datos del perfil de un usuario. |

### Gestion de usuarios (en este caso, profesional)
| Método | Endpoint | Descripción |
| :---   | :---     | :---        |
| `POST` | `/add`   | Alta profesional. |
| `DELETE`| `/delete/:id` | Baja profesional
| `GET` | `/update` | Modificacion profesional |


###  Consultorios
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/consultorios` | Obtiene la lista de todos los consultorios disponibles. |
| `GET` | `/get/:idConsultingRoom ` | Obtiene el detalle de un consultorio específico. |
| `POST` | `/add` | Crea un nuevo consultorio (Solo Admin/Profesional). |

###  Turnos
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/turnos` | Lista los turnos reservados. |
| `POST` | `/api/turnos` | Reserva un nuevo turno. |
| `DELETE`| `/api/turnos/:id` | Cancela un turno existente. |

### 7. Evidencia de Tests Automáticos
Capturas de pantalla o logs de los tests pasando.
![Tests pasando](./assets/test-evidence.png)

### 8. Demo de la App
Enlace al video demostrativo de la aplicación funcionando.
- [Ver video en YouTube/Drive](link-al-video)

### 9. Deploy
Url donde la aplicación está desplegada y funcionando.
- [Ir a la aplicación](https://mi-app-deploy.com)

