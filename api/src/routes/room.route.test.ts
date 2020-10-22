import { expect } from 'chai';
import { agent as request } from 'supertest';
import dotenv from 'dotenv';
import { ConnectionOptions } from 'mysql';

import { Db } from '../db/db';
import { Server } from '../server/server';

/*tslint:disable: no-unused-expression */
describe('Room Route Test', () => {

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

    after((done) => {
        server.httpServer.close();
        done();
    });

    it('should create a room (+new user)', async () => {
        const newUserID: string = await db.newUser('testNickInRoom');
        expect(newUserID).to.not.be.empty;
        
        const res = await request(server.app)
            .post('/rooms/new_room')
            .set('user-id', newUserID)
            .send();

        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.room_key).to.not.be.empty;
        expect(res.body.room_key.length).to.eq(6);
    });

    it ('should join a room (+create room & user)', async () => {
        const newUserID: string = await db.newUser("testNickInRoom");
        expect(newUserID).to.not.be.empty;

        const roomKey: string = await db.newRoom();
        expect(roomKey.length).to.equal(6);

        const res = await request(server.app)
            .post('/rooms/join_room')
            .set('user-id', newUserID)
            .send({ 'room_key': String(roomKey) });

        expect(res.status).to.equal(200);
        expect(res.body).to.not.be.empty;
        expect(res.body.room_key).to.equal(String(roomKey));
        expect(res.body.question_count).not.empty;
        expect(res.body.room_id).not.empty;
        expect(await db.checkUserInRoom(newUserID, res.body.room_id)).to.be.true;

        
    })
});
