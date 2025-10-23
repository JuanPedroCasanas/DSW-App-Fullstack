"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ModuleController_1 = __importDefault(require("../controller/ModuleController"));
const router = express_1.default.Router();
router.get('/', ModuleController_1.default.home);
router.post('/add', ModuleController_1.default.addModules);
router.post('/update', ModuleController_1.default.updateModule);
router.get('/getAll', ModuleController_1.default.getModules);
router.get('/get/:id', ModuleController_1.default.getModule);
router.get('/getCurrentMonthModulesByConsultingRoom/:id', ModuleController_1.default.getCurrentMonthModulesByConsultingRoom);
//router.delete('/delete/:id', ModuleController.deleteModule);
exports.default = router;
//# sourceMappingURL=ModuleRoutes.js.map