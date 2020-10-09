import express, { Request, Response } from 'express';
import { Db } from '../db/db';

export class AnswerRoute {
  public router;
  /**
   * Constructor.
   */
  constructor() {
    this.router = express.Router();
    this.initRoutes();
  }
  
  /**
   * Initialize this router
   */
  initRoutes() {
    this.router.post('/', (req: Request, res: Response) => {
      
      var db: Db;
      db = res.locals.db;

      this.checkAnswer(res.locals.db, req.body.questID, req.body.ansID, req.body.userID).then((result) => {
        if( result == 0){
          return res.send('Incorrect answer');
        }
        else{
          return res.send('Correct answer');
        }
      }).catch((err) => {
        res.statusCode = 400;
        return res.send(err);
      });
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
          return resolve(Number(result)); // return 0 or 1
        }
      });
    })
  }
}

//Req:
//QuestionID, answerID, userID, RoomID

//Res:
//Correct/Incorrect, Updated Score


/* Check answer to question */
/* returns NULL if answer ID doesnt match question, returns 1 if correct, returns 0 if incorrect */
