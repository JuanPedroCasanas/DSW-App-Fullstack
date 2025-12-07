import { Request, Response } from 'express';
import { LegalGuardianService } from '../services/LegalGuardianService';
import { BaseHttpError } from '../model/errors/BaseHttpError';
import { safeSerialize } from '../utils/helpers/safeSerialize';

export class LegalGuardianController {

    static async addLegalGuardian(req: Request, res: Response) {
        const {
            firstName,
            lastName,
            birthdate,
            telephone,
            mail,
            password,
            idHealthInsurance
        } = req.body;

        try {
            const legalGuardian = await LegalGuardianService.addLegalGuardian(
                firstName,
                lastName,
                birthdate,
                telephone,
                mail,
                password,
                idHealthInsurance
            );

            return res.status(201).json({
                message: 'Se agrego correctamente el responsable legal ',
                legalGuardian: safeSerialize(legalGuardian)
            });

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
        const {
            idLegalGuardian,
            firstName,
            lastName,
            birthdate,
            telephone,
            idHealthInsurance
        } = req.body;

        try {
            const legalGuardian = await LegalGuardianService.updateLegalGuardian(
                idLegalGuardian,
                firstName,
                lastName,
                birthdate,
                telephone,
                idHealthInsurance
            );

            return res.status(201).json({
                message: 'Responsable Legal actualizado correctamente',
                legalGuardian: safeSerialize(legalGuardian)
            });

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
        }

        try {
            const legalGuardians = await LegalGuardianService.getLegalGuardians(includeInactive);

            return res.status(200).json(safeSerialize(legalGuardians));
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar responsables legales' });
        }
    }

    static async getLegalGuardian(req: Request, res: Response) {
        const idLegalGuardian = Number(req.params.idLegalGuardian);

        try {
            const legalGuardian = await LegalGuardianService.getLegalGuardian(idLegalGuardian);

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
            const legalGuardian = await LegalGuardianService.deleteLegalGuardian(idLegalGuardian);
            
            return res.status(201).json({
                message: 'Se eliminó correctamente el responsable legal',
                legalGuardian: safeSerialize(legalGuardian)
            });
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
