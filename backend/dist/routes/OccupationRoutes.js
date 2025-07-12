"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const OccupationController_1 = require("../controller/OccupationController");
const router = express_1.default.Router();
router.get('/', OccupationController_1.OccupationController.home);
router.post('/addOccupation', OccupationController_1.OccupationController.addOccupation);
router.post('/updateOccupation', OccupationController_1.OccupationController.updateOccupation);
router.get('/getOccupations', OccupationController_1.OccupationController.getOccupations);
router.get('/getOccupation/:id', OccupationController_1.OccupationController.getOccupation);
router.delete('/deleteOccupation/:id', OccupationController_1.OccupationController.deleteOccupation);
exports.default = router;
//# sourceMappingURL=OccupationRoutes.js.map