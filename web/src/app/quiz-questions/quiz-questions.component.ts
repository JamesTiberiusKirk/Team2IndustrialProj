import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-quiz-questions',
  templateUrl: './quiz-questions.component.html',
  styleUrls: ['../app.component.css']
})
export class QuizQuestionsComponent {
  question: string;

  constructor(private router: Router, private rest: RestService) { }

  startQuiz(roomId: string, userId: string) {
    this.rest.getNextQuestion(roomId, userId).subscribe((data) => {
      this.getQ(data.question.text);
    });
  }

  getQ(q: string) {
    this.question = q;
    console.log(this.question);
  }
}
