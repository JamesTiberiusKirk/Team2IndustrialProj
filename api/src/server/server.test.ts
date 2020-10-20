import { expect } from 'chai';
import { agent as request } from 'supertest';
import dotenv from 'dotenv';
import { ConnectionOptions } from 'mysql';

import { Db } from '../db/db';
import { Server } from './server';

/*tslint:disable: no-unused-expression */
describe('Server Test', () => {

    let server: Server;
    let db: Db;

    before((done) => {

        dotenv.config();

        const dbConnectionOptions: ConnectionOptions = {
            host: process.env.TEST_DB_HOST,
            port: Number(process.env.TEST_DB_PORT),
            database: process.env.MYSQL_DATABASE,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
        }
        db = new Db(dbConnectionOptions);

        server = new Server({ port: '9999' }, db);
        server.initServer().then(() => {
            done();
        });
    });

    it('should GET /', async () => {
        const res = await request(server.app)
            .get('/');

        expect(res.status).to.equal(200);
        expect(res.text).not.to.be.empty;
        expect(res.text).to.be.equal('Hello World');
    });
});
