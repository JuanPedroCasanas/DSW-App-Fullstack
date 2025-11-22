import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { LegalGuardian } from '../model/entities/LegalGuardian';
import { HealthInsurance } from '../model/entities/HealthInsurance';
import { User } from '../model/entities/User';
import { createUser } from '../services/UserCreationService';
import { BaseHttpError, NotFoundError } from '../model/errors/BaseHttpError';
import { AppointmentStatus } from '../model/enums/AppointmentStatus';
import { safeSerialize } from '../utils/safeSerialize';
export class LegalGuardianController {

    static home(req: Request, res: Response) {
        return res.send('Soy el controlador de Responsable Legal!');
    }

    static async addLegalGuardian(req: Request, res: Response) {
        const { firstName, lastName, birthdate, telephone, mail, password, idHealthInsurance} = req.body;

        try {         
            const em = await getORM().em.fork();   
            let healthInsurance: HealthInsurance | undefined;
            healthInsurance = await em.findOne(HealthInsurance, { id : idHealthInsurance }) ?? undefined;

            if(!healthInsurance) {
                throw new NotFoundError("Obra social");
            }
        
            const legalGuardian = new LegalGuardian(firstName, lastName, birthdate, telephone, healthInsurance);
            const lgUser: User = await createUser(mail, password);
            legalGuardian.user = lgUser;
            lgUser.legalGuardian = legalGuardian;
                    
            await em.persistAndFlush(lgUser);
            return res.status(201).json({ message: 'Se agrego correctamente el responsable legal ', legalGuardian: safeSerialize(legalGuardian) });
            
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al crear responsable legal' });
            }
        }
                
    }

    static async updateLegalGuardian(req: Request, res: Response) {
        const { idLegalGuardian } = req.body;
        const { firstName } = req.body;
        const { lastName } = req.body;
        const { birthdate } = req.body;   
        const { telephone } = req.body;
        const { idHealthInsurance } = req.body;

        
        const em = await getORM().em.fork();
        const legalGuardian = await em.findOne(LegalGuardian, {id: idLegalGuardian});

            try {
            if(!legalGuardian|| !legalGuardian?.isActive)
            {
                throw new NotFoundError('Responsable Legal');
            }

            legalGuardian.firstName = firstName;
            legalGuardian.lastName = lastName;
            legalGuardian.birthdate = birthdate;
            legalGuardian.telephone = telephone;
        

            const healthInsurance = await em.findOne(HealthInsurance, {id: idHealthInsurance});

            if(!healthInsurance) {
                    throw new NotFoundError("Obra social");
            }

            legalGuardian.healthInsurance = healthInsurance;
            await em.flush();

            return res.status(201).json({ message: 'Responsable Legal actualizado correctamente', legalGuardian: safeSerialize(legalGuardian) });

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al actualizar responsable legal' });
            }
        }
    }

    static async getLegalGuardians(req: Request, res: Response) {
        let includeInactive:boolean;
        if (!req.query || req.query.includeInactive === undefined) {
            includeInactive = true;
        } else {
            includeInactive = req.query.includeInactive === 'true'; 
            // true si el string es 'true', false si es cualquier otra cosa
        }

        try {
            const em = await getORM().em.fork();
            const whereCondition = (includeInactive) ? {} : {isActive: true};
            const legalGuardians = await em.find(LegalGuardian, whereCondition);
            return res.status(200).json(safeSerialize(legalGuardians));
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar responsables legales' });
        }
    }

    static async getLegalGuardian(req: Request, res: Response) {
        const idLegalGuardian = Number(req.params.idLegalGuardian);

        try {
            const em = await getORM().em.fork();
            const legalGuardian = await em.findOne(LegalGuardian, { id: idLegalGuardian });
            if (!legalGuardian|| !legalGuardian?.isActive) {
                throw new NotFoundError('Responsable Legal')
            }
            return res.status(200).json(safeSerialize(legalGuardian));
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al buscar responsable legal' });
            }
        }
    }

    static async deleteLegalGuardian(req: Request, res: Response) {
        const idLegalGuardian = Number(req.params.idLegalGuardian);

        try {

            const em = await getORM().em.fork();
            const legalGuardian = await em.findOne(LegalGuardian, { id : idLegalGuardian });

            if (!legalGuardian|| !legalGuardian?.isActive) {
                throw new NotFoundError('Responsable Legal');
            }

            legalGuardian.isActive = false;
            legalGuardian.user.isActive = false;
            await legalGuardian.guardedPatients.init(); // Las colecciones entiendo son lazy loaded, espero a que carguen
            for (const patient of legalGuardian.guardedPatients) {
                patient.isActive = false;
            }

            await legalGuardian.appointments.init();
            for (const appointment of legalGuardian.appointments) {
                appointment.status = AppointmentStatus.Canceled;
            }

            await em.flush();
            
            return res.status(201).json({message: 'Se eliminó correctamente el responsable legal', legalGuardian: safeSerialize(legalGuardian)});
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al eliminar responsable legal' });
            }
        }
    }


}
