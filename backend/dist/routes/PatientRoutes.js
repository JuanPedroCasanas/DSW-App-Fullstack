"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PatientController_1 = require("../controller/PatientController");
const router = express_1.default.Router();
router.get('/', PatientController_1.PatientController.home);
router.post('/add', PatientController_1.PatientController.addPatient);
router.post('/update', PatientController_1.PatientController.updatePatient);
router.get('/getAll', PatientController_1.PatientController.getPatients);
router.get('/get/:id', PatientController_1.PatientController.getPatient);
router.delete('/delete/:id', PatientController_1.PatientController.deletePatient);
exports.default = router;
//# sourceMappingURL=PatientRoutes.js.map