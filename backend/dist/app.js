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
//PASSPORT JWT
const passport_1 = __importDefault(require("passport"));
//CORS
const cors_1 = __importDefault(require("cors"));
//IMPORT RUTAS
const OccupationRoutes_1 = __importDefault(require("./routes/OccupationRoutes"));
const AppointmentRoutes_1 = __importDefault(require("./routes/AppointmentRoutes"));
const ConsultingRoomRoutes_1 = __importDefault(require("./routes/ConsultingRoomRoutes"));
const ModuleRoutes_1 = __importDefault(require("./routes/ModuleRoutes"));
const PatientRoutes_1 = __importDefault(require("./routes/PatientRoutes"));
const ProfessionalRoutes_1 = __importDefault(require("./routes/ProfessionalRoutes"));
const LegalGuardianRoutes_1 = __importDefault(require("./routes/LegalGuardianRoutes"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const HealthInsuranceRoutes_1 = __importDefault(require("./routes/HealthInsuranceRoutes"));
const startingCode_1 = require("./startingCode");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize());
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // <--- ¡MUY IMPORTANTE! Usa el puerto de Vite.
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));
const port = process.env.PORT || 2000; //puse para que el puerto del back sea 2000 aunque no se que tan bien este
app.use((req, res, next) => {
    core_1.RequestContext.create((0, db_1.getORM)().em, next);
});
//USO RUTAS
app.use('/Occupation', OccupationRoutes_1.default);
app.use('/Appointment', AppointmentRoutes_1.default);
app.use('/ConsultingRoom', ConsultingRoomRoutes_1.default);
app.use('/Module', ModuleRoutes_1.default);
app.use('/Patient', PatientRoutes_1.default);
app.use('/User', UserRoutes_1.default);
app.use('/Professional', ProfessionalRoutes_1.default);
app.use('/LegalGuardian', LegalGuardianRoutes_1.default);
app.use('/HealthInsurance', HealthInsuranceRoutes_1.default);
app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' });
});
async function start() {
    await (0, db_1.initORM)();
    // descomentar estas dos líneas para que la bd se resete
    await (0, db_1.syncSchema)(); // ⚠️Don't use this in production - resetea la bddddd
    await (0, startingCode_1.startingCode)(); //SACAR EN PRODUCCION
    //await testCode(); //SACAR EN PRODUCCION
    app.listen(port, () => {
        console.log(`App listening on http://localhost:${port}`);
    });
}
start().catch((err) => {
    console.error('Failed to start app:', err);
});
//# sourceMappingURL=app.js.map