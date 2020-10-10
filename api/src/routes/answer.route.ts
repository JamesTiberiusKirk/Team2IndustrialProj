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
    this.initCheckAnswer();
  }

  /**
   * Runs the checkAnswer sql function and calls the increment score sql function
   */
  initCheckAnswer() {
    this.router.post('/', (req: Request, res: Response) => {

      var db: Db;
      db = res.locals.db;

      var qid = req.body.qid;
      var aid = req.body.aid;
      var uid = req.body.uid;

      db.checkAnswer('1', '42').then((result : number) => {
        res.statusCode = 200;

        if (result == 0 || result == null) {
          return res.send('Incorrect answer');
        }
        else {
          db.incrementScore(uid, 1);
          return res.send('Correct answer');
        }
      }).catch((err) => {
        res.statusCode = 400;
        return res.send(err);
      });
    });
  }
}




