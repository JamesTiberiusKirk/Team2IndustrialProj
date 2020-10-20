import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from './rest.service';

@Injectable()
export class QuizService {
  qns: any[];
  seconds: number;
  timer;
  qnProgress: number;
  correctAnswerCount: number = 0;

  //---------------- Helper Methods---------------
  constructor(private http: HttpClient, public rest: RestService) { }
  displayTimeElapsed() {
    return Math.floor(this.seconds / 3600) + ':' + Math.floor(this.seconds / 60) + ':' + Math.floor(this.seconds % 60);
  }

  /**getQuestions() {
    this.rest.getNextQuestion('77', '103');
  }*/

  /**getAnswers() {
    var body = this.qns.map(x => x.QnID);
    return this.http.post(this.rootUrl + '/api/Answers', body);
  }

  submitScore() {
    var body = JSON.parse(localStorage.getItem('participant'));
    body.Score = this.correctAnswerCount;
    body.TimeSpent = this.seconds;
    return this.http.post(this.rootUrl + "/api/UpdateOutput", body);
  }*/

}
