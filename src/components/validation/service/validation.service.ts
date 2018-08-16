/*In-Builts*/
import { Injectable } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms';

@Injectable()

export class ValidationService {

    /* Validation Event and Css */
    isFieldValid(field: string, form: FormGroup, isConditioned: boolean) {
        if (!isConditioned) {
            return !form.get(field).valid && form.get(field).touched;
        }
        else {
            return false;
        }
    }
    displayFieldCss(field: string, form: FormGroup, isConditioned: boolean) {
        return {
            'has-error': this.isFieldValid(field, form, isConditioned),
            'has-feedback': this.isFieldValid(field, form, isConditioned)
        };
    }
    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                if (control.status !== "DISABLED") {
                    control.markAsTouched({ onlySelf: true });
                }
            }
        });
    }

}