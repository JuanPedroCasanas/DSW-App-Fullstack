//IMPORTANTE QUE ESTEN PRIMERO
import 'reflect-metadata'
import 'dotenv/config';

//EXPRESS
import express, {Request, Response, NextFunction} from 'express';

//ORM
import { RequestContext } from '@mikro-orm/core'
import { initORM, getORM, syncSchema } from './orm/db'

//CORS
import cors from 'cors'

//IMPORT RUTAS
import occupationRoutes from './routes/OccupationRoutes';
import { Appointment } from './model/entities/Appointment'; // este que función cumple? lo dejo por las dudas- sofi
import AppointmentRoutes from './routes/AppointmentRoutes';
import ConsultingRoomRoutes from './routes/ConsultingRoomRoutes';
import ModuleRoutes from './routes/ModuleRoutes';
import PatientRoutes from './routes/PatientRoutes';

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

app.use((req: Request, res: Response, next: NextFunction) => {
    RequestContext.create(getORM().em, next);
});


//USO RUTAS
app.use('/Occupation', occupationRoutes);
app.use('/Appointment', AppointmentRoutes);
app.use('/ConsultingRoom', ConsultingRoomRoutes);
app.use('/Module', ModuleRoutes);
app.use('/Patient', PatientRoutes);




app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' })
});

async function start() {
  await initORM();
  await syncSchema(); // ⚠️Don't use this in production
  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  


  console.error('Failed to start app:', err);
});