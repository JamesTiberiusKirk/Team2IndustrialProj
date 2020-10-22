import { Router, Request, Response } from 'express';
import { Db } from '../db/db';
import { Score, ScoresResponse } from '../models/score.model';

export class ScoresRoute {

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
        // Init the get scores route
        this.router.get('/get_scores', async (req: Request, res: Response) => {
            const db: Db = res.locals.db;
            const roomId = req.header('room-id');
            try {
                // get scores of all players in the room
                const dbScores: Score[] = await db.getRoomScores(roomId);
                let result: ScoresResponse = {scores: dbScores};
                return res.send(result);
            } catch (error) {
                return res.sendStatus(500);
            }
        });

        this.router.get('/leaderboard', async (req: Request, res: Response) => {
            const db: Db = res.locals.db;
            try {
                //get top 10 scores
                const dbScores: Score[] = await db.getTopNScores(10);
                let result: ScoresResponse = {scores: dbScores};
                return res.send(result);
            } catch (error) {
                return res.sendStatus(500);
            }
        });
    }
}