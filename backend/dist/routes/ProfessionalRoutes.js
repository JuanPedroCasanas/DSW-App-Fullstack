"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProfessionalController_1 = require("../controller/ProfessionalController");
const router = express_1.default.Router();
router.get('/', ProfessionalController_1.ProfessionalController.home);
router.post('/add', ProfessionalController_1.ProfessionalController.addProfessional);
router.post('/update', ProfessionalController_1.ProfessionalController.updateProfessional);
router.post('/allowHealthInsurance', ProfessionalController_1.ProfessionalController.allowHealthInsurance);
router.post('/forbidHealthInsurance', ProfessionalController_1.ProfessionalController.forbidHealthInsurance);
//Puede incluir /getAll?includeInactive=false para solo obtener profesionales activos
//(Por defecto incluye profesionales inactivos)
router.get('/getAll', ProfessionalController_1.ProfessionalController.getProfessionals);
router.get('/get/:id', ProfessionalController_1.ProfessionalController.getProfessional);
//Puede incluir /getAll?includeInactive=false para solo obtener profesionales activos
//(Por defecto incluye profesionales inactivos)
router.get('/getProfessionalsByOccupation/:id', ProfessionalController_1.ProfessionalController.getProfessionalsByOccupation); //id de especialidad
router.delete('/delete/:id', ProfessionalController_1.ProfessionalController.deleteProfessional);
exports.default = router;
//# sourceMappingURL=ProfessionalRoutes.js.map