import express, { Request, Response, Router } from 'express';
import { checkUserIdMiddleware } from '../middleware/userid-auth.middleware';
import { Db } from '../db/db';
import { UserResponse } from '../models/user.model';
import { read } from 'fs';

/**
 * router for SSE routes
 */
export class SseRoute {


    public router: Router;

    /**
     * Constructor.
     */
    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }

    /**
     * Initialize the routes.
     */
    initRoutes() {
        //https://stackoverflow.com/questions/34657222/how-to-use-server-sent-events-in-express-js
        this.router.get('/room_created', async (req, res) => {

            console.log("rid param is: " + req.query.rid)
            const db: Db = res.locals.db;
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders(); // flush the headers to establish SSE with client
        
            //create a callback function that will be called from join
            const roomID: string = String(req.query.rid);

            let counter = 0;
            let prevUsers: UserResponse[];
            let interValID = setInterval( async() => {
                counter++;
                // every second up to 120
                if (counter >= 120) {
                    clearInterval(interValID);
                    res.end(); // terminates SSE session
                    return;
                }

                let usersFromDb :UserResponse[] = await db.getUsersInRoom(roomID);
                if (!(this.arraysEqual(usersFromDb, prevUsers))) {
                    prevUsers = usersFromDb;
                    this.resWrite(res, usersFromDb);
                }

                // res.write('"data":' + counter + '\n\n');
                let data = { num: counter}
                // res.write(`data: ${JSON.stringify(data)}\n\n`); // res.write() instead of res.send()
            }, 1000);
        
            // If client closes connection, stop sending events
            res.on('close', () => {
                console.log('client closed connection');
                clearInterval(interValID);
                res.end();
            });
        });

        this.router.get('/question_got', async (req, res) => {

            console.log("rid param is: " + req.query.rid)
            const db: Db = res.locals.db;
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders(); // flush the headers to establish SSE with client
        
            //create a callback function that will be called from join
            const roomID: string = String(req.query.rid);

            let counter = 0;
            let prevUsers: UserResponse[];
            let interValID = setInterval( async() => {
                // // every second up to 20
                counter++;
                if (counter >= 20) {
                    await db.incrementRoomQuestion(roomID);
                    clearInterval(interValID);
                    //now notify the user that time is up, get next q
                    res.end(); // terminates SSE session
                    return;
                }
                this.resWrite(res, {time: 20-counter});



                // // let usersFromDb :UserResponse[] = await db.getUsersInRoom(roomID);
                // // if (!(this.arraysEqual(usersFromDb, prevUsers))) {
                // //     prevUsers = usersFromDb;
                // //     this.resWrite(res, usersFromDb);
                // // }
                // let answered: boolean = await db.getAnswered(roomID);
                // if (answered) {
                //     this.resWrite(res, )
                // }

                // res.write('"data":' + counter + '\n\n');
                // let data = { num: counter}
                // res.write(`data: ${JSON.stringify(data)}\n\n`); // res.write() instead of res.send()
            }, 1000); //in ten seconds
        
            // If client closes connection, stop sending events
            res.on('close', () => {
                console.log('client closed connection');
                clearInterval(interValID);
                res.end();
            });
        });
    }

    resWrite(res: Response, data: object) {
        res.write(`data: ${JSON.stringify(data)}\n\n`); // res.write() instead of res.send()
    }

    // https://stackoverflow.com/a/16436975
    arraysEqual(a: any[], b: any[]) {
        return JSON.stringify(a) === JSON.stringify(b);
        // if (a === b) return true;
        // if (a == null || b == null) return false;
        // if (a.length !== b.length) return false;
      
        // for (var i = 0; i < a.length; ++i) {
        //   if (a[i] !== b[i]) return false;
        // }
        // return true;
      }
}