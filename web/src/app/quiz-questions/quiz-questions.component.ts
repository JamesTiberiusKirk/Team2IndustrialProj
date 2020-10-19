
import { Component, OnInit } from '@angular/core';
import { Question } from '../question';
import { questionJson } from './question.mock';

// tslint:disable: no-string-literal
@Component({
  selector: 'app-quiz-questions',
  templateUrl: './quiz-questions.component.html',
  styleUrls: ['../app.component.css', './quiz-questions.component.css']
})
export class QuizQuestionsComponent implements OnInit {
  title = 'Quiz';
  question: Question =
    {
      qs: questionJson['question'],
      ans1: questionJson['ans1'],
      ans2: questionJson['ans2'],
      ans3: questionJson['ans3'],
      ans4: questionJson['ans4']
    }
  constructor() { }

  ngOnInit(): void {
  }

}
export class ReadingJsonFilesComponent {

  constructor() {
    console.log('Reading local json files');
    console.log(questionJson);
  }
}