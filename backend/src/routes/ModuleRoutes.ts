import express from 'express';
import ModuleController from '../controller/ModuleController';

const router = express.Router();

router.get('/', ModuleController.home);
router.post('/add', ModuleController.addModules);
router.post('/update', ModuleController.updateModule);
router.get('/getAll', ModuleController.getModules);
router.get('/get/:id', ModuleController.getModule);
router.get('/getCurrentMonthModulesByConsultingRoom/:id', ModuleController.getCurrentMonthModulesByConsultingRoom);
//router.delete('/delete/:id', ModuleController.deleteModule);


export default router;
