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
        this.router.get('/next_question', async (req: Request, res: Response) => {
            const db: Db = res.locals.db;
            const roomId = req.header('room-id');
            try {
                const questionIndex: QuestionIndex = await db.getQuestionIndex(roomId);
                if (questionIndex.index >= questionIndex.outOf){
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

    }
}