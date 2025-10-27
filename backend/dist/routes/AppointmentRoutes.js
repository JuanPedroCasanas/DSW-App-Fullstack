"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AppointmentController_1 = require("../controller/AppointmentController");
const router = express_1.default.Router();
//APLICAR AUTH A TODO ESTO, HAY QUE SER FINOS EN EL CANCEL, COMPLETE Y MISS
router.get('/', AppointmentController_1.AppointmentController.home);
router.post('/assign', AppointmentController_1.AppointmentController.assignAppointment);
router.post('/cancel', AppointmentController_1.AppointmentController.cancelAppointment);
router.post('/complete', AppointmentController_1.AppointmentController.completeAppointment);
router.post('/miss', AppointmentController_1.AppointmentController.missAppointment);
router.get('/getAll', AppointmentController_1.AppointmentController.getAppointments);
router.get('/get/:id', AppointmentController_1.AppointmentController.getAppointment);
router.get('/getAvailableAppointmentsByProfessional/:id', AppointmentController_1.AppointmentController.getAvailableAppointmentsByProfessional);
router.get('/getScheduledAppointments', AppointmentController_1.AppointmentController.getScheduledAppointments);
// funciona: /getAppointmentByStatus?status=scheduled y todos los otros estados que tiene turno
// lo dejo acá separado del getALl por las dudas
router.get('/getAppointmentsByStatus', AppointmentController_1.AppointmentController.getAppointmentsByStatus);
router.get('/getAppointmentsByPatient/:id', AppointmentController_1.AppointmentController.getAppointmentsByPatient);
exports.default = router;
//# sourceMappingURL=AppointmentRoutes.js.map