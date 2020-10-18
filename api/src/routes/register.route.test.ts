import { expect } from 'chai';
import { agent as request } from 'supertest';
import dotenv from 'dotenv';
import { ConnectionOptions } from 'mysql';

import { Db } from '../db/db';
import { Server } from '../server/server';

/*tslint:disable: no-unused-expression */
describe('Register Route Test', () => {

    let server: Server;
    let db :Db;

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

    after((done) => {
        server.httpServer.close();
        done();
    });

    it('should register a new user and send back its info', async () => {
        const res = await request(server.app)
            .post('/register/new_user')
            .send({ 'nick': 'test_nick'});

        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.nick).to.be.equal('test_nick');
        expect(await db.ifUserIdExist(res.body.user_id)).to.be.true;
    });
});
