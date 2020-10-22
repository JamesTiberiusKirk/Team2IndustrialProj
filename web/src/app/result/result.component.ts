import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css','../app.component.css']
})
export class ResultComponent implements OnInit {

  constructor(private router: Router, private rest: RestService) { }

  ngOnInit(): void { }

  getResults(roomID: string, userID: string) {
    this.rest.getScores(roomID, userID).subscribe((data) => {
      this.displayResults(data.scores[0].score, data.scores[0].nick);
    });
  }

  displayResults(score: number, nick: string) {
    var nickNode = document.createTextNode(nick);
    var scoreNode = document.createTextNode(score.toString());

    var nickDisplay = document.getElementById('scores').childNodes[0].lastChild;
    nickDisplay.replaceChild(nickNode, nickDisplay.childNodes[0]);

    var scoreDisplay = document.getElementById('scores').childNodes[1].lastChild;
    scoreDisplay.replaceChild(scoreNode, scoreDisplay.childNodes[0]);
  }

  onSubmit() {
    this.router.navigate(['/register']);
  }

}
