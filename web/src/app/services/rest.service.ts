import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question, Room, User } from '../models/rest.models';

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
    return this.rest.post<Room>(this.ROOM_CREATION_PATH, { 'user-id': userId });
  }

  /**
   * This is for joining a room.
   * @param roomId room id.
   * @param userId user id.
   */
  joinRoom(roomId: string, userId: string): Observable<object> {
    const headers = this.genHeaders(userId, roomId);
    return this.rest.post(this.ROOM_JOIN_REQUEST_PATH, { 'room-id': roomId }, { headers });
  }

  /**
   * This is for getting the next question.
   * @param roomId room ID;
   * @param userId user ID;
   */
  getNextQuestion(roomId: string, userId: string): Observable<Question> {
    const headers = this.genHeaders(userId, roomId);
    return this.rest.get<Question>(this.QUESTION_REQUEST_PATH, { headers });
  }

  /**
   * This is posting an answer.
   * @param roomId room ID.
   * @param userId user ID.
   * @param questionId question ID.
   * @param answerId answer ID.
   */
  postAnswer(roomId: string, userId: string, questionId: string, answerId: string): Observable<object> {
    const headers = this.genHeaders(userId, roomId);
    const data = { qid: questionId, aid: answerId, uid: userId };
    return this.rest.post(this.POST_ANSWER_PATH, data, {headers});
  }

  /**
   * Function for generating headers.
   * @param userId user ID.
   * @param roomId room ID.
   */
  private genHeaders(userId: string, roomId: string): HttpHeaders {
    const headers = new HttpHeaders();
    headers.append('user-id', userId);
    headers.append('room-id', roomId);
    return headers;
  }
}
