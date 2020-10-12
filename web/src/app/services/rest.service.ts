import { HttpClient } from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Room, User } from '../models/rest.models';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  readonly BASE_API_URL = 'http://team2pi.dumitruvulpe.com:3000';

  readonly REGISTER_PATH = this.BASE_API_URL + '/register/new_user';
  readonly ROOM_CREATION_PATH = this.BASE_API_URL + '/register/new_room';
  readonly ROOM_JOIN_REQUEST_PATH = this.BASE_API_URL + '/register/join_room';
  readonly QUESTION_REQUEST_PATH = this.BASE_API_URL + '/questions/next_question';
  readonly POST_ANSWER_PATH = this.BASE_API_URL + '/answer';

  constructor(private rest: HttpClient) { }

  /**
   * This is for registering a new user.
   * @param nick user's preferred nickname.
   */
  register(nick: string): Observable<User> {
    return this.rest.post<User>(this.REGISTER_PATH, { nick });
  }

  createRoom(userId: string): Observable<Room> {
    return this.rest.post<Room>(this.ROOM_CREATION_PATH, { 'user-id': userId});
}

}
