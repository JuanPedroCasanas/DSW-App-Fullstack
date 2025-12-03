import express from 'express';
import { OccupationController } from '../controller/OccupationController';
import { validate } from '../utils/validations/validate';
import { addOccupationSchema } from '../utils/validations/schema/occupation/addOccupationSchema';
import { updateOccupationSchema } from '../utils/validations/schema/occupation/updateOccupationSchema';
import { getDeleteOccupationSchema } from '../utils/validations/schema/occupation/getDeleteOccupationSchema';

const router = express.Router();

router.post('/add', validate(addOccupationSchema), OccupationController.addOccupation);
router.post('/update', validate(updateOccupationSchema), OccupationController.updateOccupation);
router.get('/getAll', OccupationController.getOccupations);
router.get('/get/:idOccupation', validate(getDeleteOccupationSchema), OccupationController.getOccupation);
router.delete('/delete/:idOccupation', validate(getDeleteOccupationSchema), OccupationController.deleteOccupation);


export default router;
