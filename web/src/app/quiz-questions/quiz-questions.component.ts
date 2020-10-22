import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { RestService } from '../services/rest.service';

import { Question } from '../question';

@Component({
  selector: 'app-quiz-questions',
  templateUrl: './quiz-questions.component.html',
  styleUrls: ['../app.component.css']
})
export class QuizQuestionsComponent {

  constructor(private router: Router, private rest: RestService) { }

  startQuiz(roomId: string, userId: string) {
   
    this.rest.getNextQuestion(roomId, userId).subscribe((data) => {
        var q: Question = {
          qs: data.question.text,
          ans1: data.answers[0].text,
          ans2: data.answers[1].text,
          ans3: data.answers[2].text,
          ans4: data.answers[3].text,
      }
      this.setQ(q.qs);
      this.getOptions(q.ans1, q.ans2, q.ans3, q.ans4,
        data.answers[0].id, data.answers[1].id, data.answers[2].id, data.answers[3].id, roomId, userId, data.question.id);
    });
  }

  setQ(q: string) {
    var question = document.getElementById('q');
    question.innerHTML = q;
  }

  getOptions(op1: string, op2: string, op3: string, op4: string,
    op1Id: string, op2Id: string, op3Id: string, op4Id: string,
    roomId: string, userId: string, qId: string) {
    var option1, option2, option3, option4;

    option1 = document.getElementById('op1');
    option1.innerHTML = op1;
    option1.name = op1Id + ' ' + roomId + ' ' + userId + ' ' + qId;

    option2 = document.getElementById('op2');
    option2.innerHTML = op2;
    option2.name = op2Id + ' ' + roomId + ' ' + userId + ' ' + qId;

    option3 = document.getElementById('op3');
    option3.innerHTML = op3;
    option3.name = op3Id + ' ' + roomId + ' ' + userId + ' ' + qId;

    option4 = document.getElementById('op4');
    option4.innerHTML = op4;
    option4.name = op4Id + ' ' + roomId + ' ' + userId + ' ' + qId;
  }

  opChosen(id: string) {
    let x = id.split(' ');

    var ansID = x[0];
    var roomID = x[1];
    var userID = x[2];
    var qID = x[3]

    this.rest.postAnswer(roomID, userID, qID, ansID).subscribe((data) => {
      this.nextQ(roomID, userID);
    });
  }

  nextQ(roomID: string, userID: string) {
    this.rest.getNextQuestion(roomID, userID).subscribe((data) => {
      var q: Question = {
        qs: data.question.text,
        ans1: data.answers[0].text,
        ans2: data.answers[1].text,
        ans3: data.answers[2].text,
        ans4: data.answers[3].text,
      }

      this.setQ(q.qs);
      this.getOptions(q.ans1, q.ans2, q.ans3, q.ans4,
        data.answers[0].id, data.answers[1].id, data.answers[2].id, data.answers[3].id, roomID, userID, data.question.id);
    });
  }
}
