import express from 'express';
import ModuleController from '../controller/ModuleController';
import { validate } from '../utils/validations/validate';
import { addModuleSchema } from '../utils/validations/schema/module/addModuleSchema';
import { getModuleSchema } from '../utils/validations/schema/module/getModuleSchema';
import { getCurrentMonthModulesByConsultingRoomModuleSchema } from '../utils/validations/schema/module/getCurrentMonthModulesByConsultingRoomModuleSchema';

const router = express.Router();

router.post('/add', validate(addModuleSchema), ModuleController.addModules);
router.get('/getAll', ModuleController.getModules);
router.get('/get/:idModule', validate(getModuleSchema), ModuleController.getModule);
router.get('/getCurrentMonthModulesByConsultingRoom/:idConsultingRoom', validate(getCurrentMonthModulesByConsultingRoomModuleSchema),ModuleController.getCurrentMonthModulesByConsultingRoom);
//router.delete('/delete/:id', ModuleController.deleteModule);


export default router;
