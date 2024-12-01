import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DatabaseService } from '../services/database.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  providers: [DatabaseService],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent implements OnInit {
  title: string = 'Results';
  dataArray: any[] = [];
  cityCode: string = '';
  cityName: string = '';
  landUseCode: string = '';
  schoolDistrict: string = '';
  propertyClass: string = '';
  sortBy: string = '';
  order: 'ASC' | 'DESC' = 'ASC';
  limit: number = 20;
  offset: number = 0;

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private database: DatabaseService,
  ) {
    this.newTitle(this.title);
  }

  ngOnInit() {
    this.cityCode = this.route.snapshot.queryParamMap.get('cityCode') || '';
    this.cityName = this.route.snapshot.queryParamMap.get('cityName') || '';
    this.landUseCode =
      this.route.snapshot.queryParamMap.get('landUseCode') || '';
    this.schoolDistrict =
      this.route.snapshot.queryParamMap.get('schoolDistrict') || '';
    this.propertyClass =
      this.route.snapshot.queryParamMap.get('propertyClass') || '';

    this.fetchData();
  }

  fetchData() {
    const params: any = {};

    if (this.cityCode) params.cityCode = this.cityCode;
    if (this.cityName) params.cityName = this.cityName;
    if (this.landUseCode) params.landUseCode = this.landUseCode;
    if (this.schoolDistrict) params.schoolDistrict = this.schoolDistrict;
    if (this.propertyClass) params.propertyClass = this.propertyClass;

    console.log(params);

    this.database.getFilteredData(params, this.limit).subscribe((res: any) => {
      this.dataArray = res.data;
      console.log(res.data);
    });
  }

  sortData(field: string) {
    this.sortBy = field;
    this.order = this.order === 'ASC' ? 'DESC' : 'ASC';
    this.database
      .getSortedData(this.sortBy, this.order, this.limit)
      .subscribe((res: any) => {
        this.dataArray = res.data;
      });
  }

  newTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  displayValue(value: any): string {
    return value === null || value === undefined || value.trim() === ''
      ? 'None'
      : value;
  }

  isLink(value: any): boolean {
    if (this.displayValue(value) === 'None') {
      return false;
    }
    return true;
  }
}
