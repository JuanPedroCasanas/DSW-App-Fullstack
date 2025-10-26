"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCode = void 0;
const db_1 = require("./orm/db");
const testCode = async () => {
    const UNI_PASSWORD = '123';
    let em = await (0, db_1.getORM)().em.fork();
    class FakeRequest {
    }
    class FakeResponse {
        constructor() {
            this.statusCode = null;
            this.body = null;
        }
        status(code) {
            this.statusCode = code;
            return this; // importantísimo para poder hacer res.status(200).json(...)
        }
        json(data) {
            this.body = data;
            console.log("FakeResponse.json called with:", data);
            return this;
        }
    }
    let req = new FakeRequest();
    req.params = { id: 1 };
    let res = new FakeResponse();
    //UserController.getAll(req as any, res as any);
};
exports.testCode = testCode;
//# sourceMappingURL=testCode.js.map