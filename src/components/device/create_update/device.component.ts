/*In-Built*/
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

/*Component*/
import { CompanyPlantMappingComponent } from '../../companyPlantMapping/cmpyPlantMapping.component';
import { MemberComponent } from '../../member/member.component';

/*Constants & Enums*/
import { AppConstant } from '../../../constants/app.constants';
import { IconConstant } from '../../../constants/icon.constant';

/*Models*/
import { DeviceModel } from '../../../models/deviceModel';
import { DropDownModel } from '../../../models/dropDownModel';
import { DeviceGroupModel } from '../../../models/deviceGroupModel';
import { PlantModel } from '../../../models/plantModel';

/*Services*/
import { AppAlertService } from '../../../shared/appAlert.service';
import { CommonService } from '../../../shared/common.service';
import { DeviceService } from '../service/device.service';
import { DeviceCategoryService } from '../../../shared/deviceCategory.service';
import { ValidationService } from '../../validation/service/validation.service';
import { AppContextService } from '../../../shared/appContext.service';
import { DeviceGroupService } from '../../../shared/deviceGroup.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html'
})
export class DeviceComponent implements OnInit {
  @ViewChild('member') member: MemberComponent;
  @ViewChild('cpMapping') cpMapping: CompanyPlantMappingComponent;

  /* Property Creation */
  public headerText: string = "";
  public buttonText: string = "";
  public categoryList: DropDownModel[] = [];
  public currentContext: any;
  public deviceCode: string = "";
  public deviceCodeExists: boolean = false;
  public device: DeviceModel;
  public groupList: DeviceGroupModel[] = [];
  public isEdit: boolean = false;
  public loading: boolean = true;
  public memberType: string = "";
  public memberHeaderText: string = "";
  public pageIcon: string = '';
  public spinnerClass: string = "";

  form: FormGroup;

  constructor(public validation: ValidationService,
    private _appAlertService: AppAlertService,
    private _formBuilder: FormBuilder,
    private _deviceService: DeviceService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _context: AppContextService,
    private _commonService: CommonService,
    private _deviceCategoryService: DeviceCategoryService,
    private _deviceGroupService: DeviceGroupService) {
    this.memberType = AppConstant.Device;
    this.memberHeaderText = AppConstant.DeviceHeads;
    this.pageIcon = IconConstant.machine;
    this.spinnerClass = IconConstant.spinnerClass;
  }

  ngOnInit() {
    this.loading = true;
    let action = this._activatedRoute.snapshot.params["action"];
    this.deviceCode = this._activatedRoute.snapshot.params["code"];
    this.getCategory();
    this.getDeviceGroup();
    if (!!!action) {
      this.headerText = AppConstant.CreateMachine;
      this.buttonText = AppConstant.Create;
      this.IntializeForm(new DeviceModel());
    }
    else if (action.toLowerCase() == AppConstant.Edit.toLowerCase()) {
      this.isEdit = true;
      this.headerText = AppConstant.UpdateMachine;
      this.buttonText = AppConstant.Update;
      this.getDeviceById(this.deviceCode);
    }
    else if (action.toLowerCase() == AppConstant.Clone.toLowerCase()) {
      this.headerText = AppConstant.CreateMachine;
      this.buttonText = AppConstant.Create;
      this.getDeviceById(this.deviceCode);
      this.deviceCode = "";
      this.device.DeviceCode = "";
    }
  }

  ngAfterViewInit() {
    if (!!this.member) {
      this.member.intializeMember();
    }
    
  }

  IntializeForm(device: DeviceModel) {
    this.form = this._formBuilder.group(
      {
        code: [null, Validators.required],
        description: [null, Validators.required],
        active: [''],
        notification: [''],
        group: [null, Validators.required],
        //category: [null, Validators.required],
        notificationEmailTo: [null],
        notificationEmailCc: [null],
        notificationInterval: [null],
        notificationPhoneNo: [null]

      }
    )
    this.device = device;
    this.device.ParameterModel = !!!device.ParameterModel ? [] : device.ParameterModel;
    this.changeNotification(this.device.EnableNotification);
    this.loading = false;
  }

