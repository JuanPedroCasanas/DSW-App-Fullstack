"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PatientController_1 = require("../controller/PatientController");
const router = express_1.default.Router();
router.get('/', PatientController_1.PatientController.home);
router.post('/addIndPatient', PatientController_1.PatientController.addIndependentPatient);
router.post('/addDepPatient', PatientController_1.PatientController.addDependentPatient);
router.post('/updateDepPatient', PatientController_1.PatientController.updateDependentPatient);
router.post('/updateIndPatient', PatientController_1.PatientController.updateIndependentPatient);
router.get('/getAll', PatientController_1.PatientController.getPatients);
router.get('/get/:id', PatientController_1.PatientController.getPatient);
router.get('/getByLegalGuardian/:id', PatientController_1.PatientController.getByLegalGuardian);
router.delete('/delete/:id', PatientController_1.PatientController.deletePatient);
exports.default = router;
//# sourceMappingURL=PatientRoutes.js.map