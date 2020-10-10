import { createConnection, Connection, ConnectionOptions, RowDataPacket } from 'mysql';

export class Db {
    conn: Connection;

    /**
     * Constructor.
     * @param dbConf Mysql Connection Options
     */
    constructor(dbConf: ConnectionOptions) {
        this.conn = createConnection(dbConf);
    }

    /**
     * Initializes the mysql db connection.
     */
    initClient() {
        return new Promise((resolve, reject) => {
            this.conn.connect((err: Error) => {
                if (err) reject(err);
                resolve('Db Connected');
            });
        });
    }


    /**
     * Registers a new user.
     * @param nick Nickname of the new user.
     * @returns the ud of the new user.
     */
    newUser(nick: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            const sql: string = 'SELECT new_user(?) AS user_id;';
            this.conn.query(sql, [nick], (err, rows: RowDataPacket[]) => {
                if (err) reject(err);
                try {
                    resolve(rows[0].user_id);
                } catch (e) {
                    reject(e);
                }
            });
        });

    }

    /**
     * Check answer to question.
     * @param qid Question ID.
     * @param aid Answer ID.
     * @returns boolean for the answer.
     */
    checkAnswer(qid: string, aid: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            const sql: string = 'SELECT check_answer(?,?) AS result;';
            this.conn.query(sql, [qid, aid], (err, rows: RowDataPacket[]) => {
                if (err) reject(err);
                try {
                    resolve(rows[0].result);
                    // console.log(rows[0].result);
                } catch (e) {
                    reject(e);
                   // console.log('DB could not connect');
                }
            });
        });

    }

    /**
     * Creates new room.
     * @returns room_key.
     */
    newRoom(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            const sql: string = 'SELECT new_room() AS room_key;';
            this.conn.query(sql, (err, rows: RowDataPacket[]) => {
                if (err) reject(err);
                try {
                    resolve(rows[0].room_key);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    /**
     * Gets room id from key.
     * @param key Room key
     * @returns room ID
     */
    getRoomIdFromKey(key: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const sql: string = 'SELECT room_id_from_key(?) AS room_id;';
            this.conn.query(sql, [key], (err, rows: RowDataPacket[]) => {
                if (err) reject(err);
                try {
                    resolve(rows[0].room_id);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    /**
     * Destroys room by the key.
     * @param key Room key.
     */
    destroyRoomByKey(key: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql: string = 'CAll destroy_room_key(?);';
            this.conn.query(sql, [key], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    /**
     * Destroys room by the id.
     * @param id Room id.
     */
    destroyRoomById(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql: string = 'CAll destroy_room_id(?);';
            this.conn.query(sql, [id], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }


    /**
     * Checks if room exists by id.
     * @param id room ID.
     */
    ifRoomExist(id: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const sql: string = 'SELECT room_id_/exits(?) AS result;';
            this.conn.query(sql, [id], ((err, rows: RowDataPacket[]) => {
                if (err) reject(err);
                try {
                    resolve(rows[0].result);
                } catch (e) {
                    reject(e);
                }
            }));
        });
    }

    /**
     * Checks if a user by this id exists.
     * @param id user ID.
     */
    ifUserIdExist(id: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const sql: string = 'SELECT user_id_exists(?) AS result;';
            this.conn.query(sql, [id], ((err, rows: RowDataPacket[]) => {
                if (err) reject(err);
                try {
                    resolve(rows[0].result);
                } catch (e) {
                    reject(e);
                }
            }));
        });
    }

    /**
     * Adds user to room.
     * @param id user ID.
     */
    addUserToRoom(id: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const sql: string = 'SELECT add_user_to_room(?,?) AS result;';
            this.conn.query(sql, [id], ((err, rows: RowDataPacket[]) => {
                if (err) reject(err);
                try {
                    resolve(rows[0].result);
                } catch (e) {
                    reject(e);
                }
            }));
        });
    }


    /**
     * Increments the score of a user.
     * @param id user ID.
     * @param amount score amount.
     */
    incrementScore(id: string, amount: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql: string = 'CALL increment_score(?,?);';
            this.conn.query(sql, [id, amount], (err, rows: RowDataPacket[]) => {
                if (err) reject(err);
                try {
                    resolve(rows[0].result);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    /**
     * SQL Function Call.
     * Checks if the user is in the room.
     * @param userid id of the user
     * @param roomid id of the room
     * @returns boolean
     */
    checkUserInRoom(userid: string, roomid: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const sql: string = 'SELECT check_user_in_room(?,?) AS is_in_room;';
            this.conn.query(sql, [roomid, userid], (err, rows: RowDataPacket[]) => {
                if (err) reject(err);
                try {
                    resolve(Boolean(rows[0].is_in_room));
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
}