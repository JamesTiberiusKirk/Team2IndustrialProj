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
        this.initTestRoute();

    }

    initTestRoute() {
        this.router.post('/testSQL/', (req: Request, res: Response) => {
            this.testRoute(res.locals.db).then(()=> {
                return res.sendStatus(200);
            }).catch(err => {
                return res.sendStatus(400);
            })
        })
    }

    testRoute(db: Db) : Promise<any> {
        // var sql = "SELECT * FROM `user`";
        // var sql = "SELECT add_user_to_room(34, 26) AS was_added";
        // var sql = "SELECT add_user_to_room(5,5) AS was_added";
        // var sql = "INSERT INTO `room_users` (`room_id`, `user_id`) VALUES (34, 26);";
        // var sql = "INSERT INTO `room_users` (`room_id`, `user_id`) VALUES (5,5);";
        // var sql = "INSERT INTO `room_questions` (`question_id`, `room_id`, `order_idx`) VALUES (3, 34, 2);";
        // var sql = "INSERT into `user` (`name`) values ('testNick')"
        // var sql = "SELECT LAST_INSERT_ID()";
        // var sql = "SELECT * FROM `room_users`";
        var sql = "SELECT * FROM `room_questions`";
        // var sql = "SELECT * FROM `room`";
        // var sql = "SELECT * FROM `question`";
        // var sql = "DELETE FROM `user` WHERE `name`='bro'";
        // var sql = "SELECT new_user('testNick') AS new_user"
        return new Promise<any>((resolve, reject) => {
            db.conn.query(sql, (err, result : RowDataPacket[]) => {
                if (err) {
                    console.log("error in SQL test: ")
                    console.log(err);
                    return reject(err);
                } else {
                    console.log("result of SQL test: ")
                    console.log(result);
                    return resolve();
                }
            })
        })
    }

    //expecting a POST with "nick" for the user's nickname
    //returning a user ID
    initNewUserRoute() {
        this.router.post('/new_user/', (req: Request, res: Response) => {
            //res.send('peepee poopoo' + req.body.nick)

            var db : Db;
            db = res.locals.db;

            //var userID :String;
            ////THIS SOMETIMES WORKS AND SOMETIMES DOESN'T.
            var nick = req.body.nick;
            console.log("nick in new_user is " + nick);
            //return res.send('received nick: ' + req.body.nick)
            //create a user and get its id fro later
            // this.makeNewUser(res.locals.db, nick).then((uid0 : String)=> {
            this.makeNewUser(res.locals.db, nick).then((uid0 : Number)=> {
                //userID = uid0;
                //temporarily sending back to client
                //this.getLastInsertId(res.locals.db).then((uid : Number) => {
                    //the new user's Id is uid
                    
                    //create a new room with just the one player inside


                    return res.send(String(uid0));
                // }).catch((err) =>{
                //     res.statusCode = 400;
                //     return res.send(err)
                // })
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

            const numOfQuestions: Number = 5; //TODO this should be elsewhere

            //var userID :String;
            var uid = req.body.userID;
            this.createRoom(db).then((roomKey :Number) =>{
                //temporarily sending back the new room ID, 
                //later link and only send a status code or sth
                //return res.send(String(roomKey));

                //this.assignQuestionsToRoom(db, 10,)

                this.findRoomIdByKey(db, roomKey).then((rid :Number) => {
                    //TODO return a json
                    //return res.send(String(rid));
                    this.assignQuestionsToRoom(db, 5, rid).then(()=> {
                        res.sendStatus(200);
                        //TODO send back room ID, key, num of questions
                    }).catch((err)=>{
                        res.statusCode = 400;
                        res.send(err);
                    })
                }).catch((err) => {
                    res.statusCode = 400;
                    res.send(err);                    
                })
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
                // this.putUserIntoRoom(res.locals.db, userID, roomKey).then(()=> {
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

    makeNewUser(db: Db, nick: String) :Promise<Number>{
        var sql = "SELECT new_user(?) AS new_user"
        //var sql2 = "SELECT LAST_INSERT_ID()";

        //var sql = 'select new_user(?)';
        return new Promise<Number>((resolve, reject) =>{
            db.conn.query(sql, [nick], (err, result :RowDataPacket[]) => {
                if (err) {
                    return reject(err);
                }
                else {
                     //TODO return the ID of the newly created user instead
                     console.log("new_user sql worked, result was:");
                     console.log(result);
                    //  console.log(result[0]);
                    //  console.log(result.keys);
                    //  console.log(result.values);

                    //  db.conn.query(sql2, (err, result) => {
                    //      if (err) return reject(err);
                    //      else {
                    //          return resolve('sql actually worked; ' + String(result) );
                    //      }
                    //  })
                    return resolve(result[0]['new_user']);
                }
            })
        })
    }

    // makeNewUser(db: Db, nick: String) :Promise<String>{
    //     var sql = "INSERT into `user` (`name`) values (?)"
    //     //var sql2 = "SELECT LAST_INSERT_ID()";

    //     //var sql = 'select new_user(?)';
    //     return new Promise<String>((resolve, reject) =>{
    //         db.conn.query(sql, [nick], (err, result :RowDataPacket[]) => {
    //             if (err) {
    //                 return reject(err);
    //             }
    //             else {
    //                  //TODO return the ID of the newly created user instead
    //                  //console.log("sql worked, result was:");
    //                  //console.log(result);
    //                 //  console.log(result[0]);
    //                 //  console.log(result.keys);
    //                 //  console.log(result.values);

    //                 //  db.conn.query(sql2, (err, result) => {
    //                 //      if (err) return reject(err);
    //                 //      else {
    //                 //          return resolve('sql actually worked; ' + String(result) );
    //                 //      }
    //                 //  })
    //                 return resolve('sql worked; ' + String(result))
    //             }
    //         })
    //     })
    // }

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

    //get n random questions from db and assign them to the room
    assignQuestionsToRoom(db: Db, howMany: Number, rid: Number) :Promise<any> {
        var sql = "SELECT `id` FROM `question` ORDER BY RAND() LIMIT ?"
        return new Promise<any> ((resolve, reject) => {
            db.conn.query(sql, [howMany], (err, result :RowDataPacket[]) => {
                if (err) {
                    return reject(err);
                } else {
                    console.log("result of select questions was")
                    console.log(result);
                    // // prepare qs array
                    // var qIdArr :Array<Number>; 
                    // //prepare order arr
                    // var orderArr :Array<Number>;
                    // //room is arr
                    // var rIdArr : Array<Number>;

                    var valuesArr : Array<Array<String>> = new Array(result.length);
                    for (let i = 0; i < result.length; i++) {
                        // qIdArr[i] = result[i]['id'];  
                        // orderArr[i] = i;    
                        // rIdArr[i] = rid;     
                        
                        valuesArr[i] = new Array(3);
                        valuesArr[i][0] = String(rid);
                        valuesArr[i][1] = result[i]['id'];
                        valuesArr[i][2] = String(i);
                    }


                    // var i;
                    //for (var i = 0; i < result.length; i++) {
                    // this.assignQuestionsToRoom2(db, rIdArr, qIdArr, orderArr).then(()=>{
                    this.assignQuestionsToRoom2(db, valuesArr).then(()=>{
                        return resolve();
                    }).catch((err)=> {
                        return reject(err);
                    });
                    //}
                    //return resolve(result);
                }
            })
        })
    }

    // assignQuestionsToRoom2(db: Db, rIdAdd : Array<Number>, qIdArr : Array<Number>, orderArr :Array<Number>) :Promise<any> {
    assignQuestionsToRoom2(db: Db, valuesArr : Array<Array<String>>) :Promise<any> {
        var sql = "INSERT INTO `room_questions` (`room_id`, `question_id`, `order_idx`) VALUES ?"
        return new Promise<any>((resolve, reject) =>{
            db.conn.query(sql, [valuesArr], (err, result : RowDataPacket[]) => {
                if (err) return reject(err);
                else {
                    console.log("adding qs should have worked, result")
                    console.log(result);
                    return resolve();
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
        var sql = "SELECT add_user_to_room(?, ?) AS was_added"
        //var sql = "	INSERT INTO `room_users` (`room_id`, `user_id`) VALUES (?, ?);"
        return new Promise<any>((resolve, reject) => {
            db.conn.query(sql, [rid, uid], (err, result: RowDataPacket[]) => {
                if (err) return reject(err);
                else {
                    console.log("result of add_user_to_room was")
                    console.log(result);
                    var worked : Boolean = result[0]['was_added'];
                    if (worked) {
                        return resolve();
                    } else {
                        return reject("The user or room with the specified ID did not exist");
                    }
                }
            } )
        })
    }
}
