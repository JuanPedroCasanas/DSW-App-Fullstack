import { ConsultingRoomController } from "./controller/ConsultingRoomController";
import { HealthInsuranceController } from "./controller/HealthInsuranceController";
import { LegalGuardianController } from "./controller/LegalGuardianController";
import { OccupationController } from "./controller/OccupationController";
import { PatientController } from "./controller/PatientController";
import { ProfessionalController } from "./controller/ProfessionalController";
import { ModuleType } from "./model/entities/ModuleType";
import { getORM } from "./orm/db";

export const startingCode = async () => {

    const UNI_PASSWORD = '123';
    let em = await getORM().em.fork();


    class FakeRequest {
    body: any;
    params: any;
    constructor(body: any, params?: any) {
        this.body = body;
        this.params = params;
    }
    }

    class FakeResponse {
    statusCode: number = 200;
    body: any = null;

    status(code: number) {
        this.statusCode = code;
        return this; // importantísimo para poder hacer res.status(201).json(...)
    }

    json(obj: any) {
        this.body = obj;
        console.log("JSON response:", obj);
        return this;
    }

    send(msg: string) {
        console.log("Send response:", msg);
        return this;
    }
    }


    //Agrego module types
    const mt1 = new ModuleType('COMPLETO', 6);
    const mt2 = new ModuleType('MEDIO', 3);
    const mt3 = new ModuleType('SEXTO', 1);

    em.persist(mt1);
    em.persist(mt2);
    em.persist(mt3);

    await em.flush();

    //Agrego consultorios
    let req = new FakeRequest({
        description: 'Consultorio 1'
    });

    let res = new FakeResponse();

    await ConsultingRoomController.addConsultingRoom(req as any, res as any);

    req = new FakeRequest({
        description: 'Consultorio 2'
    });

    await ConsultingRoomController.addConsultingRoom(req as any, res as any);

    req = new FakeRequest({
        description: 'Consultorio 3'
    });

    await ConsultingRoomController.addConsultingRoom(req as any, res as any);

    req = new FakeRequest({
        description: 'Consultorio 4'
    });
    
    await ConsultingRoomController.addConsultingRoom(req as any, res as any);

    //OBRAS SOCIALES
    req = new FakeRequest({
       name: 'PARTICULAR'
    });
    await HealthInsuranceController.addHealthInsurance(req as any, res as any);
        req = new FakeRequest({
       name: 'OSDE'
    });
    await HealthInsuranceController.addHealthInsurance(req as any, res as any);
        req = new FakeRequest({
       name: 'SWISS'
    });
    await HealthInsuranceController.addHealthInsurance(req as any, res as any);
    req = new FakeRequest({
       name: 'MEDIFE'
    });
    await HealthInsuranceController.addHealthInsurance(req as any, res as any);

    //ESPECIALIDADES
    req = new FakeRequest({
       name: 'Psicopedagogo'
    });

    await OccupationController.addOccupation(req as any, res as any);

    req = new FakeRequest({
       name: 'Psicologo'
    });

    await OccupationController.addOccupation(req as any, res as any);

    //PROFESIONALES
    req = new FakeRequest({
       firstName: 'Martin',
       lastName: 'Gonzalez',
       telephone: '3414567890',
       mail: 'profesional1@ejemplo.com',
       password: UNI_PASSWORD,
       idOccupation: 1
    });
    await ProfessionalController.addProfessional(req as any, res as any);

    req = new FakeRequest({
       firstName: 'Laura',
       lastName: 'Rodriguez',
       telephone: '3415678901',
       mail: 'profesional2@ejemplo.com',
       password: UNI_PASSWORD,
       idOccupation: 1
    });
    await ProfessionalController.addProfessional(req as any, res as any);

    req = new FakeRequest({
       firstName: 'Diego',
       lastName: 'Fernandez',
       telephone: '3416789012',
       mail: 'profesional3@ejemplo.com',
       password: UNI_PASSWORD,
       idOccupation: 2
    });
    await ProfessionalController.addProfessional(req as any, res as any);

    req = new FakeRequest({
       firstName: 'Carolina',
       lastName: 'Martinez',
       telephone: '3417890123',
       mail: 'profesional4@ejemplo.com',
       password: UNI_PASSWORD,
       idOccupation: 2
    });
    await ProfessionalController.addProfessional(req as any, res as any);

    //RESPONSABLES LEGALES
    req = new FakeRequest({
        "firstName": "Roberto",
        "lastName": "Lopez",
        "birthdate": "1985-03-15",
        "password": UNI_PASSWORD,
        "telephone": "3411234567",
        "mail": "responsablelegal1@ejemplo.com",
        "idHealthInsurance": 2
    });
    await LegalGuardianController.addLegalGuardian(req as any, res as any);

    req = new FakeRequest({
        "firstName": "Silvia",
        "lastName": "Ramirez",
        "birthdate": "1982-08-22",
        "password": UNI_PASSWORD,
        "telephone": "3412345678",
        "mail": "responsablelegal2@ejemplo.com",
        "idHealthInsurance": 3
    });
    await LegalGuardianController.addLegalGuardian(req as any, res as any);

    req = new FakeRequest({
        "firstName": "Gustavo",
        "lastName": "Perez",
        "birthdate": "1988-11-10",
        "password": UNI_PASSWORD,
        "telephone": "3413456789",
        "mail": "responsablelegal3@ejemplo.com",
        "idHealthInsurance": 4
    });
    await LegalGuardianController.addLegalGuardian(req as any, res as any);

    //PACIENTES
    req = new FakeRequest({
        "firstName": "Matias",
        "lastName": "Gomez",
        "birthdate": "1995-05-18",
        "password": UNI_PASSWORD,
        "telephone": "3419876543",
        "mail": "paciente1@ejemplo.com",
        "idHealthInsurance": 1
    });
    await PatientController.addIndependentPatient(req as any, res as any);

    req = new FakeRequest({
        "firstName": "Valeria",
        "lastName": "Sanchez",
        "birthdate": "1998-09-25",
        "password": UNI_PASSWORD,
        "telephone": "3418765432",
        "mail": "paciente2@ejemplo.com",
        "idHealthInsurance": 2
    });
    await PatientController.addIndependentPatient(req as any, res as any);

    req = new FakeRequest({
        "firstName": "Lucas",
        "lastName": "Diaz",
        "birthdate": "2000-12-03",
        "password": UNI_PASSWORD,
        "telephone": "3417654321",
        "mail": "paciente3@ejemplo.com",
        "idHealthInsurance": 3
    });
    await PatientController.addIndependentPatient(req as any, res as any);

    //PACIENTES DEPENDIENTES (hijos de responsables legales)
    req = new FakeRequest({
        "firstName": "Joaquin",
        "lastName": "Lopez",
        "birthdate": "2015-04-12",
        "idLegalGuardian": 1
    });
    await PatientController.addDependentPatient(req as any, res as any);

    req = new FakeRequest({
        "firstName": "Sofia",
        "lastName": "Lopez",
        "birthdate": "2017-07-20",
        "idLegalGuardian": 1
    });
    await PatientController.addDependentPatient(req as any, res as any);

    req = new FakeRequest({
        "firstName": "Camila",
        "lastName": "Ramirez",
        "birthdate": "2014-01-08",
        "idLegalGuardian": 2
    });
    await PatientController.addDependentPatient(req as any, res as any);

    req = new FakeRequest({
        "firstName": "Tomas",
        "lastName": "Ramirez",
        "birthdate": "2016-10-14",
        "idLegalGuardian": 2
    });
    await PatientController.addDependentPatient(req as any, res as any);

    req = new FakeRequest({
        "firstName": "Franco",
        "lastName": "Perez",
        "birthdate": "2018-06-05",
        "idLegalGuardian": 3
    });
    await PatientController.addDependentPatient(req as any, res as any);

}