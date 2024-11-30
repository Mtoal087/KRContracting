import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DatabaseService } from '../services/database.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [HttpClientModule],
  providers: [DatabaseService],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent implements OnInit {
  start: string = '';
  end: string = '';

  title: string = 'Results';

  dataArray: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private database: DatabaseService,
  ) {
    this.newTitle(this.title);
  }

  ngOnInit() {
    this.start = this.route.snapshot.queryParamMap.get('start')!;
    this.end = this.route.snapshot.queryParamMap.get('end')!;

    this.database.getData(20).subscribe((res: any) => {
      this.dataArray = res.data;
      console.log(res.data);
    });
  }

  newTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  displayValue(value: any): string {
    return value === null ||
      value === undefined ||
      value === '' ||
      value === ' '
      ? 'N/A'
      : value;
  }
}
