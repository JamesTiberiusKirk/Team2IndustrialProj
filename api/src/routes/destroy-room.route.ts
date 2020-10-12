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
      const uid: string = req.header('user-id');
      const rid: string = req.header('room-id');

      db.destroyRoomById(rid).then(()=>{
        res.status(200);
        return res.send("Room destroyed");
      }).catch((err) => {
        res.status(400);
        return res.send(err);
      });

    });
  }
}
