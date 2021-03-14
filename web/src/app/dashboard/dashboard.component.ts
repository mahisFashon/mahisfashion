import { Component, OnInit } from '@angular/core';
import { DateUtils } from '../model/DateUtils';
import { Utils } from '../model/Utils';
import { GoogleChartComponent } from './GoogleChartComponent';
import {FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends GoogleChartComponent implements OnInit {
  private options;
  private data;
  private chart;
  private elemId = 'chartDiv';
  private totalGrossSale = 0;
  private totalNetSale = 0;
  private totalRefund = 0;
  private totalDiscount = 0;
  private currChartType = 'line';
  private fromDate = new Date(new Date().getFullYear(),0,1);
  private toDate = new Date();
  private currTab = 'ytd';
  toDispDate = DateUtils.toDispDate;
  constructor() { 
    super();
  }
  ngOnInit() {
    this.populateDataArry((err,data) => {
      if(err) return console.log(err);
      super.ngOnInit();
    });
  }
  populateDataArry(callBackFn) {
    var fromDateStr = DateUtils.dateToDbDate(this.fromDate);
    var toDateStr = DateUtils.dateToDbDate(this.toDate);
    Utils.doXMLHttpRequest('GET','http://localhost:3111/getOrderStats/' + fromDateStr + '/' + 
    toDateStr, false,null,(err,data)=>{
      if(err) {
        alert(err.toString());
        console.log(err);
        return callBackFn(err,null);
      }
      var dataRows = JSON.parse(data);
      this.dataArry.splice(0,this.dataArry.length);// Empty the data array
      var lastRow = dataRows.length - 1;
      this.totalGrossSale = dataRows[lastRow].totalSales;
      this.totalNetSale = dataRows[lastRow].netSales;
      this.totalRefund = dataRows[lastRow].totalRefunds;
      this.totalDiscount = dataRows[lastRow].totalDiscounts;
      dataRows.splice(lastRow,1);
      var dataRowTemp = new Array();
      dataRowTemp.push('Date');dataRowTemp.push('Gross Sales');
      dataRowTemp.push('Net Sales');dataRowTemp.push('Total Discounts');
      dataRowTemp.push('Total Refunds');
      this.dataArry.push(dataRowTemp);
      for (var i in dataRows) {
        var dataRow = dataRows[i];
        dataRowTemp = new Array();
        var dateObj = new Date(dataRow.year,dataRow.month-1,dataRow.day);
        dataRowTemp.push(dateObj);
        dataRowTemp.push(dataRow.totalSales);dataRowTemp.push(dataRow.netSales);
        dataRowTemp.push(dataRow.totalDiscounts);dataRowTemp.push(dataRow.totalRefunds);
        this.dataArry.push(dataRowTemp);
      }
      //alert(this.dataArry.length);
      return callBackFn(null,null);
    });
  }
  onTabClick(tabName) {
    var currDate = new Date();
    var currYear = currDate.getFullYear();
    var currMth = currDate.getMonth();
    if(tabName == 'ytd') {
      if(this.currTab == 'ytd') return;
      this.fromDate = new Date(currYear,0,1);
      this.toDate = currDate;
    }
    else if(tabName == 'prevYear') {
      this.fromDate = new Date(currYear-1,0,1);
      this.toDate = new Date(currYear-1,11,31);
    }
    else if(tabName == 'currQtr') {
      var stMth = 0, endMth = 0;
      if ((currMth+1)%3 == 0) {
        endMth = currMth; stMth = endMth - 2;
      }
      else if((currMth+1)%3 == 1) {
        stMth = currMth;endMth = currMth + 2;
      }
      else {
        stMth = currMth-1;endMth = currMth + 1;
      }
      this.fromDate = new Date(currYear,stMth,1);
      this.toDate = new Date(currYear,endMth,31);
    }
    else if(tabName == 'lastMth') {
      var year = currMth==0?currYear-1:currYear;
      var mth = currMth==0?11:currMth-1;
      var lastDay = DateUtils.getMthLastDay(year,mth+1);
      this.fromDate = new Date(year,mth,1);
      this.toDate = new Date(year,mth,lastDay);
    }
    else if(tabName == 'currMth') {
      this.fromDate = new Date(currYear,currMth,1);
      this.toDate = new Date();
    }
    this.populateDataArry((err,data)=>{
      if(err) {console.log(err); return;}
      this.data = this.createDataTable(this.dataArry);
      this.renderChart(this.currChartType);
    });
  }
  toggleChart(type) {
    if(type == this.currChartType) return;
    this.currChartType = type;
    this.renderChart(type);
  }
  renderChart(type) {
    this.chart = this.createChart(document.getElementById(this.elemId), type);
    // if(type='column') this.options.seriesType = 'bars';
    // else this.options.seriesType = null;
    this.chart.draw(this.data,this.options);
  }
  highlightLine(id) {
    // var selectedLineWidth = 4;
    // //var selectedItem = this.chart.getSelection()[0];
    // //reset series line width to default value
    // for(var i in this.options.series) {
    //     this.options.series[i].lineWidth = 1;
    // }
    // this.options.series[id].lineWidth = selectedLineWidth; //set selected line width
    // this.chart.draw(this.data, this.options);   //redraw
    this.chart.setSelection([{row:null,column:id+1}]);
  }
  drawChart() {
    this.data = this.createDataTable(this.dataArry);
    this.options = {
      hAxis: {
        //title: 'Time'
        //minValue:0
        //format:'MMM-YYYY'
      },
      vAxis: {
        //title: 'Gross and Net Sales'
        //minValue:0
      },
      legend:{position:'top'},
      height:500,
      series: {
        0:{lineWidth:3},
        1:{lineWidth:3},
        2:{lineWidth:3},
        3:{lineWidth:3}
      },
      colors:['#34A853','#4285F4','#FBBC05','#EA4335'],
      animation:{
        duration: 1500,
        easing: 'inAndOut',
        startup:true
      },
    };
    this.renderChart(this.currChartType);
  }
  private dataArry = [];
  //   ['Date', 'GrossSale', 'NetSale'],
  //   [new Date("2020-11-12"),460,460],
  //   [new Date("2020-11-13"),1300,1300],
  //   [new Date("2020-12-2"),62590,57885],
  //   [new Date("2020-12-3"),1590,1250],
  //   [new Date("2020-12-4"),11620,7235],
  //   [new Date("2020-12-5"),13740,10305],
  //   [new Date("2020-12-8"),6000,5420],
  //   [new Date("2020-12-10"),3650,3320],
  //   [new Date("2020-12-11"),1390,700],
  //   [new Date("2020-12-15"),15240,12475],
  //   [new Date("2020-12-17"),4540,4090],
  //   [new Date("2020-12-23"),1180,1130],
  //   [new Date("2020-12-24"),32540,31210],
  //   [new Date("2020-12-25"),1998,1000],
  //   [new Date("2020-12-26"),2250,2000],
  //   [new Date("2020-12-27"),3940,3000],
  //   [new Date("2020-12-28"),5580,3360],
  //   [new Date("2020-12-30"),6410,5400],
  //   [new Date("2020-12-31"),1590,1430],
  //   [new Date("2021-1-5"),15110,13575],
  //   [new Date("2021-1-7"),4390,3800],
  //   [new Date("2021-1-8"),7130,6100],
  //   [new Date("2021-1-12"),1320,1207],
  //   [new Date("2021-1-13"),9720,8350],
  //   [new Date("2021-1-14"),2070,1913],
  //   [new Date("2021-1-15"),18100,15880],
  //   [new Date("2021-1-17"),4370,3950],
  //   [new Date("2021-1-18"),1190,1010],
  //   [new Date("2021-1-19"),4880,4350],
  //   [new Date("2021-1-20"),2450,2000],
  //   [new Date("2021-1-22"),2000,1200],
  //   [new Date("2021-1-25"),2130,1700],
  //   [new Date("2021-1-26"),4350,3720],
  //   [new Date("2021-1-28"),1760,1590],
  //   [new Date("2021-1-29"),2530,2125],
  //   [new Date("2021-1-30"),5720,4300],
  //   [new Date("2021-2-1"),5220,5220],
  //   [new Date("2021-2-2"),13940,11620],
  //   [new Date("2021-2-3"),23540,19510],
  //   [new Date("2021-2-4"),16070,17463],
  //   [new Date("2021-2-6"),1000,1000],
  //   [new Date("2021-2-8"),2850,2751],
  //   [new Date("2021-2-12"),2130,1930],
  //   [new Date("2021-2-13"),4190,2700],
  //   [new Date("2021-2-20"),1140,1140],
  //   [new Date("2021-2-21"),200,200],
  //   [new Date("2021-2-25"),1660,1660],
  //   [new Date("2021-3-3"),460,460],
  //   [new Date("2021-3-6"),610,610],
  //   [new Date("2021-3-7"),1420,1420],
  //   [new Date("2021-3-8"),2610,2610],
  //   [new Date("2021-3-11"),68460,59850]      
  // ];
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
}
