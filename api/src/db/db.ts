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
     * Initilises the mysql db connection.
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
                resolve(Boolean(rows[0]['is_in_room']));
            });
        });
    }

}