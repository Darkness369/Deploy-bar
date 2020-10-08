import { Injectable } from '@angular/core';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
const EXCEL_EXT = '.xlsx';

let day: number;
let month: number;
let year: number;
let hours: number;
let minutes: number;

day = new Date().getDate();
month = new Date().getMonth() + 1;
year = new Date().getFullYear();
hours = new Date().getHours();
minutes = new Date().getMinutes();

@Injectable({
  providedIn: 'root',
})
export class ExcelService {

  constructor() { }
  nombre: string;
  guardarNombreCliente(name: string){
    return this.nombre=name;
  }
  
  exportToExcel(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { inventario: worksheet },
      SheetNames: ['inventario'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    //Call method buffer and fileName
    this.saveAsExcel(excelBuffer, excelFileName);
  }

  private saveAsExcel(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_reyba_' + day + '_' + month + '_' + year + '_' + hours + '-' + minutes + EXCEL_EXT
    );
  }


  public importFromFile(bstr: string): XLSX.AOA2SheetOpts {
    /* read workbook */
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

    /* grab first sheet */
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    /* save data */
    const data = <XLSX.AOA2SheetOpts>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

    return data;
  }

  


} //cierrra todo
