import { AbstractControl, ValidatorFn } from '@angular/forms';

export function onlyWhiteSpaceValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null =>
    control.value && control.value.trim() === '' ?
      { onlyWhitespace: true } : null;
}
