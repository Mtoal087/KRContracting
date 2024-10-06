import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormSubmitService {
  private startValue: string = '';
  private endValue: string = '';

  setStartValue(start: string) {
    this.startValue = start;
  }

  setEndValue(end: string) {
    this.endValue = end;
  }

  getStartValue() {
    return this.startValue;
  }

  getEndValue() {
    return this.endValue;
  }
}
