"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//IMPORTANTE QUE ESTEN PRIMERO
require("reflect-metadata");
require("dotenv/config");
//EXPRESS
const express_1 = __importDefault(require("express"));
//ORM
const core_1 = require("@mikro-orm/core");
const db_1 = require("./orm/db");
//CORS
const cors_1 = __importDefault(require("cors"));
//IMPORT RUTAS
const OccupationRoutes_1 = __importDefault(require("./routes/OccupationRoutes"));
const AppointmentRoutes_1 = __importDefault(require("./routes/AppointmentRoutes"));
const ConsultingRoomRoutes_1 = __importDefault(require("./routes/ConsultingRoomRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const port = process.env.PORT;
app.use((req, res, next) => {
    core_1.RequestContext.create((0, db_1.getORM)().em, next);
});
//USO RUTAS
app.use('/Occupation', OccupationRoutes_1.default);
app.use('/Appointment', AppointmentRoutes_1.default);
app.use('/ConsultingRoom', ConsultingRoomRoutes_1.default);
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