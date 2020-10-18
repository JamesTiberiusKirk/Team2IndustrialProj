/**
 * Interface for score information.
 */
export interface Score {
    user_id: string;
    nick: string;
    score: string;
}

/**
 * Interface for multiple scores in a rest response.
 */
export interface ScoresResponse {
    scores: Score[];
}