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
  @Input() filters: any = {}; // Filters passed from the parent
  @Output() filtersUpdated = new EventEmitter<any>(); // Emit updated filters to the parent
  @Output() close = new EventEmitter<void>(); // Emit an event to close the modal

  applyFilters() {
    this.filtersUpdated.emit(this.filters); // Pass updated filters back
    this.closeModal();
  }

  closeModal() {
    this.close.emit(); // Notify the parent to close the modal
  }
}
