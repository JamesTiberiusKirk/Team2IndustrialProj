import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QuestionAndAnswers, Room, User, Scores, AnswerResult } from '../models/rest.models';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  readonly BASE_API_URL = 'http://team2ip.dumitruvulpe.com:3000';

  readonly REGISTER_PATH = this.BASE_API_URL + '/register/new_user/';
  readonly ROOM_CREATION_PATH = this.BASE_API_URL + '/rooms/new_room';
  readonly ROOM_JOIN_REQUEST_PATH = this.BASE_API_URL + '/rooms/join_room';
  readonly QUESTION_REQUEST_PATH = this.BASE_API_URL + '/questions/next';
  readonly POST_ANSWER_PATH = this.BASE_API_URL + '/questions/answer';
  readonly GET_SCORES_PATH = this.BASE_API_URL + '/scores/get_scores';

  constructor(private rest: HttpClient) { }

  /**
   * This is for registering a new user.
   * @param nick user's preferred nickname.
   */
  register(nick: string): Observable<User> {
    return this.rest.post<User>(this.REGISTER_PATH, { nick });
  }

  /**
   * This is for creating a new room.
   * @param userId users ID.
   */
  createRoom(userId: string): Observable<Room> {
    const httpOptions = {
      headers: (new HttpHeaders()).append('user-id', userId)
    };

    return this.rest.post<Room>(this.ROOM_CREATION_PATH, null, httpOptions);
  }

  /**
   * This is for joining a room.
   * @param userId user id.
   * @param roomKey room key (not the ID)
   */
  joinRoom(userId: string, roomKey: string): Observable<Room> {
    const httpOptions = {
      headers: (new HttpHeaders().append('user-id', userId))
    };
    const data = { room_key: roomKey };
    return this.rest.post<Room>(this.ROOM_JOIN_REQUEST_PATH, data, httpOptions);
  }

  /**
   * This is for getting the next question.
   * @param roomId room ID;
   * @param userId user ID;
   */
  getNextQuestion(roomId: string, userId: string): Observable<QuestionAndAnswers> {
    const httpOptions = { headers: this.genHeaders(userId, roomId) };
    return this.rest.get<QuestionAndAnswers>(this.QUESTION_REQUEST_PATH, httpOptions);
  }

  /**
   * This is posting an answer.
   * @param roomId room ID.
   * @param userId user ID.
   * @param questionId question ID.
   * @param answerId answer ID.
   */
  postAnswer(roomId: string, userId: string, questionId: string, answerId: string): Observable<AnswerResult> {
    const headers = this.genHeaders(userId, roomId);
    const data = { qid: String(questionId), aid: String(answerId) };
    return this.rest.post<AnswerResult>(this.POST_ANSWER_PATH, data, {headers: headers});
  }

  /**
   * Get the scores of all the users in this room
   * @param roomId room ID
   * @param userId user ID
   */
  getScores(roomId: string, userId: string) : Observable<Scores> {
    const headers = this.genHeaders(userId, roomId);
    return this.rest.get<Scores>(this.GET_SCORES_PATH, {headers: headers});
  }

  /**
   * Function for generating headers.
   * @param userId user ID.
   * @param roomId room ID.
   */
  private genHeaders(userId: string, roomId: string): HttpHeaders {
    const headers = (new HttpHeaders()).append('user-id', userId).append('room-id', roomId);
    return headers;
  }
}
