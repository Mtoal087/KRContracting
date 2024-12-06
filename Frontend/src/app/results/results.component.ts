import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DatabaseService } from '../services/database.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FiltersModalComponent } from './filters-modal/filters-modal.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, FiltersModalComponent],
  providers: [DatabaseService],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit {
  title: string = 'Search';
  dataArray: any[] = [];
  filters: any = {
    cityCode: '',
    cityName: '',
    landUseCode: '',
    schoolDistrict: '',
    propertyClass: '',
    fromTotalAcres: '',
    toTotalAcres: '',
    from2024AssessedTotal: '',
    to2024AssessedTotal: '',
    from2024AppraisedValue: '',
    to2024AppraisedValue: '',
    fromNumberOfYearsWithUnpaidTaxes: '',
    toNumberOfYearsWithUnpaidTaxes: '',
    fromTotalTaxes: '',
    toTotalTaxes: '',
    fromTotalInterest: '',
    toTotalInterest: '',
    fromTotalPenalties: '',
    toTotalPenalties: '',
    fromTotalAmountDue: '',
    toTotalAmountDue: '',
    fromTotalAmountDueOverAppraisedValue2024: '',
    toTotalAmountDueOverAppraisedValue2024: '',
    fromTotalAmountDueOverAssessedTotal2024: '',
    toTotalAmountDueOverAssessedTotal2024: '',
    fromTotalTaxesPlusTotalSewerLateralFee: '',
    toTotalTaxesPlusTotalSewerLateralFee: '',
  };
  isModalOpen: boolean = false;

  // Pagination properties
  limit: number = 20;
  offset: number = 0;
  currentPage: number = 1;
  totalRecords: number = 0;
  sortBy: string = '';
  order: 'ASC' | 'DESC' = 'ASC';

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private database: DatabaseService,
  ) {
    this.newTitle(this.title);
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    Object.keys(this.filters).forEach((key) => {
      this.filters[key] = params.get(key) || '';
    });
    this.fetchData();
  }

  fetchData() {
    console.log('results: fetchData()', this.filters);
    this.database.getFilteredData(this.filters, this.limit, this.offset).subscribe((res: any) => {
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
    this.filters = {
      cityCode: '',
      cityName: '',
      landUseCode: '',
      schoolDistrict: '',
      propertyClass: '',
      fromTotalAcres: '',
      toTotalAcres: '',
      from2024AssessedTotal: '',
      to2024AssessedTotal: '',
      from2024AppraisedValue: '',
      to2024AppraisedValue: '',
      fromNumberOfYearsWithUnpaidTaxes: '',
      toNumberOfYearsWithUnpaidTaxes: '',
      fromTotalTaxes: '',
      toTotalTaxes: '',
      fromTotalInterest: '',
      toTotalInterest: '',
      fromTotalPenalties: '',
      toTotalPenalties: '',
      fromTotalAmountDue: '',
      toTotalAmountDue: '',
      fromTotalAmountDueOverAppraisedValue2024: '',
      toTotalAmountDueOverAppraisedValue2024: '',
      fromTotalAmountDueOverAssessedTotal2024: '',
      toTotalAmountDueOverAssessedTotal2024: '',
      fromTotalTaxesPlusTotalSewerLateralFee: '',
      toTotalTaxesPlusTotalSewerLateralFee: '',
    };

    // Reset pagination
    this.currentPage = 1;

    // Fetch data
    this.fetchData();
  }

  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  updateFilters(newFilters: any) {
    console.log('results/ updateFilters()', newFilters);
    this.filters = { ...this.filters, ...newFilters };
    this.fetchData();
    this.closeModal();
  }
}
