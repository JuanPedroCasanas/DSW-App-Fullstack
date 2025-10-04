"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const HealthInsuranceController_1 = require("../controller/HealthInsuranceController");
const router = express_1.default.Router();
router.get('/', HealthInsuranceController_1.HealthInsuranceController.home);
router.post('/add', HealthInsuranceController_1.HealthInsuranceController.addHealthInsurance);
router.post('/update', HealthInsuranceController_1.HealthInsuranceController.updateHealthInsurance);
//router.get('/getAll', HealthInsuranceController.getHealthInsurance);
router.get('/get/:id', HealthInsuranceController_1.HealthInsuranceController.getHealthInsurance);
router.delete('/delete/:id', HealthInsuranceController_1.HealthInsuranceController.deleteHealthInsurance);
exports.default = router;
//# sourceMappingURL=HealthInsuranceRoutes.js.map