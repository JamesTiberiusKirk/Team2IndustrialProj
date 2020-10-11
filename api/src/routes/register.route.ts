import express, {Request, Response, Router} from 'express';
import { Db } from '../db/db';
import { User } from '../models/user.model';

export class RegisterRoute {

    public router;
    /**
     * Constructor.
     */
    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }

    /**
     * Initializes all the routes.
     */
    initRoutes() {
        this.router.post('/new_user/', async (req: Request, res: Response) => {
            const db: Db = res.locals.db;
            const nick: string = req.body.nick;
            try {
                const userID = await db.newUser(nick);
                //sending back a User JSON in case the nickname needs restrictions in the future
                const result : User = { user_id: userID, nick: nick};
                return res.send(result);
            } catch (error) {
                console.log(error);
                return res.sendStatus(500);
            }
        })
    }
}
