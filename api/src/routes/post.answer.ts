import express, { Request, Response, Router } from 'express';
import { Db } from '../db/db';
import { ConnectionOptions } from "mysql";
import { request } from 'http';
import { resolve } from 'path';
import { rejects } from 'assert';

export class AnswerRoute {
  public router;
  /**
   * Constructor.
   */
  constructor() {
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post("/", (req: Request, res: Response) => {
      //    res.send("Hello world");
      // });
      var db: Db;
      db = res.locals.db;

     
      this.checkAnswer(res.locals.db, req.body.questID, req.body.ansID, req.body.userID).then(() => {

        //ToDo

      }).catch((Error)){
        res.statusCode = 400;
        return res.send(Error);
      }
    });
  }
  
  /**
   * SQL function call to check if answer from user is correct, update score if correct
   * @param db 
   * @param questID id of question
   * @param ansID  id of Answer
   * @param userID id of User
   */
  checkAnswer(db: Db, questID: number, ansID: number, userID: number): Promise<Number> {
    return new Promise<Number>((resolve, reject) => {
      db.conn.query('select check_answer( ? , ? );', [questID, ansID], (err, result) => {
        if (err) {
          reject(err);
        } 
        else {
          db.conn.query('CALL increment_score( ? , 1 );',[userID])
          return resolve(Number(result));
        }
      })
    })
  }
}

//Req:
//QuestionID, answerID, userID, RoomID

//Res:
//Correct/Incorrect, Updated Score


/* Check answer to question */
/* returns NULL if answer ID doesnt match question, returns 1 if correct, returns 0 if incorrect */
