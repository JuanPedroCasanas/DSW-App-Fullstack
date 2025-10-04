"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LegalGuardianController_1 = require("../controller/LegalGuardianController");
const router = express_1.default.Router();
router.get('/', LegalGuardianController_1.LegalGuardianController.home);
router.post('/add', LegalGuardianController_1.LegalGuardianController.addLegalGuardian);
router.post('/update', LegalGuardianController_1.LegalGuardianController.updateLegalGuardian);
//router.get('/getAll', LegalGuardianController.getLegalGuardians);
router.get('/get/:id', LegalGuardianController_1.LegalGuardianController.getLegalGuardian);
router.delete('/delete/:id', LegalGuardianController_1.LegalGuardianController.deleteLegalGuardian);
exports.default = router;
//# sourceMappingURL=LegalGuardianRoutes.js.map