"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncSchema = exports.getORM = exports.initORM = void 0;
const postgresql_1 = require("@mikro-orm/postgresql");
const path_1 = __importDefault(require("path"));
let ORM = null;
const initORM = async () => {
    ORM = await postgresql_1.MikroORM.init({
        baseDir: path_1.default.resolve(__dirname, '..'),
        entities: ['./model/entities'],
        entitiesTs: ['./model/entities'],
        dbName: 'postgres',
        clientUrl: 'postgresql://postgres.sokupfsbxxztojihrpnm:[PASSWORD]@aws-0-us-east-2.pooler.supabase.com:5432/postgres',
        debug: true,
        schemaGenerator: {
            ignoreSchema: ['auth', 'storage', 'realtime', 'vault'],
        },
    });
};
exports.initORM = initORM;
const getORM = () => {
    if (!ORM) {
        throw new Error('ORM not initialized! Call initORM first.');
    }
    return ORM;
};
exports.getORM = getORM;
const syncSchema = async () => {
    const generator = (0, exports.getORM)().getSchemaGenerator();
    await generator.dropSchema();
    await generator.createSchema();
    await generator.updateSchema();
};
exports.syncSchema = syncSchema;
//# sourceMappingURL=db.js.map