import { Component, OnInit } from '@angular/core';
import { Score } from '../score';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  currentScore: Score = {
    PlayerID: 1,
    nickname: "Chris",
    CurrentScore: 0
  };
  constructor() { }

  ngOnInit(): void {
  }

}