  /* Getting Existing Device On basis of lineId in case of Update */
  getDeviceById(code: string) {
    this.device = new DeviceModel();
    this._deviceService.getDeviceByCode(code).subscribe((data: DeviceModel) => {
      this.device.DeviceCode = !!!this.deviceCode ? "" : data["DeviceCode"];
      this.device.Description = data["Description"];
      this.device.DeviceCategory = data["DeviceCategory"];
      this.device.DeviceGroup = data["DeviceGroup"];
      this.device.IsActive = data["IsActive"];
      this.device.EnableNotification = data["EnableNotification"];
      this.device.ParameterModel = data["ParameterModel"];
      this.device.ThresholdBreachNotificationEmailTo = data["ThresholdBreachNotificationEmailTo"];
      this.device.ThresholdBreachNotificationEmailCc = data["ThresholdBreachNotificationEmailCc"];
      this.device.ThresholdBreachNotificationInterval = data["ThresholdBreachNotificationInterval"];
      this.device.ThresholdBreachNotificationPhoneNo = data["ThresholdBreachNotificationPhoneNo"];


      this.IntializeForm(this.device);
    });
  }

  isDeviceCodeExists() {
    this.deviceCodeExists = false;
    if (this.deviceCode.toLowerCase() != this.device.DeviceCode.toLowerCase()) {
      this._deviceService.isDeviceCodeExists(this.device.DeviceCode).subscribe(res => {
        if (res == "True") {
          this.deviceCodeExists = true;
        }
      });
    }
  }

  /* DropDown Binding */
  getCategory() {
    this._deviceCategoryService.getCategory().subscribe((data: DropDownModel[]) => {
      this.categoryList = [];
      for (let iRow = 0; iRow < data.length; iRow++) {
        this.categoryList.push(data[iRow]);
      }
      this.device.DeviceCategory.Id = this.categoryList.length > 0 ? Number(this.categoryList[0].Id) : 0;
    });
  }
  getDeviceGroup() {
    this._deviceGroupService.getDeviceGroup().subscribe((data: DeviceGroupModel[]) => {
      this.groupList = [];
      for (let iRow = 0; iRow < data.length; iRow++) {
        this.groupList.push(data[iRow]);
      }
    });
  }

  /*Radio button Event*/
  changeNotification(value: boolean) {
    this.disableControl(this.form.get('notificationEmailTo'), value, this.device.ThresholdBreachNotificationEmailTo, "");
    this.disableControl(this.form.get('notificationEmailCc'), value, this.device.ThresholdBreachNotificationEmailCc, "");
    this.disableControl(this.form.get('notificationPhoneNo'), value, this.device.ThresholdBreachNotificationPhoneNo, 0);
    this.disableControl(this.form.get('notificationInterval'), value, this.device.ThresholdBreachNotificationInterval, "");
  }

  disableControl(control: AbstractControl, value: boolean, controlValue: any, defaultValue: any) {
    control.setValue(value ? controlValue : !!!controlValue ? defaultValue : controlValue);
    value ? control.enable() : control.disable();
  }



  /* Form submit and reset Event */
  onSubmit() {
    this._appAlertService.reset();
    this.currentContext = this._context.getContext();

    if (!this.cpMapping.controlBlank()) {
      return;
    }

    if (this.form.valid) {
      if (this.deviceCodeExists) {
        this._appAlertService.setAlertText(AppConstant.DeviceCodeAlreadyExists, AppConstant.ErrorAlert);
        return;
      }
      if (!!!this.deviceCode) {
        this._deviceService.saveDevice(this.device).subscribe(data => {
          this._router.navigate(['/devicelist']);              
        },
          error => {
            return Observable.throw(error);
          });
      }
      else {
        this._deviceService.updateDevice(this.device).subscribe(data => {          
          this._router.navigateByUrl(this._commonService.popURLToRouteHistory());          
        },
          error => {
            return Observable.throw(error);
          });
      }
    }
    else {
      this.validation.validateAllFormFields(this.form);
    }
  }
  reset() {
    this.form.reset();
  }

  /*Parameter Component Event*/
  ExtractedParameterList(data: any) {
    this.device.ParameterModel = data;
  }
}
