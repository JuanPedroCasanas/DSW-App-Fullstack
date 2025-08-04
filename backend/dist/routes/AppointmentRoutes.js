"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AppointmentController_1 = require("../controller/AppointmentController");
const router = express_1.default.Router();
router.get('/', AppointmentController_1.AppointmentController.home);
router.post('/add', AppointmentController_1.AppointmentController.addAppointment);
router.post('/update', AppointmentController_1.AppointmentController.updateAppointment);
router.get('/getAll', AppointmentController_1.AppointmentController.getAppointments);
router.get('/get/:id', AppointmentController_1.AppointmentController.getAppointment);
router.delete('/delete/:id', AppointmentController_1.AppointmentController.deleteAppointment);
exports.default = router;
//# sourceMappingURL=AppointmentRoutes.js.map