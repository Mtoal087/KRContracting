import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  form: FormGroup;
  error: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      start: ['', [Validators.required, Validators.minLength(2)]],
      end: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  submitForm() {
    const start = this.form.get('start')!.value;
    const end = this.form.get('end')!.value;

    if (start.length < 2 || end.length < 2) {
      this.error = true;
      console.error(this.error);
      return;
    }

    this.router.navigate(['/results'], {
      queryParams: { start: start, end: end },
    });
  }

  resetForm() {
    this.form.get('start')?.setValue('');
    this.form.get('end')?.setValue('');
    this.error = false;
  }
}
