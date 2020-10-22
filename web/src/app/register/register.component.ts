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

  /**
   * Adds user to a room
   * @param nick - username entered by user
   */
  onSubmit(nick: string) {
    //Gets user ID
    this.rest.register(nick).subscribe((data) => {
      this.userID = data.user_id.toString();

      //Creates room - gets room ID and room key
      this.rest.createRoom(this.userID).subscribe((data) => {
        this.roomID = data.room_id.toString();
        this.roomKey = data.room_key.toString();

        //Allows user to join room
        this.rest.joinRoom(this.userID, this.roomKey).subscribe((data) => {
            this.quiz.startQuiz(this.roomID, this.userID);
        })
      })
    })

    //'Moves'/navigates to quiz page
    this.route.navigate(['/quiz-questions']);
  }

}
