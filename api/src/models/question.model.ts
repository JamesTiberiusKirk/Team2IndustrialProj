export interface Question {
    id: string;
    text: string;
}

export interface Answer {
    id: string;
    text: string;
}

export interface QuestionAndAnswerResponse {
    question: Question;
    answers: Answer[];
}

export interface QuestionIndex {
    outOf: string;
    index: string;
}