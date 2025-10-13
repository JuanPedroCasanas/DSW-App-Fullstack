import { AppointmentController } from "./controller/AppointmentController";
import { ConsultingRoomController } from "./controller/ConsultingRoomController";
import { HealthInsuranceController } from "./controller/HealthInsuranceController";
import { LegalGuardianController } from "./controller/LegalGuardianController";
import ModuleController from "./controller/ModuleController";
import { OccupationController } from "./controller/OccupationController";
import { PatientController } from "./controller/PatientController";
import { ProfessionalController } from "./controller/ProfessionalController";
import { ModuleType } from "./model/entities/ModuleType";
import { User } from "./model/entities/User";
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
       firstName: 'Pablo',
       lastName: 'Marmol',
       telephone: '1111',
       mail: 'kukatrap@gmail.com',
       password: UNI_PASSWORD,
       occupationId: 1
    });
    await ProfessionalController.addProfessional(req as any, res as any);

    req = new FakeRequest({
       firstName: 'Pedro',
       lastName: 'Picapiedra',
       telephone: '1111',
       mail: 'pepe@gmail.com',
       password: UNI_PASSWORD,
       occupationId: 2
    });
    await ProfessionalController.addProfessional(req as any, res as any);

    req = new FakeRequest({
        day: 1, startTime: '9:00', endTime: '18:00', validMonth: 10, validYear: 2025, professionalId: 1, consultingRoomId: 1
    });
    
    await ModuleController.addModules(req as any, res as any);

    //deberia tirar error
    req = new FakeRequest({
        day: 1, startTime: '3:00', endTime: '13:00', validMonth: 10, validYear: 2025, professionalId: 1, consultingRoomId: 1
    });
    
    await ModuleController.addModules(req as any, res as any);

    //deberia tirar error
    req = new FakeRequest({
        day: 1, startTime: '17:00', endTime: '19:00', validMonth: 10, validYear: 2025, professionalId: 1, consultingRoomId: 1
    });
    
    await ModuleController.addModules(req as any, res as any);

    //NO deberia tirar error
    req = new FakeRequest({
        day: 1, startTime: '18:00', endTime: '19:00', validMonth: 10, validYear: 2025, professionalId: 2, consultingRoomId: 1
    });
    
    await ModuleController.addModules(req as any, res as any);

    //NO deberia tirar error
    req = new FakeRequest({
        day: 1, startTime: '13:00', endTime: '15:00', validMonth: 10, validYear: 2025, professionalId: 2, consultingRoomId: 2
    });
    
    await ModuleController.addModules(req as any, res as any);

    //RESPONSABLE LEGAL
    req = new FakeRequest({
        "firstName": "Moncho",
        "lastName": "Lopez",
        "birthdate": "1990-07-21",
        "password": UNI_PASSWORD,
        "telephone": "3333333",
        "mail": "monchius@example.com",
        "idhealthInsurance": 2
    });

    await LegalGuardianController.addLegalGuardian(req as any, res as any);

    //PACIENTES
    req = new FakeRequest({
        "firstName": "Lucía",
        "lastName": "Fernández",
        "birthdate": "1993-07-21",
        "password": UNI_PASSWORD,
        "telephone": "+54 9 11 4567 8920",
        "mail": "lucia.fernandez@example.com",
        "healthInsuranceId": 3
    });

    await PatientController.addIndependentPatient(req as any, res as any);

    req = new FakeRequest({
        "firstName": "Mini",
        "lastName": "ME",
        "birthdate": "2010-07-21",
        "legalGuardianId": 1
    });

    await PatientController.addDependentPatient(req as any, res as any);


    //Turnos
    req = new FakeRequest({
        idAppointment: 1, idPatient: 1
    });

    await AppointmentController.assignAppointment(req as any, res as any);

    //Debería tirar error
    req = new FakeRequest({
        idAppointment: 1, idPatient: 2
    });

    await AppointmentController.assignAppointment(req as any, res as any);

    req = new FakeRequest({
        idAppointment: 40, idPatient: 2
    });

    await AppointmentController.assignAppointment(req as any, res as any);





    req = new FakeRequest({}, {id: 1});
    await ProfessionalController.deleteProfessional(req as any, res as any);


    //deberia tirar error, prof inhabilitado
    req = new FakeRequest({
        day: 1, startTime: '10:00', endTime: '14:00', validMonth: 10, validYear: 2025, professionalId: 1, consultingRoomId: 1
    });
    
    await ModuleController.addModules(req as any, res as any);



    //Ok, porque el modulo que estaba aca esta cancelado
    req = new FakeRequest({
        day: 1, startTime: '10:00', endTime: '14:00', validMonth: 10, validYear: 2025, professionalId: 2, consultingRoomId: 1
    });
    
    await ModuleController.addModules(req as any, res as any);

    //Deberia cascadear los inhabilitar a paciente y sus turnos
    req = new FakeRequest({}, {id: 1}); 
    await LegalGuardianController.deleteLegalGuardian(req as any, res as any);

}