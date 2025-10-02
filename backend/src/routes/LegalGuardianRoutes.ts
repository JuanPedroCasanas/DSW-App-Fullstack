import express from 'express';
import { LegalGuardianController } from '../controller/LegalGuardianController';

const router = express.Router();

router.get('/', LegalGuardianController.home);
router.post('/add', LegalGuardianController.addLegalGuardian);
router.post('/update', LegalGuardianController.updateLegalGuardian);
//router.get('/getAll', LegalGuardianController.getLegalGuardians);
router.get('/get/:id', LegalGuardianController.getLegalGuardian);
router.delete('/delete/:id', LegalGuardianController.deleteLegalGuardian);


export default router;