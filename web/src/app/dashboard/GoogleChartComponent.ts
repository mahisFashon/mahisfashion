import { Component, OnInit} from '@angular/core';
declare var google:any;
@Component({
  selector: 'chart'
})
export class GoogleChartComponent implements OnInit {
  private static googleLoaded:any;

  constructor(){
      //console.log("Here is GoogleChartComponent")
  }

  getGoogle() {
      return google;
  }
  ngOnInit() {
    //console.log('ngOnInit');
    if(!GoogleChartComponent.googleLoaded) {
      GoogleChartComponent.googleLoaded = true;
      google.charts.load('current',  {packages: ['corechart']});
    }
    google.charts.setOnLoadCallback(() => this.drawChart());
  }

  drawChart(){
      console.log("DrawChart base class!!!! ");
  }

  createChart(element:any, chartType:any):any {
    if(!element || !chartType) return null;
    switch(chartType) {
      case 'bar':
        return new google.visualization.BarChart(element);
      case 'line':
        return new google.visualization.LineChart(element);
      case 'pie':
        return new google.visualization.PieChart(element);
      case 'column':
        return new google.visualization.ColumnChart(element);        
      default:
        return new google.visualization.LineChart(element);
    }
  }
  createDataTable(array:any[]):any {
      return google.visualization.arrayToDataTable(array);
  }
}