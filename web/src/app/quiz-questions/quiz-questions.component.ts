import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../services/rest.service';
import { Question } from '../question';

@Component({
  selector: 'app-quiz-questions',
  templateUrl: './quiz-questions.component.html',
  styleUrls: ['../app.component.css', './quiz-questions.component.css']
})
export class QuizQuestionsComponent {

  constructor(private router: Router, private rest: RestService) { }

  question: Question =
    {
      qs: 'question',
      ans1: 'Placeholder answer1',
      ans2: 'Placeholder answer2',
      ans3: 'Placeholder answer3',
      ans4: 'Placeholder answer4'
    }
  startQuiz(roomId: string, userId: string) {
    this.rest.getNextQuestion(roomId, userId).subscribe((data) => {
      this.setQ(data.question.text);
      var a, b, c, d;
      
      
      
      
      this.setAnswers(a = data.answers[0].text, b = data.answers[1].text, c = data.answers[2].text, d = data.answers[3].text);
    });
  }

  setQ(q: string) {
    var question = document.getElementById('q');
    question.innerHTML = q;
  }
  setAnswers(a1: string, a2: string, a3: string, a4: string) {
    //console.log("setting answers..")
    document.getElementById('buttonA').innerHTML = a1;
    document.getElementById('buttonB').innerHTML = a2;
    document.getElementById('buttonC').innerHTML = a3;
    document.getElementById('buttonD').innerHTML = a4;
  }


}
