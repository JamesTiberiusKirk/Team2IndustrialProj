import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css','../app.component.css']
})
export class ResultComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    /*var s = document.getElementById('score');
    console.log(s);*/
    this.displayResults(3, "bob");
  }

  displayResults(score: number, nick: string) {
    var s = document.getElementById('score ');
    console.log(s);
    s.innerHTML = "4";
  }

  onSubmit() {
    this.router.navigate(['/register']);
  }

}
