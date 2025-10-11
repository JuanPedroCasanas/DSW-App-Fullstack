//IMPORTANTE QUE ESTEN PRIMERO
import 'reflect-metadata'
import 'dotenv/config';

//EXPRESS
import express, {Request, Response, NextFunction} from 'express';

//ORM
import { RequestContext } from '@mikro-orm/core'
import { initORM, getORM, syncSchema } from './orm/db'

//PASSPORT JWT
import passport from 'passport';
//CORS
import cors from 'cors'

//IMPORT RUTAS
import occupationRoutes from './routes/OccupationRoutes';
import AppointmentRoutes from './routes/AppointmentRoutes';
import ConsultingRoomRoutes from './routes/ConsultingRoomRoutes';
import ModuleRoutes from './routes/ModuleRoutes';
import PatientRoutes from './routes/PatientRoutes';
import ProfessionalRoutes from './routes/ProfessionalRoutes';
import LegalGuardianRoutes from './routes/LegalGuardianRoutes';
import UserRoutes from './routes/UserRoutes'
import { startingCode } from './startingCode';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cors({
    origin: 'http://localhost:3000', // <--- ¡MUY IMPORTANTE! Usa el puerto de Vite.
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));
const port = process.env.PORT|| 2000; //puse para que el puerto del back sea 2000 aunque no se que tan bien este

app.use((req: Request, res: Response, next: NextFunction) => {
    RequestContext.create(getORM().em, next);
});

//USO RUTAS
app.use('/Occupation', occupationRoutes);
app.use('/Appointment', AppointmentRoutes);
app.use('/ConsultingRoom', ConsultingRoomRoutes);
app.use('/Module', ModuleRoutes);
app.use('/Patient', PatientRoutes);
app.use('/User', UserRoutes);
app.use('/Professional', ProfessionalRoutes);
app.use('/LegalGuardian', LegalGuardianRoutes);




app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' })
});

async function start() {
  await initORM();
  await syncSchema(); // ⚠️Don't use this in production
  await startingCode(); //SACAR EN PRODUCCION
  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  


  console.error('Failed to start app:', err);
});