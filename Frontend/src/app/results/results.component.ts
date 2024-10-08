import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // this.start = this.formSubmitService.getStartValue();
    // this.end = this.formSubmitService.getEndValue();
    this.start = this.route.snapshot.queryParamMap.get('start')!;
    this.end = this.route.snapshot.queryParamMap.get('end')!;
  }
}
