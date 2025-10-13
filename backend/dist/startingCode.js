"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startingCode = void 0;
const AppointmentController_1 = require("./controller/AppointmentController");
const ConsultingRoomController_1 = require("./controller/ConsultingRoomController");
const HealthInsuranceController_1 = require("./controller/HealthInsuranceController");
const LegalGuardianController_1 = require("./controller/LegalGuardianController");
const ModuleController_1 = __importDefault(require("./controller/ModuleController"));
const OccupationController_1 = require("./controller/OccupationController");
const PatientController_1 = require("./controller/PatientController");
const ProfessionalController_1 = require("./controller/ProfessionalController");
const ModuleType_1 = require("./model/entities/ModuleType");
const db_1 = require("./orm/db");
const startingCode = async () => {
    const UNI_PASSWORD = '123';
    let em = await (0, db_1.getORM)().em.fork();
    class FakeRequest {
        constructor(body, params) {
            this.body = body;
            this.params = params;
        }
    }
    class FakeResponse {
        constructor() {
            this.statusCode = 200;
            this.body = null;
        }
        status(code) {
            this.statusCode = code;
            return this; // importantísimo para poder hacer res.status(201).json(...)
        }
        json(obj) {
            this.body = obj;
            console.log("JSON response:", obj);
            return this;
        }
        send(msg) {
            console.log("Send response:", msg);
            return this;
        }
    }
    //Agrego module types
    const mt1 = new ModuleType_1.ModuleType('COMPLETO', 6);
    const mt2 = new ModuleType_1.ModuleType('MEDIO', 3);
    const mt3 = new ModuleType_1.ModuleType('SEXTO', 1);
    em.persist(mt1);
    em.persist(mt2);
    em.persist(mt3);
    await em.flush();
    //Agrego consultorios
    let req = new FakeRequest({
        description: 'Consultorio 1'
    });
    let res = new FakeResponse();
    await ConsultingRoomController_1.ConsultingRoomController.addConsultingRoom(req, res);
    req = new FakeRequest({
        description: 'Consultorio 2'
    });
    await ConsultingRoomController_1.ConsultingRoomController.addConsultingRoom(req, res);
    req = new FakeRequest({
        description: 'Consultorio 3'
    });
    await ConsultingRoomController_1.ConsultingRoomController.addConsultingRoom(req, res);
    req = new FakeRequest({
        description: 'Consultorio 4'
    });
    await ConsultingRoomController_1.ConsultingRoomController.addConsultingRoom(req, res);
    //OBRAS SOCIALES
    req = new FakeRequest({
        name: 'PARTICULAR'
    });
    await HealthInsuranceController_1.HealthInsuranceController.addHealthInsurance(req, res);
    req = new FakeRequest({
        name: 'OSDE'
    });
    await HealthInsuranceController_1.HealthInsuranceController.addHealthInsurance(req, res);
    req = new FakeRequest({
        name: 'SWISS'
    });
    await HealthInsuranceController_1.HealthInsuranceController.addHealthInsurance(req, res);
    req = new FakeRequest({
        name: 'MEDIFE'
    });
    await HealthInsuranceController_1.HealthInsuranceController.addHealthInsurance(req, res);
    //ESPECIALIDADES
    req = new FakeRequest({
        name: 'Psicopedagogo'
    });
    await OccupationController_1.OccupationController.addOccupation(req, res);
    req = new FakeRequest({
        name: 'Psicologo'
    });
    await OccupationController_1.OccupationController.addOccupation(req, res);
    //PROFESIONALES
    req = new FakeRequest({
        name: 'Pablo',
        lastName: 'Marmol',
        telephone: '1111',
        mail: 'kukatrap@gmail.com',
        password: UNI_PASSWORD,
        occupationId: 1
    });
    await ProfessionalController_1.ProfessionalController.addProfessional(req, res);
    req = new FakeRequest({
        name: 'Pedro',
        lastName: 'Picapiedra',
        telephone: '1111',
        mail: 'pepe@gmail.com',
        password: UNI_PASSWORD,
        occupationId: 2
    });
    await ProfessionalController_1.ProfessionalController.addProfessional(req, res);
    req = new FakeRequest({
        day: 1, startTime: '9:00', endTime: '18:00', validMonth: 10, validYear: 2025, professionalId: 1, consultingRoomId: 1
    });
    await ModuleController_1.default.addModules(req, res);
    //deberia tirar error
    req = new FakeRequest({
        day: 1, startTime: '3:00', endTime: '13:00', validMonth: 10, validYear: 2025, professionalId: 1, consultingRoomId: 1
    });
    await ModuleController_1.default.addModules(req, res);
    //deberia tirar error
    req = new FakeRequest({
        day: 1, startTime: '17:00', endTime: '19:00', validMonth: 10, validYear: 2025, professionalId: 1, consultingRoomId: 1
    });
    await ModuleController_1.default.addModules(req, res);
    //NO deberia tirar error
    req = new FakeRequest({
        day: 1, startTime: '18:00', endTime: '19:00', validMonth: 10, validYear: 2025, professionalId: 2, consultingRoomId: 1
    });
    await ModuleController_1.default.addModules(req, res);
    //NO deberia tirar error
    req = new FakeRequest({
        day: 1, startTime: '13:00', endTime: '15:00', validMonth: 10, validYear: 2025, professionalId: 2, consultingRoomId: 2
    });
    await ModuleController_1.default.addModules(req, res);
    //RESPONSABLE LEGAL
    req = new FakeRequest({
        "name": "Moncho",
        "lastName": "Lopez",
        "birthdate": "1990-07-21",
        "password": UNI_PASSWORD,
        "telephone": "3333333",
        "mail": "monchius@example.com",
        "idhealthInsurance": 2
    });
    await LegalGuardianController_1.LegalGuardianController.addLegalGuardian(req, res);
    //PACIENTES
    req = new FakeRequest({
        "name": "Lucía",
        "lastName": "Fernández",
        "birthdate": "1993-07-21",
        "password": UNI_PASSWORD,
        "telephone": "+54 9 11 4567 8920",
        "mail": "lucia.fernandez@example.com",
        "healthInsuranceId": 3
    });
    await PatientController_1.PatientController.addIndependentPatient(req, res);
    req = new FakeRequest({
        "name": "Mini",
        "lastName": "ME",
        "birthdate": "2010-07-21",
        "legalGuardianId": 1
    });
    await PatientController_1.PatientController.addDependentPatient(req, res);
    //Turnos
    req = new FakeRequest({
        idAppointment: 1, idPatient: 1
    });
    await AppointmentController_1.AppointmentController.assignAppointment(req, res);
    //Debería tirar error
    req = new FakeRequest({
        idAppointment: 1, idPatient: 2
    });
    await AppointmentController_1.AppointmentController.assignAppointment(req, res);
    req = new FakeRequest({
        idAppointment: 2, idPatient: 2
    });
    await AppointmentController_1.AppointmentController.assignAppointment(req, res);
};
exports.startingCode = startingCode;
//# sourceMappingURL=startingCode.js.map