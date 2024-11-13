import { Routes } from '@angular/router';
import { HowToUseComponent } from './how-to-use/how-to-use.component';
import { HomeComponent } from './home/home.component';
import { ResultsComponent } from './results/results.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'how-to-use', component: HowToUseComponent },
  { path: 'results', component: ResultsComponent },
];
