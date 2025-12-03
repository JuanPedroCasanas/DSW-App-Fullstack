import { MikroORM } from '@mikro-orm/postgresql'
import path from 'path'

let ORM: MikroORM | null = null;

export const initORM = async () => { 
    ORM = await MikroORM.init({
        baseDir: path.resolve(__dirname, '..'),
        entities: ['./model/entities'],
        entitiesTs: ['./model/entities'],
        dbName: 'postgres',
        clientUrl: process.env.DATABASE_URL,
        debug: true,

        //Configurado de esta manera ya que supabase cierra conexiones en idle (Porque usamos tier gratuito)
        //Lo que hacemos es cerrar antes nosotros la conexion y regenerar una nueva conexion desde mikroOrm
        pool: {
        min: 0,
        max: 10,
        idleTimeoutMillis: 8000,
        reapIntervalMillis: 1000,
        acquireTimeoutMillis: 5000,
        },

        schemaGenerator: {
            ignoreSchema: ['auth', 'storage', 'realtime', 'vault'],
        },

    })

    //Logs para saber si el pooling de conexiones esta funcionando correctamente
    const conn: any = ORM.em.getConnection();
    const knex = conn.getKnex();
    const pool = knex.client.pool;


    pool.on('createSuccess', (_id: any, resource: any) => {
        console.log('[POOL] Nueva conexión creada (pid):', resource.processID);
    });

    pool.on('destroySuccess', (_id: any, resource: any) => {
        console.log('[POOL] Conexión destruida (pid):', resource.processID);
    });

    pool.on('acquireSuccess', (_id: any, resource: any) => {
        console.log('[POOL] Conexión adquirida (pid):', resource.processID);
    });

    pool.on('release', (_id: any, resource: any) => {
        console.log('[POOL] Conexión liberada (pid):', resource.processID);
    });
}

export const getORM = () => {
    if (!ORM) {
    throw new Error('ORM not initialized! Call initORM first.');
    }
    return ORM;
}


export const syncSchema = async () => {
    const generator = getORM().getSchemaGenerator();
    
    await generator.dropSchema()
    await generator.createSchema()
    
    await generator.updateSchema()
}