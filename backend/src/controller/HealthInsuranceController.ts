import { Request, Response } from 'express';
import { HealthInsuranceService } from '../services/HealthInsuranceService';
import { BaseHttpError } from '../utils/errors/BaseHttpError';
import { safeSerialize } from '../utils/helpers/safeSerialize';

export class HealthInsuranceController {
    static async addHealthInsurance(req: Request, res: Response) {
        const { name } = req.body;
        try {
            const healthInsurance = await HealthInsuranceService.addHealthInsurance(name);

            return res.status(201).json({
                message: 'Obra social añadida: ',
                healthInsurance
            });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al actualizar Obra Social' });
            }
        }
    }
    
    static async updateHealthInsurance(req: Request, res: Response) {
        const { idHealthInsurance, name } = req.body;

        try {
            const healthInsurance = await HealthInsuranceService.updateHealthInsurance(
                idHealthInsurance,
                name
            );

            return res.status(200).json({
                message: 'Obra social actualizada: ',
                healthInsurance
            });

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al actualizar Obra Social' });
            }
        }
    }

    static async getHealthInsurance(req: Request, res: Response) {
        const idHealthInsurance = Number(req.params.idHealthInsurance);
        try {
            const healthInsurance = await HealthInsuranceService.getHealthInsurance(idHealthInsurance);

            return res.status(200).json(healthInsurance);
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al buscar Obra Social' });
            }
        }
    }

    static async getAllHealthInsurances(req: Request, res: Response) {
        let includeInactive:boolean;

        if (req.query.includeInactive === undefined) {
            includeInactive = true;
        } else {
            includeInactive = req.query.includeInactive === 'true'; 
        }

        try {
            const healthInsurances = await HealthInsuranceService.getAllHealthInsurances(includeInactive);
            
            return res.status(200).json(healthInsurances);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar Obras Sociales' });
        }
    }
    
    static async getHealthInsuranceByProfessional (req:Request, res: Response) {
        const idProfessional = Number(req.params.idProfessional);

        let includeInactive:boolean;
        if (req.query.includeInactive === undefined) {
            includeInactive = true;
        } else {
            includeInactive = req.query.includeInactive === 'true'; 
        }

        try {
            const healthInsurances =
                await HealthInsuranceService.getHealthInsuranceByProfessional(
                    idProfessional,
                    includeInactive
                );

            return res.status(200).json(safeSerialize(healthInsurances));
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            } else {
                return res.status(500).json({ message: 'Error al buscar obras sociales del profesional' });
            }
        }
    }

    static async deleteHealthInsurance(req: Request, res: Response) {
        const idHealthInsurance = Number(req.params.idHealthInsurance);
        try {
            const healthInsurance = await HealthInsuranceService.deleteHealthInsurance(idHealthInsurance);

            return res.status(200).json({
                message: 'Obra social eliminada ',
                healthInsurance
            }); 

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al eliminar Obra Social' });
            }
        }
    }
}
