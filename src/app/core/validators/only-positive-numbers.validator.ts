import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function onlyPositiveNumbers(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value !== null && value !== undefined && value <= 0) {
      return { 'isNotPositive': true };
    }
    return null;
  };
}
