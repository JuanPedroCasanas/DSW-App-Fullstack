"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCode = void 0;
const UserController_1 = require("./controller/UserController");
const db_1 = require("./orm/db");
const testCode = async () => {
    const UNI_PASSWORD = '123';
    let em = await (0, db_1.getORM)().em.fork();
    class FakeRequest {
        constructor(body = {}, cookies = {}) {
            this.body = body;
            this.cookies = cookies;
        }
    }
    class FakeResponse {
        constructor() {
            this.statusCode = 200;
            this.body = null;
            this.cookies = {};
        }
        status(code) {
            this.statusCode = code;
            return this;
        }
        json(payload) {
            this.body = payload;
            return this;
        }
        cookie(name, value, options) {
            this.cookies[name] = { value, options };
            return this;
        }
        clearCookie(name, options) {
            delete this.cookies[name];
            return this;
        }
    }
    let req = new FakeRequest({ mail: "lucas_luna@gmail.com", password: "123" }, {});
    let res = new FakeResponse();
    await UserController_1.UserController.login(req, res);
    let refreshToken = res.cookies.refreshToken.value; // esto es string 
    let req1 = new FakeRequest({}, { refreshToken });
    let res1 = new FakeResponse();
    console.log(req1);
    await UserController_1.UserController.refresh(req1, res1);
    console.log(res1);
    await UserController_1.UserController.logout(req, res1);
    console.log(res1);
    // Intentar refresh después del logout
    const refreshTokenAfterLogout = res1.cookies.refreshToken?.value; // safe
    const reqAfterLogout = new FakeRequest({}, { refreshToken: refreshTokenAfterLogout ?? '' });
    const resAfterLogout = new FakeResponse();
    await UserController_1.UserController.refresh(reqAfterLogout, resAfterLogout);
    console.log(resAfterLogout);
};
exports.testCode = testCode;
//# sourceMappingURL=testCode.js.map