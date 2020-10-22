/**
 * Interface for each separate question.
 */
export interface Question {
    id: string;
    text: string;
}

/**
 * Interface for each answer.
 */
export interface Answer {
    id: string;
    text: string;
}

/**
 * Interface for questions and their answer options in a rest response.
 */
export interface QuestionAndAnswerResponse {
    question: Question;
    answers: Answer[];
}

/**
 * Interface for the index of a question in a specific room.
 */
export interface QuestionIndex {
    outOf: string;
    index: string;
}

/**
 * Interface for answer result in a rest response.
 */
export interface AnswerResultResponse {
    correct: boolean;
    correct_answer: string;
    correct_answer_text: string;
    score: string;
}
