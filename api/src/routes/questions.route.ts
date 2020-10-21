import { Router, Request, Response } from 'express';
import { AnswerResultResponse, QuestionAndAnswerResponse, QuestionIndex } from '../models/question.model';
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
                if (questionIndex.index > questionIndex.outOf) {
                    await db.destroyRoomById(roomId);
                    return res.status(204).send('last question was reached');
                }

                // only sending the current question, not moving on to the next one until answered

                const question: Question = await db.getCurrentQuestion(roomId);
                const answers: Answer[] = await db.getAnswers(question.id);
                const result: QuestionAndAnswerResponse = { question, answers }
                return res.send(result);
            } catch (error) {
                return res.sendStatus(500);
            }
        });

        // Init route for answer
        this.router.post('/answer', async (req: Request, res: Response) => {
            const db: Db = res.locals.db;
            const qid: string = req.body.qid;
            const aid = req.body.aid;
            const uid = req.header('user-id');
            const rid = req.header('room-id');

            try {
                // first check the current question matches
                const currQ: Question = await db.getCurrentQuestion(rid);
                if (qid !== String(currQ.id)) {
                    // answer request was sent for a different question
                    return res.status(400).send("not the current question");
                }

                const wasRight: boolean = Boolean(await db.checkAnswer(qid, aid));

                // move on to the next question in the db
                await db.incrementRoomQuestion(rid);
                if (wasRight === null) {
                    return res.sendStatus(400);
                } else {
                    if (wasRight) {
                        db.incrementScore(uid, 1);
                    }
                    const result: AnswerResultResponse = { correct: wasRight };
                    return res.send(result);
                }
            } catch (error) {
                return res.sendStatus(500);
            }
        });
    }
}