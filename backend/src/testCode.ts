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
        cookies: Record<string, string>;
        constructor(body: any = {}, cookies: Record<string,string> = {}) {
            this.body = body;
            this.cookies = cookies;
        }
    }

    class FakeResponse {
        statusCode: number = 200;
        body: any = null;
        cookies: Record<string, any> = {};
        
        status(code: number) {
            this.statusCode = code;
            return this;
        }

        json(payload: any) {
            this.body = payload;
            return this;
        }

        cookie(name: string, value: string, options?: any) {
            this.cookies[name] = { value, options };
            return this;
        }

        clearCookie(name: string, options?: any) {
            delete this.cookies[name];
            return this;
        }
    }


    let req = new FakeRequest({mail: "lucas_luna@gmail.com", password: "123"},{});
    let res = new FakeResponse();
    await UserController.login(req as any, res as any)

    let refreshToken = res.cookies.refreshToken.value; // esto es string 
    let req1 = new FakeRequest({}, { refreshToken });
    let res1= new FakeResponse();

    console.log(req1);
    await UserController.refresh(req1 as any, res1 as any);
    console.log(res1);
    await UserController.logout(req as any, res1 as any);
    console.log(res1);

    // Intentar refresh después del logout
    const refreshTokenAfterLogout = res1.cookies.refreshToken?.value; // safe
    const reqAfterLogout = new FakeRequest({}, { refreshToken: refreshTokenAfterLogout ?? '' });
    const resAfterLogout = new FakeResponse();

    await UserController.refresh(reqAfterLogout as any, resAfterLogout as any);
    console.log(resAfterLogout);
    
}