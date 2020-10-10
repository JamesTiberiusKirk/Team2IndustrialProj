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
      let db : Db = res.locals.db;

      let qid = req.body.qid;
      let aid = req.body.aid;
      let uid = req.body.uid;

      db.checkAnswer(qid, aid).then((result : number) => {
        res.sendStatus(200);
       
        if (result == 0 || result == null) {
          return res.send('Incorrect answer');
        }
        else {
          db.incrementScore(uid, 1);
          return res.send('Correct answer');
        }
      }).catch((err) => {
        res.sendStatus(400);
        return res.send(err);
      });
    });
  }
}




