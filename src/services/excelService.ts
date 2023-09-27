import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

class ExcelService {
  public exportAsExcelFile(tobs: any[], excelFileName: string): void {
    const myWorkSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tobs);
    const myWorkBook: XLSX.WorkBook = {
      Sheets: { data: myWorkSheet },
      SheetNames: ["data"],
    };
    const excelBuffer: any = XLSX.write(myWorkBook, { bookType: "xlsx", type: "array" });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  exportAsExcelFileByTableId(elemId: string, fileName: string): void {
    /* table id is passed over here */
    let element = document.getElementById(elemId);

    if (element) {
      //  let element = document.getElementById(elemId) ||document.getElementsByClassName(elemId) ;
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      /* save to file */
      XLSX.writeFile(wb, fileName + EXCEL_EXTENSION);
    }
  }
}

export default new ExcelService() as ExcelService;
