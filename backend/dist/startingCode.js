"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startingCode = void 0;
const ConsultingRoom_1 = require("./model/entities/ConsultingRoom");
const HealthInsurance_1 = require("./model/entities/HealthInsurance");
const LegalGuardian_1 = require("./model/entities/LegalGuardian");
const Occupation_1 = require("./model/entities/Occupation");
const Patient_1 = require("./model/entities/Patient");
const Professional_1 = require("./model/entities/Professional");
const db_1 = require("./orm/db");
const UserCreationService_1 = require("./services/UserCreationService");
const UNIVERSAL_PASSWORD = "123";
const startingCode = async () => {
    const em = await (0, db_1.getORM)().em.fork();
    //Creo consultorios
    const consultingRoom1 = new ConsultingRoom_1.ConsultingRoom("Consultorio 1");
    const consultingRoom2 = new ConsultingRoom_1.ConsultingRoom("Consultorio 2");
    const consultingRoom3 = new ConsultingRoom_1.ConsultingRoom("Consultorio 3");
    const consultingRoom4 = new ConsultingRoom_1.ConsultingRoom("Consultorio 4");
    await em.persistAndFlush(consultingRoom1);
    await em.persistAndFlush(consultingRoom2);
    await em.persistAndFlush(consultingRoom3);
    await em.persistAndFlush(consultingRoom4);
    //Creo obras sociales
    const os1 = new HealthInsurance_1.HealthInsurance("OSDE");
    const os2 = new HealthInsurance_1.HealthInsurance("MEDIFE");
    const os3 = new HealthInsurance_1.HealthInsurance("SWISS MEDICAL");
    await em.persistAndFlush(os1);
    await em.persistAndFlush(os2);
    await em.persistAndFlush(os3);
    //Creo ocupaciones
    const oc1 = new Occupation_1.Occupation("Psicopedagogia");
    const oc2 = new Occupation_1.Occupation("Psicologia");
    await em.persistAndFlush(oc1);
    await em.persistAndFlush(oc2);
    //Creo 2 profesionales
    let oc1DB = await em.findOne(Occupation_1.Occupation, { name: "Psicopedagogia" });
    let oc2DB = await em.findOne(Occupation_1.Occupation, { name: "Psicologia" });
    //Creo los usuarios
    let usu1 = await (0, UserCreationService_1.createUser)("gus_capo@gmail.com", UNIVERSAL_PASSWORD);
    if (oc1DB) {
        const prof1 = new Professional_1.Professional("Gustavo", "Machachechi", "3416333111", "gus_capo@gmail.com", oc1DB);
        prof1.user = usu1;
        usu1.professional = prof1;
        await em.persist(usu1); //Por el cascade en usu1 persiste tanto profesional como usuario
    }
    else {
        console.log(oc1DB);
    }
    let usu2 = await (0, UserCreationService_1.createUser)("parciales_falopa@gmail.com", UNIVERSAL_PASSWORD);
    if (oc2DB) {
        const prof2 = new Professional_1.Professional("Franco", "Vilmosius BDD", "3416333111", "parciales_falopa@gmail.com", oc2DB);
        prof2.user = usu2;
        usu2.professional = prof2;
        await em.persist(usu2);
    }
    else {
        console.log(oc2DB);
    }
    await em.flush();
    //Creo dos pacientes, uno con responsable legal y otro sin responsable legal
    //Con resp legal
    let respLegal = new LegalGuardian_1.LegalGuardian("Responsibilius", "Responsabilidache", new Date("1990-03-07"), "1234567", "resp@outlook.com");
    let usu3 = await (0, UserCreationService_1.createUser)("resp@outlook.com", UNIVERSAL_PASSWORD);
    respLegal.user = usu3;
    usu3.legalGuardian = respLegal;
    await em.persistAndFlush(usu3);
    let respLegalDb = await em.findOne(LegalGuardian_1.LegalGuardian, { idLegalGuardian: 1 });
    if (respLegalDb) {
        let petePatient = new Patient_1.Patient("Chiquito", "Chiquitin", new Date("2024-01-04"), undefined, undefined, respLegalDb);
        await em.persistAndFlush(petePatient);
    }
    else {
        console.log(respLegalDb);
    }
    //Paciente independiente
    let chadPatient = new Patient_1.Patient("Chadius", "Maximum", new Date("1930-02-01"), "123456", "chadius@chad.chad.com");
    let usu4 = await (0, UserCreationService_1.createUser)("chadius@chad.chad.com", UNIVERSAL_PASSWORD);
    usu4.patient = chadPatient;
    chadPatient.user = usu4;
    await em.persistAndFlush(usu4);
};
exports.startingCode = startingCode;
//# sourceMappingURL=startingCode.js.map