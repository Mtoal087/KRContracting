import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormComponent } from '../../form/form.component';

@Component({
  selector: 'app-filters-modal',
  standalone: true,
  imports: [FormsModule, FormComponent],
  templateUrl: './filters-modal.component.html',
  styleUrl: './filters-modal.component.css'
})
export class FiltersModalComponent {
  @Input() filters: any = {};
  @Output() filtersUpdated = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();
  formFilters: any;

  constructor() {
    console.log(this.filters)  
  }

  filtersFromForm(newFilters: any) {
    this.formFilters = newFilters;
    this.filters = { ...this.filters, ...this.formFilters }
    console.log('filters from form:', this.filters)
    this.applyFilters();
  }

  applyFilters() {
    this.filtersUpdated.emit(this.filters);
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }
}
