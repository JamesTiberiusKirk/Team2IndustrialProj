import { Component } from '@angular/core';
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
      this.setQ(data.question.text);
    });
  }

  setQ(q: string) {
    var question = document.getElementById('q');
    question.innerHTML = q;
  }
  question: Question =
    {
      qs: 'question',
      ans1: 'ans1',
      ans2: 'ans2',
      ans3: 'ans3',
      ans4: 'ans4'
    }
}
