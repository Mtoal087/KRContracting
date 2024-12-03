import { Component } from '@angular/core';
<<<<<<< HEAD
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
=======
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
>>>>>>> cedf62678dc1a7f330af0f64affa5be252f997d1
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent {
  sortByForm: FormGroup;
  rangeForm: FormGroup;
  rangeFormErrors: any = {};

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
    if (!this.validateRangeForm()){
      return;
    }

    const queryParams: any = {};

    Object.keys(this.sortByForm.controls).forEach((field) => {
      const value = this.sortByForm.get(field)?.value;
      if (value) {
        queryParams[field] = value.toString().toUpperCase();
      }
    });

    Object.keys(this.rangeForm.controls).forEach((field) => {
      const value = this.rangeForm.get(field)?.value;
      if (value) {
        queryParams[field] = value;
      }
    })

    this.router.navigate(['/results'], { queryParams });
  }

  resetForm() {
    this.sortByForm.reset();
    this.rangeForm.reset();
    this.rangeFormErrors = {};
  }

  validateRangeForm(): boolean {
    this.rangeFormErrors = {};
    let isValid = true;
  
    const rangeFields = [
      { from: 'fromTotalAcres', to: 'toTotalAcres', name: 'Total Acres' },
    { from: 'from2024AppraisedValue', to: 'to2024AppraisedValue', name: '2024 Appraised Value' },
    { from: 'from2024AssessedTotal', to: 'to2024AssessedTotal', name: '2024 Assessed Total' },
    { from: 'fromNumberOfYearsWithUnpaidTaxes', to: 'toNumberOfYearsWithUnpaidTaxes', name: 'Number Of Years With Unpaid Taxes' },
    { from: 'fromTotalTaxes', to: 'toTotalTaxes', name: 'Total Taxes' },
    { from: 'fromTotalInterest', to: 'toTotalInterest', name: 'Total Interest' },
    { from: 'fromTotalPenalties', to: 'toTotalPenalties', name: 'Total Penalties' },
    { from: 'fromTotalAmountDue', to: 'toTotalAmountDue', name: 'Total Amount Due' },
    { from: 'fromTotalAmountDueOverAppraisedValue2024', to: 'toTotalAmountDueOverAppraisedValue2024', name: 'Total Amount Due Over Appraised Value 2024' },
    { from: 'fromTotalAmountDueOverAssessedTotal2024', to: 'toTotalAmountDueOverAssessedTotal2024', name: 'Total Amount Due Over Assessed Total 2024' },
    { from: 'fromTotalTaxesPlusTotalSewerLateralFee', to: 'toTotalTaxesPlusTotalSewerLateralFee', name: 'Total Taxes Plus Total Sewer Lateral Fee' }
    ];

    rangeFields.forEach((field) => {
      const fromValue = this.rangeForm.get(field.from)?.value;
      const toValue = this.rangeForm.get(field.to)?.value;

      if ((fromValue && !toValue) || (!fromValue && toValue)) {
        this.rangeFormErrors[field.name] = `Please fill in both "From ${field.name}" and "To ${field.name}" fields.`;
        isValid = false;
      } else if (fromValue && toValue && Number(fromValue) > Number(toValue)) {
        this.rangeFormErrors[field.name] = `"From ${field.name}" should be less than or equal to "To ${field.name}".`;
      }
    });

<<<<<<< HEAD
    const rangeFields = [
      'fromTotalAcres', 'toTotalAcres',
      'from2024AppraisedValue', 'to2024AppraisedValue',
      'from2024AssessedTotal', 'to2024AssessedTotal',
      'fromNumberOfYearsWithUnpaidTaxes', 'toNumberOfYearsWithUnpaidTaxes',
      'fromTotalTaxes', 'toTotalTaxes',
      'fromTotalInterest', 'toTotalInterest',
      'fromTotalPenalties', 'toTotalPenalties',
      'fromTotalAmountDue', 'toTotalAmountDue',
      'fromTotalAmountDueOverAppraisedValue2024', 'toTotalAmountDueOverAppraisedValue2024',
      'fromTotalAmountDueOverAssessedTotal204', 'toTotalAmountDueOverAssessedTotal2024',
      'fromTotalTaxesPlusTotalSewerLateralFee', 'toTotalTaxesPlusTotalSewerLateralFee',
    ];

    rangeFields.forEach((field) => {
      this.rangeForm.get(field)?.setValue('');
    })
=======
    return isValid;
  }

  getRangeErrorKeys(): string[] {
    return Object.keys(this.rangeFormErrors);
>>>>>>> cedf62678dc1a7f330af0f64affa5be252f997d1
  }
}


