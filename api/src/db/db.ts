import { createConnection, Connection, ConnectionOptions, RowDataPacket } from 'mysql';
import { Question, Answer, QuestionIndex } from '../models/question.model';
import { Score } from '../models/score.model';

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
    checkAnswer(qid: string, aid: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
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
     * @param userID user ID.
     * @param roomID room ID.
     */
    addUserToRoom(userID: string, roomID: string): Promise<boolean> {
        return new Promise<any>((resolve, reject) => {
            const sql: string = 'SELECT add_user_to_room(?,?) AS result;';
            this.conn.query(sql, [roomID, userID], ((err, rows: RowDataPacket[]) => {
                if (err) reject(err);
                try {
                    resolve(Boolean (rows[0].result));
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

    /**
     * Assigns a new set of questions to the room.
     * @param id room ID.
     * @param category category for questions.
     */
    assignRoomQuestions(id: string, category: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql: string = 'CALL assign_room_questions(?,?);';
            this.conn.query(sql, [id, category], (err, rows: RowDataPacket[]) => {
                if (err) reject(err);
                try {
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    /**
     * Get the number of questions in a room
     * @param roomID room ID
     */
    getNumQuestions(roomID: string) :Promise<number> {
        return new Promise<number>((resolve, reject) => {
            const sql: string = 'SELECT num_questions FROM `room` WHERE `id` = ?';
            this.conn.query(sql, [roomID], (err, rows: RowDataPacket[]) => {
                if (err) return reject(err);
                try{
                    return resolve(rows[0].num_questions);
                } catch(e) {
                    return reject(e);
                }
            })
        })
    }

    /**
     * Increments the current question for a room.
     * @param id room ID.
     */
    incrementRoomQuestion(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql: string = 'CALL increment_room_question(?);';
            this.conn.query(sql, [id], (err, rows: RowDataPacket[]) => {
                if (err) reject(err);
                try {
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    /**
     * Gets the current question for a room.
     * @param id room ID.
     */
    getCurrentQuestion(id: string): Promise<Question> {
        return new Promise<Question>((resolve, reject) => {
            const sql: string = 'CALL retrieve_current_question(?);';
            this.conn.query(sql, [id], (err, rows: RowDataPacket[]) => {
                if (err) reject(err);
                try {
                    const output: Question = { id: rows[0].id, text: rows[0].text };
                    output.id = rows[0].id;
                    output.text = rows[0].text;
                    resolve(output);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }


    /**
     * Gets all answers for a specific question.
     * @param questionId question ID.
     */
    getAnswers(questionId: string): Promise<Answer[]> {
        return new Promise((resolve, reject) => {
            const sql: string = 'SELECT answer.id, answer.text FROM answer WHERE answer.id=?;';
            this.conn.query(sql, [questionId], (err, rows: RowDataPacket[]) => {
                if (err) reject(err);
                try {
                    const result: Answer[] = [] as Answer[];
                    rows.forEach(r => {
                        result.push({ id: String(r.id), text: r.text });
                    });
                    resolve(result);
                } catch (e) {
                    reject(e)
                }

            })
        });
    }

    /**
     * Returns the amount of questions in a room and the current question
     * index.
     * @param roomId room ID.
     */
    getQuestionIndex(roomId: string): Promise<QuestionIndex> {
        return new Promise((resolve, reject) => {
            const sql: string = `SELECT room.current_question, room.num_questions
            FROM room WHERE room.id=?;`;
            this.conn.query(sql, [roomId], (err, rows: RowDataPacket[]) => {
                if(err)reject(err);
                try{
                    resolve({outOf:rows[0].num_questions, index: rows[0].current_question});
                }catch(e){
                    reject(e);
                }

            })
        });

    }

    getRoomScores(roomId: string): Promise<Score[]> {
        return new Promise<Score[]>((resolve, reject) => {
            const sql: string = 'CALL get_room_scores(?)';
            this.conn.query(sql, [roomId], (err, rows: RowDataPacket[]) => {
                if (err) return reject(err);
                try{
                    const result: Score[] = [] as Score[];
                    //rows returns an array with the actual result array at [0] and an OkPacket at [1], so getting the results
                    const rows0 : RowDataPacket[] =rows[0] as RowDataPacket[];
                    rows0.forEach(r => {
                        result.push({ user_id: r.id, nick: r.name, score: r.score });
                    });
                    resolve(result);
                } catch(e) {
                    reject(e);
                }
            })
        })
    }

}
