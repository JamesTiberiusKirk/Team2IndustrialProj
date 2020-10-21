import { expect } from 'chai';
import { agent as request } from 'supertest';
import dotenv from 'dotenv';
import { ConnectionOptions } from 'mysql';

import { Db } from '../db/db';
import { Server } from '../server/server';
import { Question, Answer } from '../models/question.model';
import { deepStrictEqual } from 'assert';
import { type } from 'os';

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
    let question: Question;
    let answers: Answer[];
    let numQ: number;
    const nick: string = 'testNick'
    it ('should first join a room (+create room & user)', async () => {

        userID = await db.newUser(nick);
        expect(userID).to.not.be.empty;
        
        const roomKey: string = await db.newRoom();
        expect(roomKey.length).to.equal(6);
        
        roomID = await db.getRoomIdFromKey(roomKey);
        
        numQ = await db.assignRoomQuestions(roomID, 1, 3);

        await db.addUserToRoom(userID, roomID);
    })

    it('should get /questions/next', async () => {
        
        expect(userID).not.empty;
        expect(roomID).not.empty;

        const res = await request(server.app)
            .get('/questions/next')
            .set('user-id', userID)
            .set('room-id', roomID)
            .send();

        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.question).not.undefined;
        expect(res.body.question).not.null;
        expect(res.body.question.id).not.empty;
        expect(res.body.question.text).not.empty;
        expect(res.body.answers).not.undefined;
        expect(res.body.answers).not.null;
        expect(res.body.answers.length).eq(4);

        for (const ans of res.body.answers) {
            expect(ans.id).not.empty;
            expect(ans.text).not.empty;            
        }

        question = res.body.question;
        answers = res.body.answers;
    });

    it('should post /questions/answer', async () => {
        try{
            expect(userID).not.empty;
            expect(roomID).not.empty;
            expect(question).not.null;
            expect(answers).not.null;

            // just send the first answer
            const res = await request(server.app)
                .post('/questions/answer')
                .set('user-id', userID)
                .set('room-id', roomID)
                .send({ qid: question.id, aid: answers[0].id });
            
            expect(res.status).eq(200);
            expect(res.body).not.null;
            expect(res.body.correct).not.undefined;
            expect(typeof(res.body.correct)).eq(typeof(true));
        } catch(err) {
            expect(err).null;
            expect(true).eq(false);
        }
    })

    async function updateQA() {
        const res = await request(server.app)
            .get('/questions/next')
            .set('user-id', userID)
            .set('room-id', roomID);
        
        question = res.body.question;
        answers = res.body.answers;
        expect(res.status).eq(200);
    }

    async function sendFirstAnswer() {

        const res = await request(server.app)
            .post('/questions/answer')
            .set('user-id', userID)
            .set('room-id', roomID)
            .send({ qid: question.id, aid: answers[0].id });
        expect(res.status).eq(200);
    }

    it ('should post two more times and then get a 204', async() => {
        expect(userID).not.empty;
        expect(roomID).not.empty;
        expect(question).not.null;
        expect(answers).not.null;

        // get and answer the second question
        await updateQA();
        await sendFirstAnswer();

        // third question
        await updateQA();
        await sendFirstAnswer();


        const res2 = await request(server.app)
            .get('/questions/next')
            .set('user-id', userID)
            .set('room-id', roomID)
            .send();

        expect(res2.status).eq(204); 
    })
});
