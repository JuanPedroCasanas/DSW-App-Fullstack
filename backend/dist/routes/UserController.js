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
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const router = express_1.default.Router();
// Passport JWT Strategy
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
}, async (payload, done) => {
    try {
        const em = (await (0, db_1.getORM)()).em.fork();
        const user = await em.findOne(User_1.User, { idUser: payload.idUser });
        if (user)
            return done(null, user);
        return done(null, false);
    }
    catch (err) {
        return done(err, false);
    }
}));
// Middleware to protect routes
const auth = passport_1.default.authenticate('jwt', { session: false });
// Routes
// Public
router.post('/register', (req, res) => UserController_1.UserController.register(req, res));
router.post('/login', (req, res) => UserController_1.UserController.login(req, res));
// Protected
router.get('/users', auth, (req, res) => UserController_1.UserController.getAll(req, res));
router.get('/users/:id', auth, (req, res) => UserController_1.UserController.getOne(req, res));
router.put('/users/:id', auth, (req, res) => UserController_1.UserController.update(req, res));
router.delete('/users/:id', auth, (req, res) => UserController_1.UserController.delete(req, res));
exports.default = router;
//# sourceMappingURL=UserController.js.map