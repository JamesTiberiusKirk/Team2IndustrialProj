import { rejects } from 'assert';
import express, {Request, Response, Router} from 'express';
import { QueryOptions } from 'mysql';
import { Db } from '../db/db'

export class RegisterRoute {

    public router;
    /**
     * Constructor.
     */
    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        //expecting a POST with "nick" for the user's nickname
        this.router.post('/', (req: Request, res: Response) => {
            //res.send('peepee poopoo' + req.body.nick)

            var db : Db;
            db = res.locals.db;

            var userID :String;
            //create a user and get its id fro later
            this.makeNewUser(res.locals.db, req.body.nick).then((uid : String)=> {
                userID = uid;
                //temporarily sending back to client
                return res.send(uid);
            }).catch((err) => {
                //something went wrong with the db,
                //temporarily sending the whole error message
                res.statusCode = 400;
                return res.send(err)
            })

        })
    }


    makeNewUser(db: Db, nick: String) :Promise<String>{
        var sql = "SELECT * FROM user";

        return new Promise<String>((resolve, reject) =>{
            db.conn.query(sql, (err, result) => {
                if (err) {
                    return reject(err);
                }
                else {
                     //TODO return the ID of the newly created user instead
                     return resolve('sql worked; ' + String(result))
                }
            })
        })
    }

}
