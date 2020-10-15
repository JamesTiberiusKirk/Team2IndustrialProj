import express, { Response, Request, NextFunction } from 'express';
import morgan from 'morgan';
import * as bodyParser from 'body-parser';
import cors from 'cors';

import { ServConf } from '../models/conf.model';
import { Db } from '../db/db';
import { RegisterRoute } from '../routes/register.route';
import { QuestionsRoute } from '../routes/questions.route';
import { RoomRoute } from '../routes/room.route';
import { ScoresRoute } from '../routes/scores.route';
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
     * Init express server.
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

        // Init the rooms router
        const roomRoute = new RoomRoute();
        this.app.use('/rooms', roomRoute.router);

        // Init the questions router.
        const questionsRoute = new QuestionsRoute();
        this.app.use('/questions', checkUserIdMiddleware, questionsRoute.router);

        // Init the scores router.
        const scoresRoute = new ScoresRoute();
        this.app.use('/scores', checkUserIdMiddleware, scoresRoute.router);
      
        // TEMP
        this.app.get('/', (req,res)=>{
            res.send('Hello World');
        });
    }

    /**
     * Initialising middleware.
     */
    initMiddleware() {
        this.disableServerCors();
        this.app.use(morgan('tiny'));
        this.app.use(bodyParser.json());


        // Injecting the database into each request
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.locals.db = this.db;
            next();
        })
    }


    /**
     * This is for disabling CORS request.
     */
    disableServerCors() {
        const options: cors.CorsOptions = {
            allowedHeaders: [
                'Origin',
                'X-Requested-With',
                'Content-Type',
                'Accept',
                'X-Access-Token',
            ],
            credentials: true,
            methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
        };

        this.app.use(cors(options));
        this.app.options('*', cors(options));
    }
}

