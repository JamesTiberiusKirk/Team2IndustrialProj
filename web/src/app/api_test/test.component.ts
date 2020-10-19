import { Component, OnInit } from '@angular/core';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {

  userID: string;
  roomKey: string;
  roomID: string;

  questionID: string;
  answer1ID: string;

  constructor(private rest: RestService) { }

  testRegister() {
    this.rest.register("test335").subscribe((data) => {
      // console.log(data);
      // console.log("the user id is " + data.user_id)

      // the String() part is necessary. I don't know why but it is.
      this.userID = String(data.user_id);
    })
  }

  testCreateRoom() {
    this.rest.createRoom(this.userID).subscribe((data) => {
      // console.log(data);
      // console.log("the room key is " + data.room_key)
      this.roomKey = String(data.room_key);
    })
  }

  testJoinRoom() {
    this.rest.joinRoom(this.userID, this.roomKey).subscribe((data) => {
      // console.log(data);
      // console.log("the room ID is " + data.room_id)
      this.roomID = String(data.room_id);
    })
  }

  testNextQuestion() {
    this.rest.getNextQuestion(this.roomID, this.userID).subscribe((data) => {
      // console.log(data);
      // console.log("the question ID is " + data.question.id + ", q: " + data.question.text);
      // console.log("the first answer ID is " + data.answers[0].id + ", a: " + data.answers[0].text);

      this.questionID = String(data.question.id);
      this.answer1ID = String(data.answers[0].id);
    })
  }

  testPostAnswer() {
    // just sends the first answer as the chosen
    this.rest.postAnswer(this.roomID, this.userID, this.questionID, this.answer1ID).subscribe((data) => {
      // console.log(data);
      // console.log("the answer was " + (data.correct ? "correct" : "incorrect"));
    })
  }

  testGetScores() {
    this.rest.getScores(this.roomID, this.userID).subscribe((data) => {
      // console.log(data);
      // console.log("the highest score was " + data.scores[0].score + " by " + data.scores[0].nick);
    })
  }

}
