/*In-Builts*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';;

/*Constants & Enums*/
import { AppConstant } from '../constants/app.constants';

/*Models*/
import { ChartModel } from '../models/chartModel';

/*Service*/
import { AppSettingsService } from '../shared/appSetting.service';
import { CompanyModel } from '../models/companyModel';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CountryService {
    countryList: ChartModel[] = [];

    constructor(
        private http: HttpClient,
      private _appSettingsService: AppSettingsService) { }

    /* Subscriber method */
    getCountry(): ChartModel[] {
        this.countryList = [];
        this.getCountrys().subscribe((data: ChartModel[]) => {
            for (var i = 0; i < data.length; i++) {
                this.countryList.push(data[i]);
            }
        });
        return this.countryList;
    }

    /* Observable method */
    private getCountrys(): Observable<ChartModel[]> {
      const url = `${this._appSettingsService.getURL(AppConstant.CountryURL)}/get`;
        return this.http.get<ChartModel[]>(url);

    }

}

