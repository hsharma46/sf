/*In-Builts*/
import { Injectable, OnInit } from '@angular/core';
import { saveAs } from 'file-saver'

/*Externals*/
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/octet-stream';//application/vnd.ms-excel';
const EXCEL_EXTENSION = '.xls';

@Injectable()
export class ExcelService {
  constructor() {

  }

  public ExportHtmlTableToExcel(json: any[], excelFileName: string, sheetName: string, tblElement: any): void {

    let wb = XLSX.utils.table_to_book(tblElement);
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xls', type: 'binary' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public ExportJsonToExcel(json: any[], excelFileName: string, sheetName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });    
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([this.convertBufferIntoUint8Array(buffer)], {
      type: EXCEL_TYPE
    });
    saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
  }

  private convertBufferIntoUint8Array(buffer: any): any {
    let buf = new ArrayBuffer(buffer.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i != buffer.length; ++i) {
      view[i] = buffer.charCodeAt(i) & 0xFF;
    }

    return view;
  }
}
