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