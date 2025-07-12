import express from 'express';
import { OccupationController } from '../controller/OccupationController';

const router = express.Router();

router.get('/', OccupationController.home);
router.post('/addOccupation', OccupationController.addOccupation);
router.post('/updateOccupation', OccupationController.updateOccupation);
router.get('/getOccupations', OccupationController.getOccupations);
router.get('/getOccupation/:id', OccupationController.getOccupation);
router.delete('/deleteOccupation/:id', OccupationController.deleteOccupation);


export default router;
