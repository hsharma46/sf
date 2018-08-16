import { ParameterModel } from "./parameterModel";

export class ReportModel {
  public DeviceCode: string = "";
  public StartDate: string;
  public EndDate: string;
  public StartHour: number = 0;
  public ParameterModel: ParameterModel[] = [];
}
