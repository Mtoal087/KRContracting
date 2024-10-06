import { Component, OnInit } from '@angular/core';
import { FormSubmitService } from '../services/formSubmit.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent implements OnInit {
  start: string = '';
  end: string = '';

  constructor(private formSubmitService: FormSubmitService) {}

  ngOnInit() {
    this.start = this.formSubmitService.getStartValue();
    this.end = this.formSubmitService.getEndValue();
  }
}
