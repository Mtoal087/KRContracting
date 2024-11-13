import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-how-to-use',
  standalone: true,
  imports: [],
  templateUrl: './how-to-use.component.html',
  styleUrl: './how-to-use.component.css',
})
export class HowToUseComponent {
  title: string = 'How-To-Use';

  constructor(private titleService: Title) {
    this.newTitle(this.title);
  }

  newTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
