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
        params?: any;
        query? :any;
    }

    class FakeResponse {
        statusCode: number | null = null;
        body: any = null;

        status(code: number) {
            this.statusCode = code;
            return this; // importantísimo para poder hacer res.status(200).json(...)
        }

        json(data: any) {
            this.body = data;
            console.log("FakeResponse.json called with:", data);
            return this;
        }
    }

    let req = new FakeRequest();

    req.params = {id: 1}
    let res = new FakeResponse();
    //UserController.getAll(req as any, res as any);
}

    