import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  sortByForm: FormGroup;
  rangeForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.sortByForm = this.formBuilder.group({
      cityCode: [''],
      cityName: [''],
      landUseCode: [''],
      schoolDistrict: [''],
      propertyClass: [''],
    });

    this.rangeForm = this.formBuilder.group({
      fromTotalAcres: [''],
      toTotalAcres: [''],
      from2024AppraisedValue: [''],
      to2024AppraisedValue: [''],
      from2024AssessedTotal: [''],
      to2024AssessedTotal: [''],
      fromNumberOfYearsWithUnpaidTaxes: [''],
      toNumberOfYearsWithUnpaidTaxes: [''],
      fromTotalTaxes: [''],
      toTotalTaxes: [''],
      fromTotalInterest: [''],
      toTotalInterest: [''],
      fromTotalPenalties: [''],
      toTotalPenalties: [''],
      fromTotalAmountDue: [''],
      toTotalAmountDue: [''],
      fromTotalAmountDueOverAppraisedValue2024: [''],
      toTotalAmountDueOverAppraisedValue2024: [''],
      fromTotalAmountDueOverAssessedTotal204: [''],
      toTotalAmountDueOverAssessedTotal2024: [''],
      fromTotalTaxesPlusTotalSewerLateralFee: [''],
      toTotalTaxesPlusTotalSewerLateralFee: [''],
    });
  }

  submitForm() {
    const queryParams: any = {};

    const sortByFields = [
      'cityCode',
      'cityName',
      'landUseCode',
      'schoolDistrict',
      'propertyClass',
    ];

    sortByFields.forEach((field: string) => {
      const value = this.sortByForm.get(field)?.value;
      if (value) {
        queryParams[field] = value.toUpperCase();
      }
    });

    this.router.navigate(['/results'], { queryParams });
  }

  resetForm() {
    const formFields = [
      'cityCode',
      'cityName',
      'landUseCode',
      'schoolDistrict',
      'propertyClass',
    ];

    formFields.forEach((field) => {
      this.sortByForm.get(field)?.setValue('');
    });
  }
}
