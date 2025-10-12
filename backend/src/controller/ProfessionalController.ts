import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { Professional } from '../model/entities/Professional';
import { Occupation } from '../model/entities/Occupation'; 
import { createUser } from '../services/UserCreationService';
import { User } from '../model/entities/User';
import { BaseHttpError, NotFoundError } from '../model/errors/BaseHttpError';
import { AppointmentStatus } from '../model/enums/AppointmentStatus';
import { ModuleStatus } from '../model/enums/ModuleStatus';
export class ProfessionalController {

    static home(req: Request, res: Response) {
        res.send('Soy el controlador de profesional!');
    }

    static async addProfessional(req: Request, res: Response) {
        const { name, lastName, birthdate, telephone, mail, password, occupationId} = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Se requiere el nombre del profesional' });
        }
        if (!lastName) {
            return res.status(400).json({ message: 'Se requiere el apellido del profesional' });
        }
        if (!telephone) {
            return res.status(400).json({ message: 'Se requiere el telefono del profesional' });
        }
        if (!mail) {
            return res.status(400).json({ message: 'Se requiere el email del profesional' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Se requiere una contraseña valida' });
        }
        if (!occupationId){
            return res.status(400).json({message:'Se requiere la Ide de la especialidad del profesional'});
        }

        try {            
            
            const em = await getORM().em.fork();
            let occupation = await em.findOne(Occupation, { id : occupationId });
            if(!occupation) {
                    throw new NotFoundError('Especialidad')
            }
            //Atencion a todo este segmento de código porque asi se  crean los usuarios, se persiste
            //solamente el usuario y eso persiste el profesional, ver anotacion de Cascade dentro de la clase usuario
            const professional = new Professional(name, lastName, telephone, occupation);
            const profUser: User = await createUser(mail, password);
            
            professional.user = profUser;
            profUser.professional = professional
            
            await em.persistAndFlush(profUser);
            res.status(201).json({ message: 'Se agrego correctamente el profesional ', professional });
       
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al crear el profesional' });
            }
        }
    }
    
    static async updateProfessional(req: Request, res: Response) {
        const {id, name, lastName, telephone} = req.body;

        if(!id)
        {
            return res.status(400).json({ message: 'Se requiere el id de profesional' });
        }
        if (!name) {
            return res.status(400).json({ message: 'Se requiere el nombre del profesional' });
        }
        if (!lastName) {
            return res.status(400).json({ message: 'Se requiere el apellido del profesional' });
        }
        if (!telephone) {
            return res.status(400).json({ message: 'Se requiere el telefono del profesional' });
        }

        try {

            const em = await getORM().em.fork();
            const professional = await em.findOne(Professional, {id: id});

            if(!professional)
            {
                throw new NotFoundError('Profesional');
            }

            professional.firstName = name;
            professional.lastName = lastName;
            professional.telephone = telephone;

            await em.flush();
            res.status(201).json({ message: 'Professional updated', professional });

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al actualizar el profesional' });
            }
        }
    }

    static async getProfessional(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).json({ message: 'Se requiere la id del profesional' });
        }
        try {
            const em = await getORM().em.fork();
            const professional = await em.findOne(Professional, { id: id });
            if (!professional) {
                throw new NotFoundError('Profesional');
            }
            res.json(professional);
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al buscar el profesional' });
            }
        }
    }

    static async getProfessionals(req: Request, res: Response) {
        try {
            const em = await getORM().em.fork();
            const professionals = await em.findAll(Professional);
            res.json(professionals);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al buscar los profesionales' });
        }
    }

    static async deleteProfessional(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Se requiere la id del profesional' });
        }

        try {

            const em = await getORM().em.fork();
            const professional = await em.findOne(Professional, { id : id });

            if (!professional) {
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

            res.json(professional);


        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al eliminar el profesional' });
            }
        }
    }
}