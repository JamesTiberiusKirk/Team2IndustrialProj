import express, {Request, Response, Router} from 'express';

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
      return res.send("Hello world");
    });
  }
  
}



//Req:
//QuestionID, answerID, userID, RoomID

//Res:
//Correct/Incorrect, Updated Score
