import { Component } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { Title } from '@angular/platform-browser';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LogoComponent, FormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  title: string = 'Home';

  constructor(private titleService: Title) {
    this.newTitle(this.title);
  }

  newTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
