export interface Score {
    user_id: string;
    nick: string;
    score: string;
}

export interface ScoresResponse {
    scores: Score[];
}