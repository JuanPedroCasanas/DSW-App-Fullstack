import { Request, Response } from 'express';
import { AppointmentService } from '../services/AppointmentService';
import { BaseHttpError } from '../utils/errors/BaseHttpError';
import { safeSerialize } from '../utils/helpers/safeSerialize';

export class AppointmentController {

    static async assignAppointment(req: Request, res: Response) {
        const { idAppointment, idPatient } = req.body;
        try {
            const appointment = await AppointmentService.assignAppointment(idAppointment, idPatient);

            return res.status(200).json({
                message: 'Se asigno correctamente el paciente al turno',
                appointment: safeSerialize(appointment)
            });

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al asignar turno' });
            }
        }
    }

    //Solo los profesionales pueden completar turnos
    static async updateAppointmentStatus(req: Request, res: Response) {
        const { idAppointment, status } = req.body;

        try {
            const appointment = await AppointmentService.updateAppointmentStatus(idAppointment, status);

            return res.status(201).json({
                message: 'El estado del turno se actualizó correctamente',
                appointment: safeSerialize(appointment)
            });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error completar turno' });
            }
        }
    }


    static async getAppointment(req: Request, res: Response) {
        const idAppointment = Number(req.params.idAppointment);
        try {
            const appointment = await AppointmentService.getAppointment(idAppointment);

            return res.status(200).json(safeSerialize(appointment));
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al buscar el turno' });
            }
        }
    }

    static async getAppointments(req: Request, res: Response) {
        try {
            const appointments = await AppointmentService.getAppointments();

            return res.status(200).json(safeSerialize(appointments));
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar los turnos' });
        }
    }

    static async getAvailableAppointments(req: Request, res: Response) {
        try {
            const appointments = await AppointmentService.getAvailableAppointments();

            return res.status(200).json(safeSerialize(appointments));
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar los turnos' });
        }
    }

    static async getAppointmentsByPatient(req: Request, res: Response) {
        const idPatient = Number(req.params.idPatient);
        try {
            const appointments = await AppointmentService.getAppointmentsByPatient(idPatient);

            return res.status(200).json(appointments);
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al buscar turnos por paciente' });
            }
        }
    }

    static async getAvailableAppointmentsByProfessional(req: Request, res: Response) {
        const idProfessional = Number(req.params.idProfessional);

        try {
            const appointments = await AppointmentService.getAvailableAppointmentsByProfessional(idProfessional);

            return res.json(safeSerialize(appointments));
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar los turnos' });
        }
    }

    static async getScheduledAppointments(req: Request, res: Response) {
        try {
            const appointments = await AppointmentService.getScheduledAppointments();

            return res.status(200).json(safeSerialize(appointments));
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar los turnos' });
        }
    }

    static async getAppointmentsByStatus(req: Request, res: Response) {
        try {
            const raw = (req.query.status ?? '').toString().trim();
            const status = raw.toLowerCase();

            const appointments = await AppointmentService.getAppointmentsByStatus(status);

            return res.status(200).json(safeSerialize(appointments));
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al buscar los profesionales' });
            }
        }
    }
}
