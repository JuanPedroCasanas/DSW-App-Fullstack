import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { LegalGuardian } from '../model/entities/LegalGuardian';
import { HealthInsurance } from '../model/entities/HealthInsurance';
import { User } from '../model/entities/User';
import { createUser } from '../services/UserCreationService';
export class LegalGuardianController {

    static home(req: Request, res: Response) {
        res.send('Soy el controlador de Responsable Legal!');
    }

    static async addLegalGuardian(req: Request, res: Response) {
        const { name, lastName, birthdate, telephone, mail, password, idhealthInsurance} = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        if (!lastName) {
            return res.status(400).json({ message: 'Last name is required' });
        }
        if (!birthdate) {
            return res.status(400).json({ message: 'Birthdate is required' });
        }   
        if (!telephone) {
            return res.status(400).json({ message: 'Telephone is required' });
        }
        if (!mail) {
            return res.status(400).json({ message: 'Mail is required' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }
        
        if (!idhealthInsurance) {
            return res.status(400).json({ message: 'Health Insurance is required' });
        }

        try {            
            let healthInsurance: HealthInsurance | undefined;
            const em = await getORM().em.fork();
            if(healthInsurance) {
                const healthInsuranceIdNum = Number(healthInsurance);
                healthInsurance = await em.findOne(HealthInsurance, { idHealthInsurance : healthInsuranceIdNum }) ?? undefined;
                if(!healthInsurance) {
                    return res.status(404).json({ message: 'Invalid Health Insurance ID.' });
                }
            }
        const legalguardian = new LegalGuardian(name, lastName, birthdate, telephone, idhealthInsurance);
        const lgUser: User = await createUser(mail, password);
                legalguardian.user = lgUser;
                lgUser.legalGuardian = legalguardian;
                
                await em.persistAndFlush(lgUser);
                res.status(201).json({ message: 'Se agrego correctamente el responsable legal ', legalguardian });
        
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ message: 'Error al añadir el responsable legal' });
                }
            
    }

    static async updateLegalGuardian(req: Request, res: Response) {
        const { id } = req.body;
        const { name } = req.body;
        const {lastName} = req.body;
        const {birthdate} = req.body;   
        const {telephone} = req.body;
        const {mail} = req.body;
        const {healthInsurance} = req.body;

        if(!id)
        {
            return res.status(400).json({ message: 'LegalGuardian id is required' });
        }
        if(!name)
        {
            return res.status(400).json({ message: 'Legal Guardian new name is required' });
        }
        if(!lastName)
        {
            return res.status(400).json({ message: 'Legal Guardian new last name is required' });
        }
        if(!birthdate)
        {
            return res.status(400).json({ message: 'Legal Guardian new birthdate is required' });
        }
        if(!telephone)
        {
            return res.status(400).json({ message: 'Legal Guardian new telephone is required' });
        }
        if(!mail)
        {
            return res.status(400).json({ message: 'Legal Guardian new mail is required' });
        }
        if(!healthInsurance)
        {
            return res.status(400).json({ message: 'Legal Guardian new health insurance is required' });
        }
        
        const em = await getORM().em.fork();
        const legalguardian = await em.findOne(LegalGuardian, {idLegalGuardian: id});

        if(!legalguardian)
        {
            return res.status(400).json({ message: 'Legal Guardian not found' });
        }

        legalguardian.firstName = name;
        legalguardian.lastName = lastName;
        legalguardian.birthdate = birthdate;
        legalguardian.telephone = telephone;
      

        const healthinsurance = await em.findOne(HealthInsurance, {idHealthInsurance: healthInsurance});

        await em.persistAndFlush(LegalGuardian);

        res.status(201).json({ message: 'Legal Guardian updated', LegalGuardian });
    }

    static async getLegalGuardian(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).json({ message: 'LegalGuardian id is required' });
        }
        try {
            const em = await getORM().em.fork();
            const legalguardian = await em.findOne(LegalGuardian, { idLegalGuardian: id });
            if (!legalguardian) {
            return res.status(404).json({ message: 'Legal Guardian not found' });
            }
            res.json(LegalGuardian);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch Legal Guardian' });
        }
    }

    /*static async getLegalGuardian(req: Request, res: Response) {  por ahora no veo necesario este metodo
        try {
            const em = await getORM().em.fork();
            const Patients = await em.find(LegalGuardian, {});
            res.json(Patients);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch Patients' });
        }
    }
*/
    static async deleteLegalGuardian(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Legal Guardian id is required' });
        }
        try {

            const em = await getORM().em.fork();
            const legalguardian = await em.findOne(LegalGuardian, { idLegalGuardian : id });

            if (!legalguardian) {
                return res.status(404).json({ message: 'Legal Guardian not found' });
            }

            await em.removeAndFlush(legalguardian);
            res.json(legalguardian);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete Legal Guardian' });
        }
    }


}
