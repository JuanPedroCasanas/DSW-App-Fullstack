import { Request, Response } from 'express';
import { ProfessionalService } from '../services/ProfessionalService';
import { BaseHttpError } from '../utils/errors/BaseHttpError';
import { safeSerialize } from '../utils/helpers/safeSerialize';

export class ProfessionalController {

    static async addProfessional(req: Request, res: Response) {
        const { firstName, lastName, telephone, mail, password, idOccupation } = req.body;

        try {
            const professional = await ProfessionalService.addProfessional(
                firstName,
                lastName,
                telephone,
                mail,
                password,
                idOccupation
            );

            return res.status(201).json({
                message: 'Se agrego correctamente el profesional ',
                professional: safeSerialize(professional, ['user', 'occupation', 'healthInsurances', 'modules', 'appointments'])
            });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error al crear el profesional' });
        }
    }

    static async updateProfessional(req: Request, res: Response) {
        const { idProfessional, firstName, lastName, telephone } = req.body;

        try {
            const professional = await ProfessionalService.updateProfessional(
                idProfessional,
                firstName,
                lastName,
                telephone
            );

            return res.status(201).json({
                message: 'Profesional actualizado correctamente:',
                professional: safeSerialize(professional, ['user', 'occupation', 'healthInsurances', 'modules', 'appointments'])
            });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error al actualizar el profesional' });
        }
    }

    static async allowHealthInsurance(req: Request, res: Response) {
        const { idProfessional, idHealthInsurance } = req.body;

        try {
            const professional = await ProfessionalService.allowHealthInsurance(
                idProfessional,
                idHealthInsurance
            );

            return res.status(201).json({
                message: 'Se agrego correctamente la obra social al profesional ',
                professional: safeSerialize(professional)
            });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error al agregar obra social al profesional' });
        }
    }

    static async forbidHealthInsurance(req: Request, res: Response) {
        const { idProfessional, idHealthInsurance } = req.body;

        try {
            const professional = await ProfessionalService.forbidHealthInsurance(
                idProfessional,
                idHealthInsurance
            );

            return res.status(201).json({
                message: 'Se elimino correctamente  la obra social al profesional: ',
                professional: safeSerialize(professional)
            });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error al eliminar obra social del profesional' });
        }
    }

    static async getProfessional(req: Request, res: Response) {
        const idProfessional = Number(req.params.idProfessional);

        try {
            const professional = await ProfessionalService.getProfessional(idProfessional);
            return res.status(200).json(safeSerialize(professional));
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error al buscar el profesional' });
        }
    }

    static async getProfessionals(req: Request, res: Response) {
        const includeInactive =
            req.query.includeInactive === undefined
                ? true
                : req.query.includeInactive === 'true';

        try {
            const professionals = await ProfessionalService.getProfessionals(includeInactive);
            return res.status(200).json(safeSerialize(professionals));
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar los profesionales' });
        }
    }

    static async getProfessionalsIncludeHealthInsurances(req: Request, res: Response) {
        const includeInactive =
            req.query.includeInactive === undefined
                ? true
                : req.query.includeInactive === 'true';

        try {
            const professionals = await ProfessionalService.getProfessionalsIncludeHealthInsurances(includeInactive);
            return res.status(200).json(safeSerialize(professionals));
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar los profesionales' });
        }
    }

    static async getProfessionalsByOccupation(req: Request, res: Response) {
        const idOccupation = Number(req.params.idOccupation);
        const includeInactive =
            req.query.includeInactive === undefined
                ? true
                : req.query.includeInactive === 'true';

        try {
            const professionals = await ProfessionalService.getProfessionalsByOccupation(
                idOccupation,
                includeInactive
            );

            return res.status(200).json(safeSerialize(professionals));
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error al buscar profesionales por especialidad' });
        }
    }

    static async deleteProfessional(req: Request, res: Response) {
        const idProfessional = Number(req.params.idProfessional);

        try {
            const professional = await ProfessionalService.deleteProfessional(idProfessional);

            return res.status(201).json({
                message: 'Se elimino correctamente el profesional ',
                professional: safeSerialize(professional, ['user', 'occupation', 'healthInsurances', 'modules', 'appointments'])
            });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error al eliminar el profesional' });
        }
    }
}
