import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { Professional } from '../model/entities/Professional';
import { Occupation } from '../model/entities/Occupation'; 
import { createUserData } from '../utils/helpers/createUserData';
import { User } from '../model/entities/User';
import { BaseHttpError, EntityAlreadyExistsError, NotFoundError } from '../model/errors/BaseHttpError';
import { AppointmentStatus } from '../model/enums/AppointmentStatus';
import { ModuleStatus } from '../model/enums/ModuleStatus';
import { HealthInsurance } from '../model/entities/HealthInsurance';
import { safeSerialize } from '../utils/helpers/safeSerialize';
export class ProfessionalController {

    static async addProfessional(req: Request, res: Response) {
        const { firstName, lastName, telephone, mail, password, idOccupation} = req.body;

        try {            
            
            const em = await getORM().em.fork();
            let occupation = await em.findOne(Occupation, { id : idOccupation });
            if(!occupation) {
                    throw new NotFoundError('Especialidad')
            }
            //Atencion a todo este segmento de código porque asi se  crean los usuarios, se persiste
            //solamente el usuario y eso persiste el profesional, ver anotacion de Cascade dentro de la clase usuario
            const professional = new Professional(firstName, lastName, telephone, occupation);
            const profUser: User = await createUserData(mail, password);
            
            professional.user = profUser;
            profUser.professional = professional
            
            await em.persistAndFlush(profUser);
            return res.status(201).json({ message: 'Se agrego correctamente el profesional ', professional: safeSerialize(professional, ['user', 'occupation', 'healthInsurances', 'modules', 'appointments']) });
       
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al crear el profesional' });
            }
        }
    }
    
    static async updateProfessional(req: Request, res: Response) {
        const {idProfessional, firstName, lastName, telephone} = req.body;

        try {

            const em = await getORM().em.fork();
            const professional = await em.findOne(Professional, {id: idProfessional});

            if(!professional|| !professional?.isActive)
            {
                throw new NotFoundError('Profesional');
            }

            professional.firstName = firstName;
            professional.lastName = lastName;
            professional.telephone = telephone;

            await em.flush();
            return res.status(201).json({ message: 'Profesional actualizado correctamente:', professional: safeSerialize(professional, ['user', 'occupation', 'healthInsurances', 'modules', 'appointments'])});

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al actualizar el profesional' });
            }
        }
    }

    static async allowHealthInsurance(req: Request, res: Response) {
        const { idProfessional, idHealthInsurance } = req.body;

        try {
            const em = await getORM().em.fork();
            const professional = await em.findOne(Professional, { id : idProfessional }, {populate: ["healthInsurances"]});
            if(!professional || !professional?.isActive) {
                throw new NotFoundError('Profesional');
            }
            const healthInsurance = await em.findOne(HealthInsurance, { id : idHealthInsurance });
            if(!healthInsurance) {
                throw new NotFoundError('Obra Social');
            }
            if(professional.healthInsurances.contains(healthInsurance)) {
                throw new EntityAlreadyExistsError("Obra social");
            }

            professional.healthInsurances.add(healthInsurance);

            em.flush();

            return res.status(201).json({ message: `Se agrego correctamente la obra social ${healthInsurance.name} al profesional `, professional: safeSerialize(professional) });

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al agregar obra social al profesional' });
            }
        }
    }

    static async forbidHealthInsurance(req: Request, res: Response) {
        const { idProfessional, idHealthInsurance } = req.body;

        try {
            const em = await getORM().em.fork();
            const professional = await em.findOne(Professional, { id : idProfessional }, {populate: ["healthInsurances"]});
            if(!professional || !professional?.isActive) {
                throw new NotFoundError('Profesional');
            }
            const healthInsurance = await em.findOne(HealthInsurance, { id : idHealthInsurance });

            if(!healthInsurance) {
                throw new NotFoundError('Obra Social');
            }

            if(!professional.healthInsurances.contains(healthInsurance)) {
                throw new NotFoundError('Obra Social');
            }

            professional.healthInsurances.remove(healthInsurance);

            em.flush();

            return res.status(201).json({ message: `Se elimino correctamente  la obra social ${healthInsurance.name} al profesional: `, professional: safeSerialize(professional) });

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al eliminar obra social del profesional' });
            }
        }
    }

    static async getProfessional(req: Request, res: Response) {
        const idProfessional = Number(req.params.idProfessional);

        try {
            const em = await getORM().em.fork();
            const professional = await em.findOne(Professional, { id: idProfessional });
            if (!professional || !professional?.isActive) {
                throw new NotFoundError('Profesional');
            }
            return res.status(200).json(safeSerialize(professional));
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al buscar el profesional' });
            }
        }
    }

    static async getProfessionals(req: Request, res: Response) {
        let includeInactive:boolean;

        if (req.query.includeInactive === undefined) {
            includeInactive = true;
        } else {
            includeInactive = req.query.includeInactive === 'true'; 
            // true si el string es 'true', false si es cualquier otra cosa
        }

        try {
            const em = await getORM().em.fork();
            const whereCondition = (includeInactive) ? {} : {isActive: true};
            const professionals = await em.find(Professional, whereCondition, {
                populate: ["occupation"], // Para devolver el objeto entero de occupation al front
            });
            return res.status(200).json(safeSerialize(professionals));

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar los profesionales' });
        }
    }

    static async getProfessionalsIncludeHealthInsurances(req: Request, res: Response) {
        let includeInactive:boolean;
        if (req.query.includeInactive === undefined) {
            includeInactive = true;
        } else {
            includeInactive = req.query.includeInactive === 'true'; 
            // true si el string es 'true', false si es cualquier otra cosa
        }
        try {
            const em = await getORM().em.fork();
            const whereCondition = (includeInactive) ? {} : {isActive: true};
            const professionals = await em.find(Professional, whereCondition, {
                populate: ["occupation", "healthInsurances"],
            });
            return res.status(200).json(safeSerialize(professionals));

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar los profesionales' });
        }
    }

    static async getProfessionalsByOccupation(req: Request, res: Response) {
        const idOccupation = Number(req.params.idOccupation);

        let includeInactive:boolean;
        if (req.query.includeInactive === undefined) {
            includeInactive = true;
        } else {
            includeInactive = req.query.includeInactive === 'true'; 
            // true si el string es 'true', false si es cualquier otra cosa
        }


    try {
        const em = await getORM().em.fork();
        const occupation = await em.findOne(Occupation, { id: idOccupation });
        if(!occupation) {
            throw new NotFoundError('Especialidad');
        }
        const whereCondition = (includeInactive) ? { occupation :  occupation } : { occupation :  occupation, isActive: true };
        const professionals = await em.find(Professional, whereCondition, {
                populate: ["occupation"], // Para devolver el objeto entero de occupation al front
            });
        return res.status(200).json(safeSerialize(professionals));
    } catch (error) {
        console.error(error);
        if (error instanceof BaseHttpError) {
            return res.status(error.status).json(error.toJSON());
        }
        else {
            return res.status(500).json({ message: 'Error al buscar profesionales por especialidad' });
        }
    }
}

    static async deleteProfessional(req: Request, res: Response) {
        const idProfessional = Number(req.params.idProfessional);

        try {

            const em = await getORM().em.fork();
            const professional = await em.findOne(Professional, { id : idProfessional });

            if (!professional || !professional?.isActive) {
                throw new NotFoundError('Profesional');
            }

            professional.isActive = false;
            professional.user.isActive = false;


            await professional.appointments.init();
            await professional.modules.init();

            for(const appointment of professional.appointments) {
                appointment.status = AppointmentStatus.Canceled;
            }

            for(const module of professional.modules) {
                module.status = ModuleStatus.Canceled;
            }

            await em.flush();

            return res.status(201).json({ message: 'Se elimino correctamente el profesional ', professional: safeSerialize(professional, ['user', 'occupation', 'healthInsurances', 'modules', 'appointments']) });


        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al eliminar el profesional' });
            }
        }
    }
}