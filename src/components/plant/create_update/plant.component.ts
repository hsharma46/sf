/*In-Built*/
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';;
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

/*Component*/
import { CompanyPlantMappingComponent } from '../../companyPlantMapping/cmpyPlantMapping.component';
import { MemberComponent } from '../../member/member.component';


/*Constants & Enums*/
import { AppConstant } from '../../../constants/app.constants';
import { IconConstant } from '../../../constants/icon.constant';

/*Models*/
import { PlantModel } from '../../../models/plantModel'
import { DropDownModel } from '../../../models/dropDownModel';

/*Services*/
import { CommonService } from '../../../shared/common.service';
import { PlantService } from '../service/plant.service';
import { ValidationService } from '../../validation/service/validation.service';



@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.css']
})
export class PlantComponent implements OnInit, AfterViewInit {
  @ViewChild('member') member: MemberComponent;
  @ViewChild('cpMapping') cpMapping: CompanyPlantMappingComponent;


  /* Property Creation */
  public headerText: string;
  public buttonText: string;
  public isChild: boolean;
  public memberType: string;
  public memberHeaderText: string = "";
  public plantId: string;
  public plant: PlantModel;
  public plantNameExists: boolean = false;
  public pageIcon: string = '';
  public currentPlantName: string = '';
  form: FormGroup;

  constructor(
    public validation: ValidationService,
    private _formBuilder: FormBuilder,
    private _plantService: PlantService,
    private _activatedroute: ActivatedRoute,
    private _router: Router,
    private _commonService: CommonService) {
    this.memberType = AppConstant.Plant;
    this.memberHeaderText = AppConstant.PlantHeads;
    this.pageIcon = IconConstant.plant;
    this.isChild = true;
  }

  ngOnInit() {
    this._activatedroute.paramMap.subscribe((params: ParamMap) => {
      this.plantId = params.get('id');
      let action = params.get('action');
      if (!!!action) {
        this.headerText = AppConstant.CreatePlant;
        this.buttonText = AppConstant.Create;
        this.IntializeForm(new PlantModel())
      } else {
        this.headerText = AppConstant.UpdatePlant;
        this.buttonText = AppConstant.Update;
        this.getPlantById(this.plantId);
      }
    });
    //let action = this._Activatedroute.snapshot.params['action'];
    //this.plantId = this._Activatedroute.snapshot.params['id'];
  }

  ngAfterViewInit() {
    if (!!this.member) {
      this.member.intializeMember();
    }

    if (!!this.cpMapping && !!this.plantId) {
      this.cpMapping.companyId = this.plant.CompanyId;
    }
  }

  
  IntializeForm(_plant: PlantModel) {
    this.form = this._formBuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      active: ['']
    });
    this.plant = _plant;
  }

  /* Getting Existing Plant On basis of PlantId in case of Update */
  getPlantById(id: string) {
    this.plant = new PlantModel();
    this._plantService.getPlantById(id).subscribe((data: PlantModel) => {
      this.plant.Id = data["Id"];
      this.plant.Name = data["Name"];
      this.currentPlantName = data["Name"];
      this.plant.Description = data["Description"];      
      if (!!data["Company"]) {
        this.plant.CompanyId = data["Company"]["Id"];
      }
      this._commonService.setValue(AppConstant.CompanyKey, data["Company"]);      
      this.plant.IsActive = data["IsActive"];
      this.plant.ModifiedBy = data["ModifiedBy"];

      this.IntializeForm(this.plant)
    });
  }


  isPlantNameExists() {
    this.plantNameExists = false;
    if (this.currentPlantName.toLowerCase() != this.plant.Name.toLowerCase()) {
      this._plantService.isPlantNameExists(this.plant.Name).subscribe(res => {
        if (res == "True") {
          this.plantNameExists = true;
        }
      });
    }
  }
  /* Form submit and reset Event */
  onSubmit() {    
    if (this.form.valid) {
      if (this.plantNameExists) {
        return;
      }
      let company = this._commonService.getValue(AppConstant.CompanyKey);
      this.plant.CompanyId = !!!company ? '00000000-0000-0000-0000-000000000000' : company["Id"];
      if (!!!this.plantId) {        
        this._plantService.savePlant(this.plant)
          .subscribe(data => {
            alert(data);
            this._router.navigate(['plantlist', this.plant.CompanyId]);            
          },
          error => {
            return Observable.throw(error);
          });
      }
      else {
        this._plantService.updatePlant(this.plant).subscribe(data => {
          alert(data);          
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

