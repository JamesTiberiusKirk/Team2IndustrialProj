import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RestService } from '../services/rest.service';

import { QuizQuestionsComponent } from '../quiz-questions/quiz-questions.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../app.component.css']
})
export class RegisterComponent implements OnInit {
  userID: string;
  roomKey: string;
  roomID: string;

  constructor(private route: Router, private rest: RestService, private quiz: QuizQuestionsComponent) { }

  ngOnInit() { }

  onSubmit(nick: string) {
    this.rest.register(nick).subscribe((data) => {
      this.userID = data.user_id.toString();

      this.rest.createRoom(this.userID).subscribe((data) => {
        this.roomID = data.room_id.toString();
        this.roomKey = data.room_key.toString();

        this.rest.joinRoom(this.userID, this.roomKey);//.subscribe((data) => { console.log(data) } );

        this.rest.getNextQuestion(this.roomID, this.userID).subscribe((data) => { console.log(data) })

        //this.rest.getNextQuestion('236', '330').subscribe((data) => { console.log(data) });

        //this.quiz.beginQuiz(this.roomID, this.userID);
      })
    })
  }

}
