export interface Score {
    user_id: number;
    nick: string;
    score: number;
}

export interface ScoresResponse {
    scores: Score[];
}