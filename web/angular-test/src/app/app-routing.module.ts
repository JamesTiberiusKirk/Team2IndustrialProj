import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { QuizComponent } from './quiz/quiz.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';

const routes: Routes = [
  {path: 'lobby', component: LobbyComponent},
  {path: 'quiz', component: QuizComponent},
  {path: 'scores', component: ScoreboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
