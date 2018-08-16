import { CityModel } from "./CityModel";
import { StateModel } from "./StateModel";


export class CompanyModel {
    constructor() {
        this.State = new StateModel();
        this.City = new CityModel();
    }
    public Id: string = "";
    public Name: string = "";
    public CountryId: string = "";
    public Country: any = {};
    public IsActive: boolean;
    public State: StateModel;
    public City: CityModel;
}