import express, { Request, Response, Router } from 'express';
import { checkUserIdMiddleware } from '../middleware/userid-auth.middleware';
import { Db } from '../db/db';
import { RoomResponse } from '../models/room.model';

/**
 * router for new_room
 */
export class RoomRoute {

    /* Changing this does nothing for now, DB procedure is hard-coded to 10. */
    static readonly NUM_OF_QUESIONS: number = 10;

    /* This should also be set somewhere else. */
    static readonly ROOM_KEY_LENGTH: number = 6;

    public router: Router;

    /**
     * Constructor.
     */
    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }

    /**
     * Initialize the routes.
     */
    initRoutes() {

        // Init route for new room.
        this.router.post('/new_room', async (req: Request, res: Response) => {
            const db: Db = res.locals.db;
            const userID = req.header('user-id');
            try {
                // make a room and get a room key
                const roomKeyN: number = await db.newRoom();

                // converting to 6 digit in case we get a number with fewer digits from the db
                const roomKey: string = roomKeyN.toLocaleString(undefined,
                    { minimumIntegerDigits: RoomRoute.ROOM_KEY_LENGTH });

                const roomID = await db.getRoomIdFromKey(roomKey);

                // assign 10 random questions ro the room
                // "1" refers to the category ID. TODO change it
                await db.assignRoomQuestions(roomID, "1")

                const result: RoomResponse = {
                    room_id: roomID,
                    room_key: roomKey,
                    question_count: 10
                }

                return res.send(result);
            } catch (error) {
                return res.sendStatus(500);
            }
        });

        // Init route for joining room.
        this.router.post('/join_room', async (req: Request, res: Response) => {
            const db: Db = res.locals.db;
            const roomKey = req.body.room_key;
            const userID = req.header('user-id');
            try {
                // get the room ID from the key 
                const roomID = await db.getRoomIdFromKey(roomKey);

                // join the room. 'added' is false iff a matching ID was not found
                const added: boolean = await db.addUserToRoom(userID, roomID);

                //get the number of questions in the room
                const numQ: number = await db.getNumQuestions(roomID);
                const result : RoomResponse = {room_id: roomID, room_key: roomKey, question_count: numQ};

                if (added) {
                    return res.send(result);
                } else {
                    return res.sendStatus(400);
                }
            } catch (error) {
                return res.sendStatus(500);
            }
        });

        // Init route for destroying room.
        this.router.post('/destroy_room', checkUserIdMiddleware, (req: Request, res: Response) => {
            const db: Db = res.locals.db;
            const uid: string = req.header('user-id');
            const rid: string = req.header('room-id');

            db.destroyRoomById(rid).then(() => {
                res.status(200);
                return res.send("Room destroyed");
            }).catch((err) => {
                res.status(400);
                return res.send(err);
            });

        });
    }
}