import { rejects } from 'assert';
import e from 'express';
import express, {Request, Response, Router} from 'express';
import mysql, { OkPacket, QueryOptions, RowDataPacket } from 'mysql';
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
        this.initNewUserRoute();
        this.initNewRoomRoute();
        this.initJoinRoomRoute();

    }

    //expecting a POST with "nick" for the user's nickname
    //returning a user ID
    initNewUserRoute() {
        this.router.post('/new_user/', (req: Request, res: Response) => {
            //res.send('peepee poopoo' + req.body.nick)

            var db : Db;
            db = res.locals.db;

            //var userID :String;
            var nick = req.body.nick;
            //console.log(nick);
            //return res.send('received nick: ' + req.body.nick)
            //create a user and get its id fro later
            this.makeNewUser(res.locals.db, nick).then((uid0 : String)=> {
                //userID = uid0;
                //temporarily sending back to client
                this.getLastInsertId(res.locals.db).then((uid : Number) => {
                    //the new user's Id is uid
                    
                    //create a new room with just the one player inside


                    return res.send(String(uid));
                }).catch((err) =>{
                    res.statusCode = 400;
                    return res.send(err)
                })
                //return res.send(uid);
            }).catch((err) => {
                //something went wrong with the db,
                //temporarily sending the whole error message
                res.statusCode = 400;
                return res.send(err)
            })

        })
    }

    initNewRoomRoute(){
        this.router.post('/new_room/', (req: Request, res: Response) => {
            //res.send('peepee poopoo' + req.body.nick)

            var db : Db;
            db = res.locals.db;

            //var userID :String;
            var uid = req.body.userID;
            this.createRoom(db).then((roomKey :Number) =>{
                //temporarily sending back the new room ID, 
                //later link and only send a status code or sth
                return res.send(String(roomKey));
                // this.getLastInsertId(db).then((rid :Number) => {
                //     //TODO return a json
                //     return res.send(String(rid));
                // }).catch((err) => {
                //     res.statusCode = 400;
                //     res.send(err);                    
                // })
            }).catch((err)=>{
                res.statusCode = 400;
                res.send(err);
            })
            //console.log(nick);
            //return res.send('received nick: ' + req.body.nick)
            //create a user and get its id fro later
            // this.makeNewUser(res.locals.db, nick).then((uid0 : String)=> {
            //     //userID = uid0;
            //     //temporarily sending back to client
            //     this.getLastInsertId(res.locals.db).then((uid : Number) => {
            //         //the new user's Id is uid
                    
            //         //create a new room with just the one player inside


            //         return res.send(String(uid));
            //     }).catch((err) =>{
            //         res.statusCode = 400;
            //         return res.send(err)
            //     })
            //     //return res.send(uid);
            // }).catch((err) => {
            //     //something went wrong with the db,
            //     //temporarily sending the whole error message
            //     res.statusCode = 400;
            //     return res.send(err)
            // })

        })
    }

    initJoinRoomRoute() {
        this.router.post('/join_room/', (req, res) => {
            var roomKey = req.body.roomKey;
            var userID = req.body.userID
            this.findRoomIdByKey(res.locals.db, roomKey).then((rid:Number)=>{
                //got room ID
                this.putUserIntoRoom(res.locals.db, userID, rid).then(()=> {
                    //probably successfully added
                    return res.sendStatus(200);
                }).catch((err) =>{
                    res.statusCode = 400;
                    res.send(err);
                }) 
            }).catch((err)=> {
                res.statusCode = 400;
                res.send(err);
            })
            // this.createRoom(db).then((roomKey :Number) =>{
            //     //temporarily sending back the new room ID, 
            //     //later link and only send a status code or sth
            //     //return res.send(String(rid));
            //     this.getLastInsertId(db).then((rid :Number) => {
            //         //TODO return a json
            //         return res.send(String(rid));
            //     }).catch((err) => {
            //         res.statusCode = 400;
            //         res.send(err);                    
            //     })
            // }).catch((err)=>{
            //     res.statusCode = 400;
            //     res.send(err);
            // })
        })
    }


    makeNewUser(db: Db, nick: String) :Promise<String>{
        var sql = "INSERT into `user` (`name`) values (?)"
        //var sql2 = "SELECT LAST_INSERT_ID()";

        //var sql = 'select new_user(?)';
        return new Promise<String>((resolve, reject) =>{
            db.conn.query(sql, [nick], (err, result :RowDataPacket[]) => {
                if (err) {
                    return reject(err);
                }
                else {
                     //TODO return the ID of the newly created user instead
                     //console.log("sql worked, result was:");
                     //console.log(result);
                    //  console.log(result[0]);
                    //  console.log(result.keys);
                    //  console.log(result.values);

                    //  db.conn.query(sql2, (err, result) => {
                    //      if (err) return reject(err);
                    //      else {
                    //          return resolve('sql actually worked; ' + String(result) );
                    //      }
                    //  })
                    return resolve('sql worked; ' + String(result))
                }
            })
        })
    }

    //TODO this will be done using a SQL procedure later, in makeNewUser
    getLastInsertId(db: Db) :Promise<Number> {
        return new Promise<Number>((resolve, reject) => {

            var sql2 = "SELECT LAST_INSERT_ID()";
            db.conn.query(sql2, (err, result :RowDataPacket) => {
                if (err) return reject(err);
                else {
                    console.log('select last_insert_id worked, result:');
                    console.log(result);
                    //console.log(result[0]);
                    //console.log(result[0][1]);

                    //THIS ONE:
                    //console.log(result[0]['LAST_INSERT_ID()']);
                    return resolve(result[0]['LAST_INSERT_ID()']);
                }
            })
        })
    }
    
    createRoom(db: Db) :Promise<Number> {
        var sql = "select new_room()"
        return new Promise<any>((resolve, reject) => {
            db.conn.query(sql, (err, result :RowDataPacket[])=>{
                if (err) return reject(err);
                else {
                    console.log(result[0]);
                    //returns the room key of the new room
                    return resolve(result[0]['new_room()']);
                }
            })
        })
    }

    findRoomIdByKey(db: Db, roomKey : Number) :Promise<Number> {
        var sql = "SELECT * FROM `room` WHERE `key`=?"
        return new Promise<Number>((resolve, reject) => {
            db.conn.query(sql, [String(roomKey)], (err, result :RowDataPacket[]) => {
                if (err) return reject(err);
                else {
                    console.log("result of finding room ID:")
                    console.log(result);
                    return resolve(result[0]['id']);
                }
            } )
        })
    }

    putUserIntoRoom(db: Db, uid: Number, rid: Number) :Promise<any> {
        //var sql = "add_user_to_room(?, ?)"
        var sql = "	INSERT INTO `room_users` (`room_id`, `user_id`) VALUES (?, ?);"
        return new Promise<any>((resolve, reject) => {
            db.conn.query(sql, [String(rid), String(uid)], (err, result) => {
                if (err) return reject(err);
                else {
                    return resolve(result);
                }
            } )
        })
    }
}
