import express from 'express';
import ModuleController from '../controller/ModuleController';

const router = express.Router();

router.get('/', ModuleController.home);
router.post('/add', ModuleController.addModule);
router.post('/update', ModuleController.updateModule);
router.get('/getAll', ModuleController.getModules);
router.get('/get/:id', ModuleController.getModule);
router.delete('/delete/:id', ModuleController.deleteModule);


export default router;
