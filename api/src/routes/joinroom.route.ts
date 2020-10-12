import express, {Request, Response, Router} from 'express';
import { Db } from '../db/db';
import { RoomResponse } from '../models/room.model';

/**
 * Router for join_room
 */
export class JoinRoomRoute {


    public router;
    /**
     * Constructor.
     */
    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }

    /**
     * Initialise the join room route
     */
    initRoutes() {

        this.router.post('/join_room/', async (req: Request, res: Response) => {
            const db: Db = res.locals.db;
            const roomKey = req.body.room_key;
            const userID = req.header('user-id');
            try {
                // get the room ID from the key 
                const roomID = await db.getRoomIdFromKey(roomKey);

                //join the room. 'added' is false iff a matching ID was not found
                const added: boolean = await db.addUserToRoom(userID, roomID);
                
                if (added) {
                    res.sendStatus(200)
                } else {
                    return res.sendStatus(400);
                }
            } catch (error) {
                return res.sendStatus(500);
            }
        })
    }
}
