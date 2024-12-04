import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ResultsComponent } from './results/results.component';

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  // { path: 'home', component: HomeComponent },
  { path: 'search', component: ResultsComponent },
];
