"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const core_1 = require("@mikro-orm/core");
const db_1 = require("./orm/db");
const cors_1 = __importDefault(require("cors"));
const Occupation_1 = require("./model/entities/Occupation");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const port = 3000;
app.use((req, res, next) => {
    core_1.RequestContext.create((0, db_1.getORM)().em, next);
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/addOccupation', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }
    try {
        const occupation = new Occupation_1.Occupation(name);
        await (0, db_1.getORM)().em.persistAndFlush(occupation);
        res.status(201).json({ message: 'Occupation added', occupation });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add occupation' });
    }
});
app.get('/getOccupations', async (req, res) => {
    try {
        const occupations = await (0, db_1.getORM)().em.find(Occupation_1.Occupation, {});
        res.json(occupations);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch occupations' });
    }
});
app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' });
});
async function start() {
    await (0, db_1.initORM)();
    await (0, db_1.syncSchema)(); // ⚠️Don't use this in production
    app.listen(port, () => {
        console.log(`App listening on http://localhost:${port}`);
    });
}
start().catch((err) => {
    console.error('Failed to start app:', err);
});
//# sourceMappingURL=app.js.map