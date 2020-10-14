/**
 * Interface for storing user information.
 */
export interface User {
    userId: string;
    userNick: string;
}

/**
 * Interface for storing room information.
 */
export interface Room {
    roomId: string;
    roomKey: string;
    questionCount: number;
}


/**
 * Interface for storing the question and the answer options.
 */
export interface Question {
    id: string;
    text: string;
    answerOptions: AnswerOptions[];
}

/**
 * Interface for each answer option.
 */
export interface AnswerOptions {
    id: string;
    text: string;
}