/*In-Built*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

/*Component*/
import { HeaderComponent } from '../../header/header.component';

/*Constants & Enums*/
import { PagingAction, ModuleNameEnum } from '../../../enums/common.enums';
import { AppConstant } from '../../../constants/app.constants';
import { IconConstant } from '../../../constants/icon.constant';

/*Models*/
import { DropDownModel } from '../../../models/dropDownModel';
import { LineModel } from '../../../models/lineModel';
import { PagingModel } from '../../../models/PagingModel';


/*Services*/
import { AppContextService } from '../../../shared/appContext.service';
import { LineService } from '../../line/service/line.service';
import { UserInfoService } from '../../../shared/userInfo.service';
import { CommonService } from '../../../shared/common.service';



@Component({
    selector: 'app-plant-overview',
    templateUrl: "./plantOverview.component.html",
    styleUrls: ['./plantOverview.component.css']
})

export class PlantOverviewComponent implements OnInit {   

    /* Property Creation */
        /*public*/      
    public pageIcon: string;
    public plantId: string = '';
    public pagingModel: PagingModel;
    

        /*private*/
    private userid: string = '';

    constructor(
        private _lineService: LineService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _context: AppContextService,
        private _userInfoService: UserInfoService,
        private _commonService: CommonService) {        
        this.pagingModel = new PagingModel();        
        this.pageIcon = IconConstant.plant;
        this._commonService.setValue(AppConstant.PerviousURL, this._router.url);
    }

    ngOnInit() {
        this._context.setContextByKey(AppConstant.CurrentModule, AppConstant.PlantKey);
        this._activatedRoute.paramMap.subscribe((params: ParamMap) => {
            this.plantId = params.get("plantid");    
        })        
    }

    GotoPlantList() {
        if (this._userInfoService.isAuthorizedInModule(ModuleNameEnum.Plant)) {
            this._router.navigate(['/plantlist']);
        }
    }
}