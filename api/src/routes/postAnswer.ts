import express, {Request, Response, Router} from 'express';
import {Db} from '../db/db';
import { ConnectionOptions } from "mysql";
import { request } from 'http';

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
    // this.router.get("/", (req: Request, res: Response) => {
    //    res.send("Hello world");
    // });

    this.router.get("/", (req: Request, res: Response) => {
      
    });
  }
  
}



//Req:
//QuestionID, answerID, userID, RoomID

//Res:
//Correct/Incorrect, Updated Score
