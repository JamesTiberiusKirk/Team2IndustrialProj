import express, {Request, Response, Router} from 'express';
import { Db } from '../db/db';
import { RoomResponse } from '../models/room.model';

/**
 * router for new_room
 */
export class NewRoomRoute {

    //lol how do you do constants in JS
    //changing this does nothing for now, DB procedure is hard-coded to 10.
    static readonly NUM_OF_QUESIONS : number = 10;

    //this should also be set somewhere else
    static readonly ROOM_KEY_LENGTH : number = 6;

    public router;
    /**
     * Constructor.
     */
    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }

    /**
     * Initialize the new room route
     */
    initRoutes() {

        this.router.post('/new_room/', async (req: Request, res: Response) => {
            const db: Db = res.locals.db;
            const userID = req.header('user-id');
            try {
                //make a room and get a room key
                const roomKeyN : number = await db.newRoom();

                //converting to 6 digit in case we get a number with fewer digits from the db
                const roomKey: string = roomKeyN.toLocaleString(undefined, 
                    {minimumIntegerDigits: NewRoomRoute.ROOM_KEY_LENGTH});

                // um it would probably be better to get both at once without two selects but tis what it is
                //this should maybe return a number instead?
                const roomID = await db.getRoomIdFromKey(roomKey);

                //assign 10 random questions ro the room
                //"1" refers to the category ID. TODO change it 
                await db.assignRoomQuestions(roomID, "1")

                const result :RoomResponse = {
                    room_id: roomID,
                    room_key: roomKey,
                    question_count: 10
                }

                return res.send(result);
            } catch (error) {
                return res.sendStatus(500);
            }
        })
    }
}