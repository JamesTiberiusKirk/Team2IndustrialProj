// https://bartoszgajda.com/2019/12/22/angular-and-server-sent-events-sse/

import { Injectable, NgZone } from "@angular/core";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class SseService {
  readonly BASE_API_URL = 'http://localhost:3000';

  readonly ROOM_CREATED_PATH = this.BASE_API_URL + '/sse/room_created';
  
  constructor(private _zone: NgZone) {}
  getServerSentEvent(url: string): Observable<any> {
    return Observable.create(observer => {
      const eventSource = this.getEventSource(url);
      eventSource.onmessage = event => {
        this._zone.run(() => {
          observer.next(event);
        });
      };
      eventSource.onerror = error => {
        this._zone.run(() => {
          observer.error(error);
        });
      };
    });
  }

  roomCreated(roomID : string) :Observable<any> {
      return this.getServerSentEvent(this.ROOM_CREATED_PATH + '?rid=' + roomID);
  }

  private getEventSource(url: string): EventSource {
    return new EventSource(url);
  }
}