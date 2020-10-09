import express, { Response, Request, NextFunction } from 'express';
import morgan from 'morgan';
import * as bodyParser from 'body-parser';

import { ServConf } from '../models/conf.model';
import { Db } from '../db/db';

import {AnswerRoute} from '../routes/post.answer';

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
        //Init answer route class and route
        const ansRoute = new AnswerRoute();
        this.app.use('/answer', ansRoute.router);
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

