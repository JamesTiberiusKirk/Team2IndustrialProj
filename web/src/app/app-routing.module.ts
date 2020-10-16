import { Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { QuizQuestionsComponent } from './quiz-questions/quiz-questions.component';
import { ResultComponent } from './result/result.component';
import { TestComponent } from './api_test/test.component';

export const AppRoutes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'quiz-questions', component: QuizQuestionsComponent },
  { path: 'result', component: ResultComponent },
  { path: 'test', component: TestComponent },
  { path: '', redirectTo: '/register', pathMatch: 'full' }
];

