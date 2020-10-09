import { Request, Response, NextFunction } from "express";
import { Db } from '../db/db';

export async function checkUserIdMiddleware(req: Request, res: Response, next: NextFunction) {

    const db: Db = res.locals.db;
    const userIdheader: string = req.header('user-id');
    const roomIdHeader: string = req.header('room-id');

    if (!userIdheader) return res.sendStatus(400);
    if (!roomIdHeader) return res.sendStatus(400);

    const result = await db.checkUserInRoom(userIdheader, roomIdHeader);

    return result ? next() : res.sendStatus(401);
}