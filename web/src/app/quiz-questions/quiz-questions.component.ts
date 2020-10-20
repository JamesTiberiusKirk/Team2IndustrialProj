
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Question } from '../question';

import { QuizService } from '../services/quiz.service';
import { RestService } from '../services/rest.service';

// tslint:disable: no-string-literal
@Component({
  selector: 'app-quiz-questions',
  templateUrl: './quiz-questions.component.html',
  styleUrls: ['../app.component.css', './quiz-questions.component.css']
})
export class QuizQuestionsComponent implements OnInit {

  constructor(private router: Router, private rest: RestService) { }

  ngOnInit() {
    /**if (parseInt(localStorage.getItem('seconds')) > 0) {
      this.quizService.seconds = parseInt(localStorage.getItem('seconds'));
      this.quizService.qnProgress = parseInt(localStorage.getItem('qnProgress'));

      if (this.quizService.qnProgress == 10)
        this.router.navigate(['/result']);
      else
        this.startTimer();
    }
    else {
      this.quizService.seconds = 0;

      this.quizService.qnProgress = 0;

      /**this.quizService.getQuestions().subscribe(
        (data: any) => {
          console.log(data);
          this.quizService.qns = data;
          this.startTimer();
        }
      );*/
      //this.rest.postAnswer('77', '103', '1', 'c').subscribe((data) => { console.log(data) });
    //this.rest.getNextQuestion('856567', '103').subscribe((data) => { console.log(data) });
    //}
  }

  /**startTimer() {
    this.quizService.timer = setInterval(() => {
      this.quizService.seconds++;
      localStorage.setItem('seconds', this.quizService.seconds.toString());
    }, 1000);
  }*/

  /**Answer(qID, choice) {
    this.quizService.qns[this.quizService.qnProgress].answer = choice;
    localStorage.setItem('qns', JSON.stringify(this.quizService.qns));
    this.quizService.qnProgress++;
    localStorage.setItem('qnProgress', this.quizService.qnProgress.toString());
    if (this.quizService.qnProgress == 10) {
      clearInterval(this.quizService.timer);
      this.router.navigate(['/result']);
    }
  }*/

  beginQuiz(roomID: string, userID: string) {

    //this.rest.getNextQuestion(roomID, userID).subscribe((data) => { console.log(data) });
  }

}
