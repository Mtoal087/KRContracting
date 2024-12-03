import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
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

    let fieldsMismatch = false;

    for (let i = 0; i < rangeFields.length; i += 2) {
      const fromField = this.rangeForm.get(rangeFields[i]);
      const toField = this.rangeForm.get(rangeFields[i + 1]);

      const fromValue = fromField?.value;
      const toValue = toField?.value;

      const isFromFilled = fromValue && fromValue !== '';
      const isToFilled = toValue && toValue !== '';

      if ((isFromFilled && !isToFilled) || (!isFromFilled && isToFilled)) {
        fieldsMismatch = true;
        break;
      }
    }

    if (fieldsMismatch) {
      this.rangeForm.setErrors({ fieldsMismatch: true });
      console.log('Both "From" and "To" fields must be filled out together for each pair.');
      return;
    }

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
  }
}
