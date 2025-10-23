import express from 'express';
import { ProfessionalController } from '../controller/ProfessionalController';

const router = express.Router();

router.get('/', ProfessionalController.home);
router.post('/add', ProfessionalController.addProfessional);
router.post('/update', ProfessionalController.updateProfessional);


//Puede incluir /getAll?includeInactive=false para solo obtener profesionales activos
//(Por defecto incluye profesionales inactivos)
router.get('/getAll', ProfessionalController.getProfessionals);
router.get('/get/:id', ProfessionalController.getProfessional);

//Puede incluir /getAll?includeInactive=false para solo obtener profesionales activos
//(Por defecto incluye profesionales inactivos)
router.get('/getProfessionalsByOccupation/:id', ProfessionalController.getProfessionalsByOccupation); //id de especialidad



router.delete('/delete/:id', ProfessionalController.deleteProfessional);


export default router;