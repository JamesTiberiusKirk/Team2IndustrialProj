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

        this.rest.joinRoom(this.userID, this.roomKey).subscribe((data) => {
          //for (var i = 0; i < 8; i++){
            this.quiz.startQuiz(this.roomID, this.userID);
          //}
        })
      })
    })

    this.route.navigate(['/quiz-questions']);
  }

}
