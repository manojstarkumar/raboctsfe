import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public csvRecords: any[] = [];
  public headers: any[] = [];

  @ViewChild('fileImportInput') fileImportInput: any;


  fileChangeListener($event: any): void {

    var text = [];
    var files = $event.srcElement.files;

    if (this.isCSVFile(files[0])) {

      var input = $event.target;
      var reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = (data) => {
        let csvData = reader.result;
        let csvRecordsArray = csvData.split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        this.headers = headersRow;
      }

      reader.onerror = function() {
        alert('Unable to read ' + input.files[0]);
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    var dataArr = []
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let data = csvRecordsArray[i].split(',');

      if (data.length == headerLength) {

        var csvRecord: CSVRecord = new CSVRecord();

        csvRecord.firstName = data[0].trim().substring(1,data[0].length-1);
        csvRecord.lastName = data[1].trim().substring(1,data[1].length-1);;
        csvRecord.issueCount = data[2].trim();
        var dob = new Date(data[3].trim().substring(1,data[3].length-1));
        csvRecord.dateOfBirth = dob.getDate()+ "-" + monthNames[dob.getMonth()]+ "-" + dob.getFullYear();

        dataArr.push(csvRecord);
      }
    }
    return dataArr;
  }

  isCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = csvRecordsArr[0].split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j].substring(1,headers[j].length-1));
    }
    return headerArray;
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
  }

}

export class CSVRecord{

  public firstName: any;
  public lastName: any;
  public issueCount: any;
  public dateOfBirth: any;

  constructor()
  {

  }
}