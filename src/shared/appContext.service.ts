/*In-Builts*/
import { Injectable, OnInit } from '@angular/core';

/*Constants & Enums*/
import { AppConstant } from '../constants/app.constants';

/*Services*/
import { AppStorageService } from './appStorage.service'

@Injectable()

export class AppContextService implements OnInit {
    context: string = '';

    constructor(private _storage: AppStorageService) {
    }

    ngOnInit() { }

    getContext() {
        return this._storage.getDataFromStorage(AppConstant.loggedInUserContextKey);
    }

    setContext(context: any) {
        this._storage.setDataInStorage(AppConstant.loggedInUserContextKey, context);
    }

    getContextByKey(key: string) {
        this.context = this.getContext() || {};
        if (Object.keys(this.context[key] || {}).length === 0) {
            return undefined;
        }
        else {
            return this.context[key];
        }
    }

    setContextByKey(key: string, value: any) {
        this.context = this.getContext() || {};
        this.context[key] = {};
        if (!!value) {
            this.context[key] = value;
        }
        this._storage.setDataInStorage(AppConstant.loggedInUserContextKey, this.context);
    }

    resetModuleKey() {        
        this.setContextByKey(AppConstant.PlantKey, {});
        this.setContextByKey(AppConstant.LineKey, {});
        this.setContextByKey(AppConstant.DeviceKey, {});
    }    
}