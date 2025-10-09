"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegalGuardianController = void 0;
const db_1 = require("../orm/db");
const LegalGuardian_1 = require("../model/entities/LegalGuardian");
class LegalGuardianController {
    static home(req, res) {
        res.send('Soy el controlador de Responsable Legal!');
    }
    static async addLegalGuardian(req, res) {
        const { firstName, lastName, birthdate, telephone, mail, appointments } = req.body;
        if (!firstName) {
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
        try {
            const legalGuardian = new LegalGuardian_1.LegalGuardian(firstName, lastName, new Date(birthdate), telephone, mail);
            const em = await (0, db_1.getORM)().em.fork();
            await em.persistAndFlush(LegalGuardian_1.LegalGuardian);
            res.status(201).json({ message: 'Legal Guardian added', LegalGuardian: LegalGuardian_1.LegalGuardian });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add Legal Guardian' });
        }
    }
    static async updateLegalGuardian(req, res) {
        const { id } = req.body;
        const { name } = req.body;
        const { lastName } = req.body;
        const { birthdate } = req.body;
        const { telephone } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'LegalGuardian id is required' });
        }
        if (!name) {
            return res.status(400).json({ message: 'Legal Guardian new name is required' });
        }
        if (!lastName) {
            return res.status(400).json({ message: 'Legal Guardian new last name is required' });
        }
        if (!birthdate) {
            return res.status(400).json({ message: 'Legal Guardian new birthdate is required' });
        }
        if (!telephone) {
            return res.status(400).json({ message: 'Legal Guardian new telephone is required' });
        }
        const em = await (0, db_1.getORM)().em.fork();
        const legalguardian = await em.findOne(LegalGuardian_1.LegalGuardian, { idLegalGuardian: id });
        if (!legalguardian) {
            return res.status(400).json({ message: 'Legal Guardian not found' });
        }
        legalguardian.firstName = name;
        legalguardian.lastName = lastName;
        legalguardian.birthdate = birthdate;
        legalguardian.telephone = telephone;
        await em.persistAndFlush(LegalGuardian_1.LegalGuardian);
        res.status(201).json({ message: 'Legal Guardian updated', LegalGuardian: LegalGuardian_1.LegalGuardian });
    }
    static async getLegalGuardian(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'LegalGuardian id is required' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const legalguardian = await em.findOne(LegalGuardian_1.LegalGuardian, { idLegalGuardian: id });
            if (!legalguardian) {
                return res.status(404).json({ message: 'Legal Guardian not found' });
            }
            res.json(LegalGuardian_1.LegalGuardian);
        }
        catch (error) {
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
    static async deleteLegalGuardian(req, res) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Legal Guardian id is required' });
        }
        try {
            const em = await (0, db_1.getORM)().em.fork();
            const legalguardian = await em.findOne(LegalGuardian_1.LegalGuardian, { idLegalGuardian: id });
            if (!legalguardian) {
                return res.status(404).json({ message: 'Legal Guardian not found' });
            }
            await em.removeAndFlush(legalguardian);
            res.json(legalguardian);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete Legal Guardian' });
        }
    }
}
exports.LegalGuardianController = LegalGuardianController;
//# sourceMappingURL=LegalGuardianController.js.map