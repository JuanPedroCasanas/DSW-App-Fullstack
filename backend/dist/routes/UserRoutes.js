"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const UserController_1 = require("../controller/UserController");
const User_1 = require("../model/entities/User");
const db_1 = require("../orm/db");
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; //Aun no implementado el secret en .ENV
const router = express_1.default.Router();
//Estrategia uqe usaremos al loguear
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
}, async (payload, done) => {
    try {
        const em = (await (0, db_1.getORM)()).em.fork();
        const user = await em.findOne(User_1.User, { id: payload.idUser });
        if (user)
            return done(null, user);
        return done(null, false);
    }
    catch (err) {
        return done(err, false);
    }
}));
// Middleware
const auth = passport_1.default.authenticate('jwt', { session: false });
// Routes
// Public
router.post('/login', (req, res) => UserController_1.UserController.login(req, res));
//Deberian ser protegidos, pero por ahora quedan publicos
router.get('/getAll', (req, res) => UserController_1.UserController.getAll(req, res));
router.get('/get/:id', (req, res) => UserController_1.UserController.getOne(req, res));
router.post('/updatePassword', (req, res) => UserController_1.UserController.updatePassword(req, res));
/* Protected asi quedarian al final, ademas de checkear roles
router.get('/users', auth, (req, res) => UserController.getAll(req, res));
router.get('/users/:id', auth, (req, res) => UserController.getOne(req, res));
router.post('/users/:id', auth, (req, res) => UserController.update(req, res));
*/
exports.default = router;
//# sourceMappingURL=UserRoutes.js.map