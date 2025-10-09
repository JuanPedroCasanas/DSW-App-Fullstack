import { ConsultingRoom } from "./model/entities/ConsultingRoom";
import { HealthInsurance } from "./model/entities/HealthInsurance";
import { LegalGuardian } from "./model/entities/LegalGuardian";
import { Occupation } from "./model/entities/Occupation";
import { Patient } from "./model/entities/Patient";
import { Professional } from "./model/entities/Professional";
import { getORM } from "./orm/db";
import { createUser } from "./services/UserCreationService";


const UNIVERSAL_PASSWORD = "123"
export const startingCode = async () => {
    const em = await getORM().em.fork();

    //Creo consultorios
    const consultingRoom1 = new ConsultingRoom("Consultorio 1");
    const consultingRoom2 = new ConsultingRoom("Consultorio 2");
    const consultingRoom3 = new ConsultingRoom("Consultorio 3");
    const consultingRoom4 = new ConsultingRoom("Consultorio 4");
    await em.persistAndFlush(consultingRoom1);
    await em.persistAndFlush(consultingRoom2);
    await em.persistAndFlush(consultingRoom3);
    await em.persistAndFlush(consultingRoom4);
    

    //Creo obras sociales
    const os0 = new HealthInsurance("PARTICULAR");
    const os1 = new HealthInsurance("OSDE");
    const os2 = new HealthInsurance("MEDIFE");
    const os3 = new HealthInsurance("SWISS MEDICAL");
    await em.persistAndFlush(os0);
    await em.persistAndFlush(os1);
    await em.persistAndFlush(os2);
    await em.persistAndFlush(os3);

    //Creo ocupaciones
    const oc1 = new Occupation("Psicopedagogia")
    const oc2 = new Occupation("Psicologia")

    await em.persistAndFlush(oc1);
    await em.persistAndFlush(oc2);

    //Creo 2 profesionales
    let os0db = await em.findOne(HealthInsurance, {idHealthInsurance : 1})
    let os1db = await em.findOne(HealthInsurance, {idHealthInsurance : 2})

    let oc1DB = await em.findOne(Occupation, { name : "Psicopedagogia" });
    let oc2DB = await em.findOne(Occupation, { name : "Psicologia" });

    //Creo los usuarios
    let usu1 = await createUser("gus_capo@gmail.com", UNIVERSAL_PASSWORD);
   
    if(oc1DB)
    {
        const prof1 = new Professional("Gustavo", "Machachechi", "3416333111", oc1DB);
        prof1.user = usu1;
        usu1.professional = prof1;
        if(os1db && os0db) {
            prof1.healthInsurances.add(os0db);
            prof1.healthInsurances.add(os1db);
        }
        await em.persist(usu1); //Por el cascade en usu1 persiste tanto profesional como usuario
    }
    else
    {
        console.log(oc1DB);
    }
    
    let usu2 = await createUser("parcialitos@gmail.com", UNIVERSAL_PASSWORD);
    if(oc2DB)
    {
        const prof2 = new Professional("Franco", "Vilmosius BDD", "3416333111", oc2DB);
        prof2.user = usu2;
        usu2.professional = prof2;
        if(os0db) {
            prof2.healthInsurances.add(os0db);
        }
        await em.persist(usu2);
    }
    else
    {
        console.log(oc2DB);
    }
    await em.flush();

    //Creo dos pacientes, uno con responsable legal y otro sin responsable legal
    //Con resp legal
    if(os0db)
    {
        let respLegal = new LegalGuardian("Responsibilius", "Responsabilidache", new Date("1990-03-07"), "1234567", os0db)
        let usu3 = await createUser("resp@outlook.com", UNIVERSAL_PASSWORD);
        respLegal.user = usu3
        usu3.legalGuardian = respLegal
        await em.persistAndFlush(usu3);
    }

    let respLegalDb = await em.findOne(LegalGuardian, { idLegalGuardian: 1 })
    if(respLegalDb) {
        let petePatient = new Patient("Chiquito", "Chiquitin", new Date("2024-01-04"), respLegalDb.healthInsurance, undefined, respLegalDb);
        await em.persistAndFlush(petePatient);
    }
    else {
        console.log(respLegalDb);
    }

    //Paciente independiente
    if(os1db)
    {
        let chadPatient = new Patient("Chadius", "Maximum", new Date("1930-02-01"), os1db, "chadius@chad.chad.com");
        let usu4 = await createUser("chadius@chad.chad.com", UNIVERSAL_PASSWORD);
        usu4.patient = chadPatient;
        chadPatient.user = usu4;
        await em.persistAndFlush(usu4);
    }
}


