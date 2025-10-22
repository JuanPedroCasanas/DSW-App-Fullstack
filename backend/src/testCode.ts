import { AppointmentController } from "./controller/AppointmentController";
import { ConsultingRoomController } from "./controller/ConsultingRoomController";
import { HealthInsuranceController } from "./controller/HealthInsuranceController";
import { LegalGuardianController } from "./controller/LegalGuardianController";
import ModuleController from "./controller/ModuleController";
import { OccupationController } from "./controller/OccupationController";
import { PatientController } from "./controller/PatientController";
import { ProfessionalController } from "./controller/ProfessionalController";
import { UserController } from "./controller/UserController";
import { ModuleType } from "./model/entities/ModuleType";
import { User } from "./model/entities/User";
import { getORM } from "./orm/db";

export const testCode = async () => {

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

    /*
    let req = new FakeRequest({
        idConsultingRoom: 1,
        description: 'Consultorio 1 modificado'
    });

    let res = new FakeResponse();

    ConsultingRoomController.updateConsultingRoom(req as any, res as any); */

    //getProfessionalsByOccupation
    let req = new FakeRequest({},{id: 1});

    let res = new FakeResponse();
    //AppointmentController.getAvailableAppointmentsByProfessional(req as any, res as any);
    //ConsultingRoomController.getConsultingRoomByModule(req as any, res as any);
}