/*In-Builts*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';;
import { Router, ActivatedRoute } from '@angular/router';

/*Component*/
import { CompanyPlantMappingComponent } from '../../companyPlantMapping/cmpyPlantMapping.component';
import { MemberComponent } from '../../member/member.component';

/*Constants & Enums*/
import { AppConstant } from '../../../constants/app.constants';
import { IconConstant } from '../../../constants/icon.constant';

/*Models*/
import { LineModel } from '../../../models/lineModel';
import { DropDownModel } from '../../../models/dropDownModel';

/*Services*/
import { AppContextService } from '../../../shared/appContext.service';
import { CommonService } from '../../../shared/common.service';
import { LineService } from '../service/line.service';
import { ValidationService } from '../../validation/service/validation.service';

@Component({
  selector: 'app-line',
  templateUrl: './line.Component.html',
  styleUrls: ['./line.Component.css']
})

export class LineComponent implements OnInit {
  @ViewChild('member') member: MemberComponent;
  @ViewChild('cpMapping') cpMapping: CompanyPlantMappingComponent;

  /* Property Creation */
  public headerText: string;
  public buttonText: string;
  public lineId: string;
  public memberType: string;
  public memberHeaderText: string = "";
  public currentContext: any;
  public currentLineName: string = '';
  public line: LineModel;
  public lineNameExists: boolean = false;
  public stateList: DropDownModel[] = [];
  public cityList: DropDownModel[] = [];
  public plantList: DropDownModel[] = [];
  public pageIcon: string = '';

  form: FormGroup;

  constructor(public validation: ValidationService,
    private _formBuilder: FormBuilder,
    private _lineService: LineService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _context: AppContextService,
    private _commonService: CommonService) {
    this.memberType = AppConstant.Line;
    this.memberHeaderText = AppConstant.LineHeads;
    this.pageIcon = IconConstant.lines;
  }

  ngOnInit() {
    this._context.setContextByKey(AppConstant.CurrentModule, AppConstant.LineKey);
    let action = this._activatedRoute.snapshot.params["action"];
    this.lineId = this._activatedRoute.snapshot.params["id"];
    if (!!!action) {
      this.headerText = AppConstant.CreateLine;
      this.buttonText = AppConstant.Create;
      this.IntializeForm(new LineModel());
    }
    else {
      this.headerText = AppConstant.UpdateLine;
      this.buttonText = AppConstant.Update;
      this.getLineById(this.lineId);
    }
  }

  ngAfterViewInit() {
    if (!!this.member) {
      this.member.intializeMember();
    }
    if (!!this.cpMapping && !!this.lineId) {
      this.cpMapping.plantId = this.line.PlantId;
    }
  }

  ngAfterViewChecked() {
   
  }

  IntializeForm(line: LineModel) {
    this.form = this._formBuilder.group(
      {
        name: [null, Validators.required],
        description: [null, Validators.required],
        active: ['']
      }
    )
    this.line = line;
  }

  /* Getting Existing Line On basis of lineId in case of Update */
  getLineById(id: string){
    this.line = new LineModel();
    this._lineService.getLineById(id).subscribe((data: LineModel) => {
      this.line.Id = data["Id"];
      this.line.Name = data["Name"];
      this.currentLineName = data["Name"];
      this.line.Description = data["Description"];
      this.line.PlantId = data["Plant"]["Id"];
      this.line.IsActive = data["IsActive"];
      this.line.ModifiedBy = data["ModifiedBy"];

      this.IntializeForm(this.line)
    });
  }

  /* DropDown Binding */
  isLineNameExists() {
    this.lineNameExists = false;
    if (this.currentLineName.toLowerCase() != this.line.Name.toLowerCase()) {
      this._lineService.isLineNameExists(this.line.Name).subscribe(res => {
        if (res == "True") {
          this.lineNameExists = true;
        }
      });
    }
  }

  /* Form submit and reset Event */
  onSubmit() {
    this.currentContext = this._context.getContext();
    if (this.form.valid) {
      if (this.lineNameExists) {
        return;
      }
      if (!!!this.lineId) {
        this.line.PlantId = this.cpMapping.plantId;
        this._lineService.saveLine(this.line).subscribe(data => {
          this._router.navigate(['/linelist']);          
        },
          error => {
            return Observable.throw(error);
          });
      }
      else {
        this._lineService.updateLine(this.line).subscribe(data => {
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
}
