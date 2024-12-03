import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DatabaseService } from '../services/database.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [DatabaseService],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit {
  title: string = 'Results';
  dataArray: any[] = [];
  cityCode: string = '';
  cityName: string = '';
  landUseCode: string = '';
  schoolDistrict: string = '';
  propertyClass: string = '';
  fromTotalAcres: string = '';
  toTotalAcres: string = '';
  from2024AssessedTotal: string = '';
  to2024AssessedTotal: string = '';
  from2024AppraisedValue: string = '';
  to2024AppraisedValue: string = '';
  fromNumberOfYearsWithUnpaidTaxes: string = '';
  toNumberOfYearsWithUnpaidTaxes: string = '';
  fromTotalTaxes: string = '';
  toTotalTaxes: string = '';
  fromTotalInterest: string = '';
  toTotalInterest: string = '';
  fromTotalPenalties: string = '';
  toTotalPenalties: string = '';
  fromTotalAmountDue: string = '';
  toTotalAmountDue: string = '';
  fromTotalAmountDueOverAppraisedValue2024: string = '';
  toTotalAmountDueOverAppraisedValue2024: string = '';
  fromTotalAmountDueOverAssessedTotal2024: string = '';
  toTotalAmountDueOverAssessedTotal2024: string = '';
  fromTotalTaxesPlusTotalSewerLateralFee: string = '';
  toTotalTaxesPlusTotalSewerLateralFee: string = '';
  sortBy: string = '';
  order: 'ASC' | 'DESC' = 'ASC';

  // Pagination properties
  limit: number = 10; // Records per page
  offset: number = 0;
  currentPage: number = 1;
  totalRecords: number = 0;

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private database: DatabaseService,
  ) {
    this.newTitle(this.title);
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;

    this.cityCode = params.get('cityCode') || '';
    this.cityName = params.get('cityName') || '';
    this.landUseCode = params.get('landUseCode') || '';
    this.schoolDistrict = params.get('schoolDistrict') || '';
    this.propertyClass = params.get('propertyClass') || '';
    this.fromTotalAcres = params.get('fromTotalAcres') || '';
    this.toTotalAcres = params.get('toTotalAcres') || '';
    this.from2024AssessedTotal = params.get('from2024AssessedTotal') || '';
    this.to2024AssessedTotal = params.get('to2024AssessedTotal') || '';
    this.from2024AppraisedValue = params.get('from2024AppraisedValue') || '';
    this.to2024AppraisedValue = params.get('to2024AppraisedValue') || '';
    this.fromNumberOfYearsWithUnpaidTaxes = params.get('fromNumberOfYearsWithUnpaidTaxes') || '';
    this.toNumberOfYearsWithUnpaidTaxes = params.get('toNumberOfYearsWithUnpaidTaxes') || '';
    this.fromTotalTaxes = params.get('fromTotalTaxes') || '';
    this.toTotalTaxes = params.get('toTotalTaxes') || '';
    this.fromTotalInterest = params.get('fromTotalInterest') || '';
    this.toTotalInterest = params.get('toTotalInterest') || '';
    this.fromTotalPenalties = params.get('fromTotalPenalties') || '';
    this.toTotalPenalties = params.get('toTotalPenalties') || '';
    this.fromTotalAmountDue = params.get('fromTotalAmountDue') || '';
    this.toTotalAmountDue = params.get('toTotalAmountDue') || '';
    this.fromTotalAmountDueOverAppraisedValue2024 = params.get('fromTotalAmountDueOverAppraisedValue2024') || '';
    this.toTotalAmountDueOverAppraisedValue2024 = params.get('toTotalAmountDueOverAppraisedValue2024') || '';
    this.fromTotalAmountDueOverAssessedTotal2024 = params.get('fromTotalAmountDueOverAssessedTotal2024') || '';
    this.toTotalAmountDueOverAssessedTotal2024 = params.get('toTotalAmountDueOverAssessedTotal2024') || '';
    this.fromTotalTaxesPlusTotalSewerLateralFee = params.get('fromTotalTaxesPlusTotalSewerLateralFee') || '';
    this.toTotalTaxesPlusTotalSewerLateralFee = params.get('toTotalTaxesPlusTotalSewerLateralFee') || '';

    this.fetchData();
  }

  fetchData() {
    const params: any = {};

    if (this.cityCode) params.cityCode = this.cityCode.toUpperCase();
    if (this.cityName) params.cityName = this.cityName.toUpperCase();
    if (this.landUseCode) params.landUseCode = this.landUseCode.toUpperCase();
    if (this.schoolDistrict)
      params.schoolDistrict = this.schoolDistrict.toUpperCase();
    if (this.propertyClass) params.propertyClass = this.propertyClass;

    if (this.fromTotalAcres && this.toTotalAcres) {
      params.fromTotalAcres = this.fromTotalAcres;
      params.toTotalAcres = this.toTotalAcres;
    }
    if (this.from2024AssessedTotal && this.to2024AssessedTotal) {
      params.from2024AssessedTotal = this.from2024AssessedTotal;
      params.to2024AssessedTotal = this.to2024AssessedTotal;
    }
    if (this.from2024AppraisedValue && this.to2024AppraisedValue) {
      params.from2024AppraisedValue = this.from2024AppraisedValue;
      params.to2024AppraisedValue = this.to2024AppraisedValue;
    }
    if (this.fromNumberOfYearsWithUnpaidTaxes && this.toNumberOfYearsWithUnpaidTaxes) {
      params.fromNumberOfYearsWithUnpaidTaxes = this.fromNumberOfYearsWithUnpaidTaxes;
      params.toNumberOfYearsWithUnpaidTaxes = this.toNumberOfYearsWithUnpaidTaxes;
    }
    if (this.fromTotalTaxes && this.toTotalTaxes) {
      params.fromTotalTaxes = this.fromTotalTaxes;
      params.toTotalTaxes = this.toTotalTaxes;
    }
    if (this.fromTotalInterest && this.toTotalInterest) {
      params.fromTotalInterest = this.fromTotalInterest;
      params.toTotalInterest = this.toTotalInterest;
    }
    if (this.fromTotalPenalties && this.toTotalPenalties) {
      params.fromTotalPenalties = this.fromTotalPenalties;
      params.toTotalPenalties = this.toTotalPenalties;
    }
    if (this.fromTotalAmountDue && this.toTotalAmountDue) {
      params.fromTotalAmountDue = this.fromTotalAmountDue;
      params.toTotalAmountDue = this.toTotalAmountDue;
    }
    if (this.fromTotalAmountDueOverAppraisedValue2024 && this.toTotalAmountDueOverAppraisedValue2024) {
      params.fromTotalAmountDueOverAppraisedValue2024 = this.fromTotalAmountDueOverAppraisedValue2024;
      params.toTotalAmountDueOverAppraisedValue2024 = this.toTotalAmountDueOverAppraisedValue2024;
    }
    if (this.fromTotalAmountDueOverAssessedTotal2024 && this.toTotalAmountDueOverAssessedTotal2024) {
      params.fromTotalAmountDueOverAssessedTotal2024 = this.fromTotalAmountDueOverAssessedTotal2024;
      params.toTotalAmountDueOverAssessedTotal2024 = this.toTotalAmountDueOverAssessedTotal2024;
    }
    if (this.fromTotalTaxesPlusTotalSewerLateralFee && this.toTotalTaxesPlusTotalSewerLateralFee) {
      params.fromTotalTaxesPlusTotalSewerLateralFee = this.fromTotalTaxesPlusTotalSewerLateralFee;
      params.toTotalTaxesPlusTotalSewerLateralFee = this.toTotalTaxesPlusTotalSewerLateralFee;
    }

    // Include sorting parameters if applicable
    if (this.sortBy) {
      params.sortBy = this.sortBy;
      params.order = this.order;
    }

    // Calculate offset
    this.offset = (this.currentPage - 1) * this.limit;

    console.log(params);

    this.database.getFilteredData(params, this.limit, this.offset).subscribe((res: any) => {
      this.dataArray = res.data;
      this.totalRecords = res.totalCount || 0;
      console.log(res.data);
    });
  }

  sortData(field: string) {
    if (this.sortBy === field) {
      // Toggle between ASC and DESC if the same field is clicked
      this.order = this.order === 'ASC' ? 'DESC' : 'ASC';
    } else {
      // If a new field is clicked, default to ASC
      this.sortBy = field;
      this.order = 'ASC';
    }
    this.currentPage = 1; // Reset to first page on sort
    this.fetchData();
  }

  newTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  displayValue(value: any): string {
    return value === null || value === undefined || value.toString().trim() === ''
      ? 'None'
      : value;
  }

  isLink(value: any): boolean {
    return this.displayValue(value) !== 'None';
  }

  // Pagination methods
  totalPages(): number {
    return Math.ceil(this.totalRecords / this.limit);
  }

  getPages(): (number | string)[] {
    const totalPages = this.totalPages();
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // More than 5 pages
      const currentPage = this.currentPage;
      let startPage: number, endPage: number;

      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        pages.push('...');
      }
    }

    return pages;
  }

  goToPage(page: number | string) {
    if (page === '...') {
      // Handle ellipsis click: go to the next page group
      const totalPages = this.totalPages();
      const lastPageInCurrentGroup = Math.min(this.currentPage + 2, totalPages);
      if (lastPageInCurrentGroup + 1 <= totalPages) {
        this.currentPage = lastPageInCurrentGroup + 1;
      } else {
        this.currentPage = totalPages;
      }
    } else if (typeof page === 'number') {
      const totalPages = this.totalPages();
      if (page >= 1 && page <= totalPages) {
        this.currentPage = page;
      }
    }
    this.fetchData();
  }

  // Optional: TrackBy function for *ngFor
  trackByFn(index: number, item: any): any {
    return item.LocatorNumber; // Use a unique identifier from your data
  }

  resetFilters() {
    this.cityCode = '';
    this.cityName = '';
    this.landUseCode = '';
    this.schoolDistrict = '';
    this.propertyClass = '';

    this.fetchData();
  }
}
