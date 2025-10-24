"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCode = void 0;
const db_1 = require("./orm/db");
const testCode = async () => {
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
    /*
    let req = new FakeRequest({
        idConsultingRoom: 1,
        description: 'Consultorio 1 modificado'
    });

    let res = new FakeResponse();

    ConsultingRoomController.updateConsultingRoom(req as any, res as any); */
    //getProfessionalsByOccupation
    /*let req = new FakeRequest({
        day: 1,
        startTime: '9:00',
        endTime: '11:00',
        validMonth: 10,
        validYear: 2025,
        idProfessional: 1,
        idConsultingRoom: 1

    });*/
    let req = new FakeRequest({}, {});
    let res = new FakeResponse();
    //AppointmentController.getAvailableAppointmentsByProfessional(req as any, res as any);
    //ConsultingRoomController.getConsultingRoomByModule(req as any, res as any);
};
exports.testCode = testCode;
//# sourceMappingURL=testCode.js.map