/*In-Builts*/
import { Injectable, OnInit } from '@angular/core';

/*Constants & Enums*/
import { AppConstant } from '../constants/app.constants';


@Injectable()

export class AppAlertService implements OnInit {
    private successMessage: string;
    private errorMessage: string;
    private isError: boolean;
    private isSuccess: boolean;

    constructor() {
        this.reset();
    }

    ngOnInit() { }

    setAlertText(text: string, alertType: string) {
        if (alertType == AppConstant.SuccessAlert) {
            this.setAlertData('', false, text, true);
        }
        else if (alertType == AppConstant.ErrorAlert) {
            this.setAlertData(text, true, '', false);
        }
    }

    hideSuccess() {
        this.isSuccess = false;
    }

    isSuccessShowHide(): boolean {
        return this.isSuccess;
    }

    successText(): string {
        return this.successMessage;
    }

    hideError() {
        this.isError = false;
    }

    isErrorShowHide(): boolean {
        return this.isError;
    }

    errorText(): string {
        return this.errorMessage;
    }

    reset() {
        this.successMessage = "";
        this.errorMessage = "";
        this.isError = false;
        this.isSuccess = false;
    }

    private setAlertData(errorText: string, error: boolean, successText: string, success: boolean) {
        this.isError = error;
        this.errorMessage = errorText;
        this.isSuccess = success;
        this.successMessage = successText;
    }
}