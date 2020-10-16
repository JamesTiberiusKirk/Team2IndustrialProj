/**
 * Interface for storing user information.
 */
export interface User {
    user_id: string;
    nick: string;
}

/**
 * Interface for storing room information.
 */
export interface Room {
    room_id: string;
    room_key: string;
    question_count: number;
}

/**
 * Interface for storing a question
 */
export interface Question {
    id: string;
    text: string;
}

/**
 * Interface for each answer option.
 */
export interface Answer {
    id: string;
    text: string;
}

/** 
 * Interface for storing a question with all the possible answers
 */
export interface QuestionAndAnswers {
    question: Question;
    answers: Answer[];
}

/**
 * Interface for storing if the answer was correct
 */
export interface AnswerResult {
    correct: boolean;
}

/**
 * Interface for each score entry
 */
export interface Score {
    user_id: number;
    nick: string;
    score: number;
}

/**
 * Interface for all the scores in a response
 */
export interface Scores {
    scores: Score[];
}