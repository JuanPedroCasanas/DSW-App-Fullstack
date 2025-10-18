"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCode = void 0;
const ConsultingRoomController_1 = require("./controller/ConsultingRoomController");
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
    //update
    let req = new FakeRequest({
        idConsultingRoom: 1,
        description: 'Consultorio 1 modificado'
    });
    let res = new FakeResponse();
    ConsultingRoomController_1.ConsultingRoomController.updateConsultingRoom(req, res);
};
exports.testCode = testCode;
//# sourceMappingURL=testCode.js.map