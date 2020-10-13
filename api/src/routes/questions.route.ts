import { Router, Request, Response } from 'express';
import { QuestionAndAnswerResponse, QuestionIndex } from '../models/question.model';
import { Db } from '../db/db';
import { Answer, Question } from '../models/question.model';

export class QuestionsRoute {

    router: Router;

    /**
     * Constructor.
     */
    constructor() {
        this.router = Router();
        this.initRoutes();
    }

    /**
     * Initializes all the routes.
     */
    initRoutes() {
        // Init the next question route
        this.router.get('/next', async (req: Request, res: Response) => {
            const db: Db = res.locals.db;
            const roomId = req.header('room-id');
            try {
                const questionIndex: QuestionIndex = await db.getQuestionIndex(roomId);
                if (questionIndex.index >= questionIndex.outOf) {
                    await db.destroyRoomById(roomId);
                    return res.status(400).send('last question was reached');
                }

                await db.incrementRoomQuestion(roomId);
                const question: Question = await db.getCurrentQuestion(roomId);
                const answers: Answer[] = await db.getAnswers(question.id);
                const result: QuestionAndAnswerResponse = { question, answers }
                return res.send(result);
            } catch (error) {
                return res.sendStatus(500);
            }
        });

        // Init route for answer
        this.router.post('/answer', (req: Request, res: Response) => {
            const db: Db = res.locals.db;
            const qid = req.body.qid;
            const aid = req.body.aid;
            const uid = req.body.uid;

            db.checkAnswer(qid, aid).then((result: boolean) => {
                res.sendStatus(200);
                if (result === false || result === null) {
                    return res.send('Incorrect answer');
                }
                else {
                    db.incrementScore(uid, 1);
                    return res.send('Correct answer');
                }
            }).catch((err) => {
                res.sendStatus(400);
                return res.send(err);
            });
        });
    }
}