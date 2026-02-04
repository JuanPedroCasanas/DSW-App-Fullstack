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

//IMPORT SWAGGER UI
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

//IMPORT RUTAS
import occupationRoutes from './routes/OccupationRoutes';
import AppointmentRoutes from './routes/AppointmentRoutes';
import ConsultingRoomRoutes from './routes/ConsultingRoomRoutes';
import ModuleRoutes from './routes/ModuleRoutes';
import PatientRoutes from './routes/PatientRoutes';
import ProfessionalRoutes from './routes/ProfessionalRoutes';
import LegalGuardianRoutes from './routes/LegalGuardianRoutes';
import UserRoutes from './routes/UserRoutes'
import HealthInsuranceRoutes from './routes/HealthInsuranceRoutes';
import cookieParser from 'cookie-parser';
import path from 'path';
// para evitar conversion de fechas UTC
Date.prototype.toJSON = function() {
   const year = this.getFullYear(); 
   const month = String(this.getMonth() + 1).padStart(2, '0'); 
   const day = String(this.getDate()).padStart(2, '0'); 
   const hours = String(this.getHours()).padStart(2, '0'); 
   const minutes = String(this.getMinutes()).padStart(2, '0'); 
   const seconds = String(this.getSeconds()).padStart(2, '0'); 
   
   return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`; 
  
};

const app = express();
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de mi Proyecto',
      version: '1.0.0',
      description: 'Aquí está la lista de todo lo que hace mi servidor',
    },
    servers: [
      {
        url: 'http://localhost:2000', 
      },
    ],
  },
  apis: ['./src/routes/*.ts'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

const frontend_url = process.env.FRONTEND_URL;

// probar con * con origin si llega a dar inconvenientes
// * -> que se pueda consumir de cualquier lado
// no hay que dejarlo para rendir !!
app.use(cors({
    origin: "http://localhost:3000", // <--- MUY IMPORTANTE! Usa el puerto de Vite.
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: true, // permite enviar credenciales en cookies, se usara para regularidad
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));

const port = process.env.PORT || 2000; //puse para que el puerto del back sea 2000 aunque no se que tan bien este
console.log(port);

app.use((req: Request, res: Response, next: NextFunction) => {
    RequestContext.create(getORM().em, next);
});


//USO RUTAS
app.use('/occupation', occupationRoutes);
app.use('/appointment', AppointmentRoutes);
app.use('/consultingRoom', ConsultingRoomRoutes);
app.use('/module', ModuleRoutes);
app.use('/patient', PatientRoutes);
app.use('/user', UserRoutes);
app.use('/professional', ProfessionalRoutes);
app.use('/legalGuardian', LegalGuardianRoutes);
app.use('/healthInsurance', HealthInsuranceRoutes);



app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' })
});

async function start() {
  await initORM();
  
  // descomentar estas dos líneas para que la bd se resete
 // await syncSchema(); // ⚠️Don't use this in production - resetea la bddddd
 // await startingCode(); //SACAR EN PRODUCCION
  //await testCode(); //SACAR EN PRODUCCION

  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  

  console.error('Failed to start app:', err);
});

/*
export default async function handler(req: any, res: any) {
  try {
    await initORM(); // asegura conexión activa
    app(req, res);
  } catch (err) {
    console.error('Error en handler:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}*/