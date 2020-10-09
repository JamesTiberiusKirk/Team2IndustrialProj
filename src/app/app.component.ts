import { Component } from '@angular/core';
import { Question } from './question';
import questionJson from './question.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Quiz';
  question: Question = 
    {
    qs: questionJson.question,
    ans1: questionJson.ans1,
    ans2: questionJson.ans2,
    ans3: questionJson.ans3,
    ans4: questionJson.ans4,
    }
}
export class ReadingJsonFilesComponent {

  constructor() {
   console.log('Reading local json files');
   console.log(questionJson);
  }
}