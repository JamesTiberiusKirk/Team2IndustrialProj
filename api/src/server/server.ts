import express, { Response, Request, NextFunction } from 'express';
import morgan from 'morgan';
import * as bodyParser from 'body-parser';

import { ServConf } from '../models/conf.model';
import { Db } from '../db/db';
import { RegisterRoute } from '../routes/register.route';

import {AnswerRoute} from '../routes/answer.route';
import { QuestionsRoute } from '../routes/questions.route';
import { NewRoomRoute, JoinRoomRoute } from '../routes/rooms.route';
import { checkUserIdMiddleware } from '../middleware/userid-auth.middleware';

export class Server {

    /* Server conf. */
    conf: ServConf;

    /* The Express app. */
    app;

    /* The db client */
    db: Db;

    /**
     * Constructor.
     * @param conf Server config
     */
    constructor(conf: ServConf, db: Db) {
        this.conf = conf;
        this.app = express();
        this.db = db;
        this.initMiddleware();
        this.initRoutes();
    }

    /**
     * Initialising the server.
     */
    initServer(): Promise<void> {
        return new Promise((resolve) => {
            this.app.listen(this.conf.port, () => {
                // tslint:disable-next-line:no-console
                console.log(`server started at http://localhost:${this.conf.port}`);
                resolve();
            });
        });
    }

    /**
     * Initilising all the routers and routes.
     */
    initRoutes() {
        // Init the registration route class and route
        const regRoute = new RegisterRoute();
        this.app.use('/register', regRoute.router);

        const newRoomRoute = new NewRoomRoute();
        this.app.use('/register', newRoomRoute.router);

        const joinRoomRoute = new JoinRoomRoute();
        this.app.use('/register', joinRoomRoute.router);

        // Init answer route class and route
        const ansRoute = new AnswerRoute();
        this.app.use('/answer', ansRoute.router);

        const questionsRoute = new QuestionsRoute();
        this.app.use('/questions', checkUserIdMiddleware, questionsRoute.router);
    }

    /**
     * Initialising middleware.
     */
    initMiddleware() {
        this.app.use(morgan('tiny'));
        this.app.use(bodyParser.json());

        // Injecting the database into each request
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.locals.db = this.db;
            next();
        })
    }
}

