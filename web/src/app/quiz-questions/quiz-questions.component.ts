import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-quiz-questions',
  templateUrl: './quiz-questions.component.html',
  styleUrls: ['../app.component.css']
})
export class QuizQuestionsComponent {

  constructor(private router: Router, private rest: RestService) { }

  startQuiz(roomId: string, userId: string) {
    this.rest.getNextQuestion(roomId, userId).subscribe((data) => {
      this.setQ(data.question.text);
    });
  }

  setQ(q: string) {
    var question = document.getElementById('q');
    question.innerHTML = q;
  }
}
