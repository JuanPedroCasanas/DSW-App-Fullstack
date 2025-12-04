import express from 'express';
import { ProfessionalController } from '../controller/ProfessionalController';
import { addProfessionalSchema } from '../utils/validations/schema/professional/addProfessionalSchema';
import { validate } from '../utils/validations/validate';
import { updateProfessionalSchema } from '../utils/validations/schema/professional/updateProfessionalSchema';
import { allowForbidHealthInsuranceSchema } from '../utils/validations/schema/professional/allowForbidHealthInsuranceSchema';
import { getDeleteProfessionalSchema } from '../utils/validations/schema/professional/getDeleteProfessionalSchema';
import { getProfessionalsByOccupationSchema } from '../utils/validations/schema/professional/getProfessionalsByOccupationSchema';

const router = express.Router();

router.post('/add', validate(addProfessionalSchema), ProfessionalController.addProfessional);
router.post('/update', validate(updateProfessionalSchema), ProfessionalController.updateProfessional);
router.post('/allowHealthInsurance', validate(allowForbidHealthInsuranceSchema), ProfessionalController.allowHealthInsurance);
router.post('/forbidHealthInsurance', validate(allowForbidHealthInsuranceSchema), ProfessionalController.forbidHealthInsurance)

//Puede incluir /getAll?includeInactive=false para solo obtener profesionales activos
//(Por defecto incluye profesionales inactivos)
router.get('/getAll', ProfessionalController.getProfessionals);
router.get('/getAllWithHealthInsurances', ProfessionalController.getProfessionalsIncludeHealthInsurances);
router.get('/get/:idProfessional', validate(getDeleteProfessionalSchema), ProfessionalController.getProfessional);

//Puede incluir /getAll?includeInactive=false para solo obtener profesionales activos
//(Por defecto incluye profesionales inactivos)
router.get('/getProfessionalsByOccupation/:idOccupation', validate(getProfessionalsByOccupationSchema), ProfessionalController.getProfessionalsByOccupation); 



router.delete('/delete/:idProfessional', validate(getDeleteProfessionalSchema), ProfessionalController.deleteProfessional);


export default router;