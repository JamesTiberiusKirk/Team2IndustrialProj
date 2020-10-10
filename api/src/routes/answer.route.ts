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

      var qid = req.body.qid; 
      var aid = req.body.aid;
      var uid = req.body.uid;

      db.checkAnswer(qid, aid).then((result) => {
        res.statusCode = 200;
        console.log( result );
        console.log( qid );
        console.log( aid );

        if( result == false || result == null){
          return res.send('Incorrect answer');
        }
        else{
          db.incrementScore(uid, 1);
          console.log('score + 1');
          return res.send('Correct answer');
        }
      }).catch((err) => {
        res.statusCode = 400;
        return res.send(err);
      });
    });
  }

  
  // /**
  //  * SQL function call to check if answer from user is correct, update score if correct
  //  * @param db 
  //  * @param questID id of question
  //  * @param ansID  id of Answer
  //  * @param userID id of User
  //  */
  // checkAnswer(db: Db, questID: number, ansID: number, userID: number): Promise<Number> {
  //   return new Promise<Number>((resolve, reject) => {
  //     db.conn.query('select check_answer( ? , ? );', [questID, ansID], (err, result) => {
  //       if (err) {
  //         reject(err); 
  //       } 
  //       else {
  //         db.conn.query('CALL increment_score( ? , 1 );',[userID]) // increments user score
  //         return resolve(Number(result)); // return 0 or 1
  //       }
  //     });
  //   })
  // }
}




