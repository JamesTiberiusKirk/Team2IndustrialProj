import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';
import { RegisterComponent } from './register/register.component';
import { QuizQuestionsComponent } from './quiz-questions/quiz-questions.component';
import { ResultComponent } from './result/result.component';
import { QuizService } from './services/quiz.service';
import { QuizComponent } from '../../angular-test/src/app/quiz/quiz.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes),
    FormsModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    LobbyComponent,
    RegisterComponent,
    QuizQuestionsComponent,
    ResultComponent,
  ],
  exports: [],
  providers: [HttpClient, QuizService, QuizQuestionsComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
