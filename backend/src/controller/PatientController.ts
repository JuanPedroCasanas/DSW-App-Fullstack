import { Request, Response } from 'express';
import { PatientService } from '../services/PatientService';
import { BaseHttpError } from '../utils/errors/BaseHttpError';
import { safeSerialize } from '../utils/helpers/safeSerialize';

export class PatientController {

    static async addIndependentPatient(req: Request, res: Response) {
        const { firstName, lastName, birthdate, password, telephone, mail, idHealthInsurance } = req.body;

        try {
            const patient = await PatientService.addIndependentPatient(
                firstName,
                lastName,
                birthdate,
                password,
                telephone,
                mail,
                idHealthInsurance
            );

            return res.status(201).json({
                message: 'Se agrego correctamente el paciente',
                patient: safeSerialize(patient)
            });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error al agregar el paciente' });
        }
    }

    static async addDependentPatient(req: Request, res: Response) {
        const { firstName, lastName, birthdate, idLegalGuardian } = req.body;

        try {
            const patient = await PatientService.addDependentPatient(
                firstName,
                lastName,
                birthdate,
                idLegalGuardian
            );

            return res.status(201).json({
                message: 'Se añadió correctamente al paciente',
                patient: safeSerialize(patient)
            });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error al agregar al paciente' });
        }
    }

    static async updateIndependentPatient(req: Request, res: Response) {
        const { idPatient, firstName, lastName, birthdate, telephone, idHealthInsurance } = req.body;

        try {
            const patient = await PatientService.updateIndependentPatient(
                idPatient,
                firstName,
                lastName,
                birthdate,
                telephone,
                idHealthInsurance
            );

            return res.status(201).json({
                message: 'Los datos del paciente fueron actualizados',
                patient: safeSerialize(patient)
            });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error al modificar el paciente' });
        }
    }

    static async updateDependentPatient(req: Request, res: Response) {
        const { idPatient, firstName, lastName, birthdate } = req.body;

        try {
            const patient = await PatientService.updateDependentPatient(
                idPatient,
                firstName,
                lastName,
                birthdate
            );

            return res.status(201).json({
                message: 'Los datos del paciente fueron actualizados',
                patient: safeSerialize(patient)
            });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error al modificar el paciente' });
        }
    }

    static async getPatient(req: Request, res: Response) {
        const idPatient = Number(req.params.idPatient);

        try {
            const patient = await PatientService.getPatient(idPatient);
            return res.status(200).json(safeSerialize(patient));
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error al buscar el paciente' });
        }
    }

    static async getPatients(req: Request, res: Response) {
        const includeInactive =
            req.query.includeInactive === undefined
                ? true
                : req.query.includeInactive === 'true';

        try {
            const patients = await PatientService.getPatients(includeInactive);
            return res.status(200).json(safeSerialize(patients));
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar los pacientes' });
        }
    }

    static async getByLegalGuardian(req: Request, res: Response) {
        const idLegalGuardian = Number(req.params.idLegalGuardian);
        const includeInactive =
            req.query?.includeInactive === undefined
                ? true
                : req.query.includeInactive === 'true';

        try {
            const patients = await PatientService.getByLegalGuardian(idLegalGuardian, includeInactive);
            return res.status(200).json(safeSerialize(patients));
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar los pacientes por responsable legal' });
        }
    }

    static async deletePatient(req: Request, res: Response) {
        const idPatient = Number(req.params.idPatient);

        try {
            const patient = await PatientService.deletePatient(idPatient);

            return res.status(200).json({
                message: 'Paciente dado de baja correctamente: ',
                patient: safeSerialize(patient)
            });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            return res.status(500).json({ message: 'Error al buscar el paciente' });
        }
    }
}
