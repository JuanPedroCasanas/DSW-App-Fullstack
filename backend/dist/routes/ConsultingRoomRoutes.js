"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ConsultingRoomController_1 = require("../controller/ConsultingRoomController");
const router = express_1.default.Router();
router.get('/', ConsultingRoomController_1.ConsultingRoomController.home);
router.post('/add', ConsultingRoomController_1.ConsultingRoomController.addConsultingRoom);
router.post('/update', ConsultingRoomController_1.ConsultingRoomController.updateConsultingRoom);
router.get('/getAll', ConsultingRoomController_1.ConsultingRoomController.getConsultingRooms);
router.get('/get/:id', ConsultingRoomController_1.ConsultingRoomController.getConsultingRoom);
router.delete('/delete/:id', ConsultingRoomController_1.ConsultingRoomController.deleteConsultingRoom);
exports.default = router;
//# sourceMappingURL=ConsultingRoomRoutes.js.map