import { MikroORM } from '@mikro-orm/postgresql'
import path from 'path'

let ORM: MikroORM | null = null;

export const initORM = async () => { 
        ORM = await MikroORM.init({
        baseDir: path.resolve(__dirname, '..'),
        entities: ['./model/entities'],
        entitiesTs: ['./model/entities'],
        dbName: 'postgres',
        clientUrl: 'postgresql://postgres.sokupfsbxxztojihrpnm:PASSWORD@aws-0-us-east-2.pooler.supabase.com:5432/postgres',
        debug: true,
        schemaGenerator: {
            //TODO VERIFICAR
            disableForeignKeys: true,
            createForeignKeyConstraints: true,
            ignoreSchema: ['auth', 'storage', 'realtime', 'vault'],
        },
    })
}

export const getORM = () => {
    if (!ORM) {
    throw new Error('ORM not initialized! Call initORM first.');
    }
    return ORM;
}


export const syncSchema = async () => {
    const generator = getORM().getSchemaGenerator();
    /*
    await generator.dropSchema()
    await generator.createSchema()
    */
    await generator.updateSchema()
}