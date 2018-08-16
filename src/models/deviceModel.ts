/*Models*/
import { DeviceCategoryModel } from "./deviceCategoryModel";
import { DeviceGroupModel } from "./deviceGroupModel";
import { DeviceOrderModel } from "./deviceOrderModel";
import { DeviceReportGroupsModel } from "./reportGroupsModel";
import { ParameterModel } from "./parameterModel";


export class DeviceModel {
    constructor() {
        this.DeviceCategory = new DeviceCategoryModel();
        this.DeviceOrder = new DeviceOrderModel();
        this.DeviceGroup = new DeviceGroupModel();
    }

    public DeviceCode: string = "";
    public CreatedDateTime: string="";
    public Description: string = "";
    public IsActive: boolean = false;
    public DeviceCategory: DeviceCategoryModel;
    public DeviceGroup: DeviceGroupModel;
    public LineId: string = "";
    public ModifiedBy: string = "";
    public EnableNotification: boolean = false;
    public ThresholdBreachNotificationEmailTo: string = "";
    public ThresholdBreachNotificationEmailCc: string = "";
    public ThresholdBreachNotificationInterval: number = 0;
    public ThresholdBreachNotificationPhoneNo: string = "";;
    public ParameterModel: ParameterModel[] = [];
    public ReportGroupModel: DeviceReportGroupsModel[] = [];
    public DeviceOrder: DeviceOrderModel;
}


