
import { Component, Input, Output, SimpleChanges, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { AppConstant } from '../../constants/app.constants';
import { IconConstant } from '../../constants/icon.constant';
import { PagingAction } from '../../enums/common.enums';

import { AppAlertService } from '../../shared/appAlert.service';
import { UserInfoService } from '../../shared/userInfo.service';
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';
import { ParameterModel } from '../../models/parameterModel';




@Component({
    selector: 'app-parameter',
    templateUrl: './parameter.component.html',
    styleUrls:['./parameter.component.css']
})

export class ParameterComponent implements OnInit, OnChanges {
    /*Input & Output property*/
    @Input() DeviceCode: string = "";
    @Input() ParameterList: ParameterModel[];
    @Output() notifySubmit = new EventEmitter<any>();
    

    /*Local Property*/
    public isCollapsed: boolean = false;
    public isNameBlank: boolean = false;
    public isDisplayNameBlank: boolean = false;
    public parameterObject: ParameterModel[] = [];
    public parameter: ParameterModel;
    public parameterKeys: string[];
    public spinnerClass: string;
    


    constructor(
        private _userInfoService: UserInfoService,
        private _appAlertService: AppAlertService) {
        this.spinnerClass = IconConstant.spinnerClass;
        this.parameter = new ParameterModel();
    }

    ngOnInit() {        
        
        this.parameterObject = this.ParameterList;
        this.parameterKeys = ['Name', 'Display Name', 'Min ThresHold Value', 'Max ThresHold Value', 'Standard Value','Enable Notification','Display On Selection','Is Derived Parameter'];        
    }    

    ngOnChanges() {
    }

    /****************Control Event Start*****************/
    submit(jsonString: any) {
        try {
            this._appAlertService.reset();
            let objectKeys = Object.keys(JSON.parse(jsonString));
            for (let iRow = 0; iRow < objectKeys.length; iRow++) {
                let parameterObject = new ParameterModel();
                parameterObject.DeviceCode = this.DeviceCode;
                parameterObject.DisplayName = objectKeys[iRow];
                parameterObject.Name = objectKeys[iRow];
                this.parameterObject.push(parameterObject);
            }
            this.notifySubmit.emit(this.parameterObject);
        }
        catch (e) {
            this._appAlertService.setAlertText(AppConstant.wrongJsonData, AppConstant.ErrorAlert);
        }
    }

    addParameter() {
        if (this.checkValidation()) {
            this.parameterObject.unshift(this.parameter);
            this.notifySubmit.emit(this.parameterObject);
            this.parameter = new ParameterModel();
        }
    }

    removeParameter(pModel: ParameterModel) {
        this.parameterObject = this.parameterObject.filter(obj => obj !== pModel);        
        this.notifySubmit.emit(this.parameterObject);
    }

    changeParameter(propertyName: string, propertyValue: any, indexValue: number) {
        this.parameterObject[indexValue][propertyName] = propertyValue;
        this.notifySubmit.emit(this.parameterObject);
    }

    toggelCollapsed() {
        this.isCollapsed = !this.isCollapsed;
    }


    private checkValidation() {
        var result = true;
        this.isNameBlank = false;
        this.isDisplayNameBlank = false;
        if (!!!this.parameter.Name) {
            this.isNameBlank = true;
            result = false;
        }
        if (!!!this.parameter.Name) {
            this.isDisplayNameBlank = true;
            result = false;
        }
        return result;
    }
    /****************Control Event Start*****************/
}