import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { Professional } from '../model/entities/Professional';
import { Occupation } from '../model/entities/Occupation'; 
import { createUser } from '../services/UserCreationService';
import { User } from '../model/entities/User';
export class ProfessionalController {

    static home(req: Request, res: Response) {
        res.send('Soy el controlador de profesional!');
    }

    static async addProfessional(req: Request, res: Response) {
        const { name, lastName, birthdate, telephone, mail, password, occupation} = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Se requiere el nombre del profesional' });
        }
        if (!lastName) {
            return res.status(400).json({ message: 'Se requiere el apellido del profesional' });
        }
        if (!birthdate) {
            return res.status(400).json({ message: 'Se requiere la fecha de nacimiento del profesional' });
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
        if (!occupation){
            return res.status(400).json({message:'Se requiere la ocupación del profesional'});
        }

        try {            
            
            let occupation: Occupation | undefined;
            const em = await getORM().em.fork();
            if(occupation) {
                const occupationIdNum = Number(occupation);
                occupation = await em.findOne(Occupation, { id : occupationIdNum }) ?? undefined; //Si devuelve null lo paso a undefined para que no se queje TS
                if(!occupation) {
                    return res.status(404).json({ message: 'ID de la especialidad invalida.' });
                }
            }
        
        //Atencion a todo este segmento de código porque asi se  crean los usuarios, se persiste
        //solamente el usuario y eso persiste el profesional, ver anotacion de Cascade dentro de la clase usuario
        const professional = new Professional(name, lastName, birthdate, telephone, mail);
        const profUser: User = await createUser(mail, password);
        
        professional.user = profUser;
        profUser.professional = professional
        
        await em.persistAndFlush(profUser);
        res.status(201).json({ message: 'Se agrego correctamente el profesional ', professional });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al añadir el profesional' });
        }
    }
    
    static async updateProfessional(req: Request, res: Response) {
        const {id, name, lastName, birthdate, telephone, mail, occupation} = req.body;

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
        if (!birthdate) {
            return res.status(400).json({ message: 'Se requiere la fecha de nacimiento del profesional' });
        }   
        if (!telephone) {
            return res.status(400).json({ message: 'Se requiere el telefono del profesional' });
        }
        if (!mail) {
            return res.status(400).json({ message: 'Se requiere el email del profesional' });
        }
        if (!occupation){
            return res.status(400).json({message:'Se requiere la ocupación del profesional'});
        }

        const em = await getORM().em.fork();
        const professional = await em.findOne(Professional, {id: id});

        if(!professional)
        {
            return res.status(400).json({ message: 'No se encontró el profesional' });
        }

        professional.firstName = name;
        professional.lastName = lastName;
        professional.telephone = telephone;
        professional.email = mail;
        professional.occupation = occupation;

        await em.persistAndFlush(professional);

        res.status(201).json({ message: 'Professional updated', professional });
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
            return res.status(404).json({ message: 'No se encontró el profesional' });
            }
            res.json(professional);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'No se pudo recuperar el profesional' });
        }
    }

    static async getProfessionals(req: Request, res: Response) {
        try {
            const em = await getORM().em.fork();
            const professionals = await em.find(Professional, {});
            res.json(professionals);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'No se pudo recuperar los profesionales' });
        }
    }

    static async deleteProfessional(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Se requiere la id del profesional' });
        }
        try {

            const em = await getORM().em.fork();
            const profesional = await em.findOne(Professional, { id : id });

            if (!profesional) {
                return res.status(404).json({ message: 'No se pudo encontrar el profesional' });
            }

            await em.removeAndFlush(profesional);
            res.json(profesional);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'No se pudo eliminar el profesional' });
        }
    }
}