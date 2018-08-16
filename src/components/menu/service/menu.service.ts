/*In-Builts*/
import { Injectable, OnInit } from '@angular/core';

/*Constants & Enums*/
import { AppConstant } from '../../../constants/app.constants';

/*Services*/
import { AppStorageService } from '../../../shared/appStorage.service';

@Injectable()

export class MenuService implements OnInit {
    private Visible: boolean;
    private VisibleMenuItems: boolean;

    constructor(private _storage: AppStorageService) { }

    ngOnInit() {
        this.Visible = this.checkUserIsAuthenticated()
        this.VisibleMenuItems = true;
    }

    hide() {
        this.Visible = false;
    }
    show() {
        this.Visible = true;
    }

    hideMenuItem() {
        this.VisibleMenuItems = false;
    }
    showMenuItem() {
        this.VisibleMenuItems = true;
    }

    isMenuItemVisible(): boolean {
        return this.VisibleMenuItems;
    }

    isVisible(): boolean {
        return this.checkUserIsAuthenticated();
    }

    private checkUserIsAuthenticated(): boolean {
        if (!!this._storage.getDataFromStorage(AppConstant.loggedInUserInfoKey)) {
            return true;
        }
        else {
            return false;
        }
    }
}
