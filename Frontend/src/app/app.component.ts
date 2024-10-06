import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Title } from '@angular/platform-browser';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title: string = 'Home';

  constructor(private titleService: Title) {
    this.newTitle(this.title);
  }

  newTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
