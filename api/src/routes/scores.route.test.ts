import { expect } from 'chai';
import { agent as request } from 'supertest';
import dotenv from 'dotenv';
import { ConnectionOptions } from 'mysql';

import { Db } from '../db/db';
import { Server } from '../server/server';

/*tslint:disable: no-unused-expression */
describe('Question Route Test', () => {

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

    
    let userID: string;
    let roomID: string;
    const nick: string = 'testNick'
    it ('should first join a room (+create room & user)', async () => {
        userID = await db.newUser(nick);
        expect(userID).to.not.be.empty;
        
        const roomKey: string = await db.newRoom();
        expect(roomKey.length).to.equal(6);
        
        roomID = await db.getRoomIdFromKey(roomKey);
        await db.addUserToRoom(userID, roomID);
    })

    //will need to fill the db with dummy questions for this one
    it('should get one score with 0 pts at first', async () => {
        
        expect(userID).not.empty;
        expect(roomID).not.empty;
        expect(nick).not.empty;

        const res = await request(server.app)
            .get('/scores/get_scores')
            .set('user-id', userID)
            .set('room-id', roomID)
            .send();

        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.scores.length).to.eq(1);
        expect(res.body.scores[0].user_id).to.eq(userID);
        expect(res.body.scores[0].nick).to.eq(nick);
        expect(res.body.scores[0].score).to.eq('0');
    });
});
