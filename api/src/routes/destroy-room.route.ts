import express, { Request, Response } from 'express';
import { Db } from '../db/db';

export class DestroyRoomRoute {
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
    this.initDestroyRoom();
  }

  /**
   * Runs the destroy room by key sql to soft delete the room
   */
  initDestroyRoom() {
    this.router.post('/', (req: Request, res: Response) => {
      const db : Db = res.locals.db;
      const uid: string = req.body.uid;
      const rkey: string = req.body.rkey;
      console.log(req.body);
      db.getRoomIdFromKey(rkey).then((rid:string)=>{
        db.destroyRoomById(rid).then(()=>{
          res.sendStatus(200);
          return res.send("Room destroyed");
        }).catch((err) => {
          res.sendStatus(400);
          return res.send(err);
        });
      }).catch((err)=>{
        res.sendStatus(400);
        return res.send(err);
      })



    });
  }
}
