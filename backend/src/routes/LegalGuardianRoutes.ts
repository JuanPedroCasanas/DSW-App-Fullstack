import express from 'express';
import { LegalGuardianController } from '../controller/LegalGuardianController';
import { validate } from '../utils/validations/validate';
import { addLegalGuardianSchema } from '../utils/validations/schema/legalGuardian/addLegalGuardianSchema';
import { updateLegalGuardianSchema } from '../utils/validations/schema/legalGuardian/updateLegalGuardianSchema';
import { getDeleteLegalGuardianSchema } from '../utils/validations/schema/legalGuardian/getDeleteLegalGuardianSchema';

const router = express.Router();

router.post('/add', validate(addLegalGuardianSchema), LegalGuardianController.addLegalGuardian);
router.post('/update', validate(updateLegalGuardianSchema), LegalGuardianController.updateLegalGuardian);
router.get('/getAll', LegalGuardianController.getLegalGuardians);
router.get('/get/:idLegalGuardian', validate(getDeleteLegalGuardianSchema), LegalGuardianController.getLegalGuardian);
router.delete('/delete/:idLegalGuardian', validate(getDeleteLegalGuardianSchema), LegalGuardianController.deleteLegalGuardian);


export default router;