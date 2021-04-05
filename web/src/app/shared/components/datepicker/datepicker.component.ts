import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'my-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  host: {
    '(document:click)': 'onCloseCalendar($event)',
    '(document:keydown)': 'onKeyDown($event)'
  }
})

export class DatepickerComponent implements OnInit {
  date: Date = new Date();
  month: number; year: number; days: number[];

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  yearRange = [];
  showCalendar: boolean = false;
  result: string = '';

  onKeyDown(e:Event) {
    if (e['key'] == 'Tab') {
      console.log(e);
      this.onCloseCalendar(e);
    }
  }
  updateMonth(e?:Event, type?: string) {
    if (e) e.stopPropagation();
    if (type === 'dec') this.month--;
    if (type === 'inc') this.month++;
    if (this.month < 0) {
      this.month = 11;
      this.year--;
    }
    if (this.month > 11) {
      this.month = 0;
      this.year++;
    }
    const date = new Date(this.year, this.month);
    const days = date.getDate();
    const day  = date.getDay();
    const prefix = new Array(day);
    const lastDay = new Date(date.getFullYear(),date.getMonth()+1,0).getDate();
    this.days = prefix.concat(this.range(1, lastDay));
  }
  range(from,to) {
    var retArry = [];
    for (var i = from; i <= to; i++) 
      retArry.push(i);
    return retArry;
  }
  selectDay(day: number, e:Event = null) {
    if (e) console.log(e);
    if (!day) return;
    const pad = s => s.length < 2 ? 0 + s : s;
    this.date = new Date(this.year, this.month, day);
    this.result = `${ pad(day + '') }-${ this.months[this.month].substring(0,3) }-${ this.year }`;
    this.update.emit(this.result);
  }

  onShowCalendar(e: Event) {
    e.stopPropagation();
    this.showCalendar = true;
  }
  onCloseCalendar(e: Event) {
    console.log(e);
    if(e.target['id'] == "yearSelect") {
      console.log("Returning from yearSelect");
      return;
    }
    if (this.showCalendar) {
      this.showCalendar = false;
      this.update.emit(this.result);
    }
    return;
  }

  ngOnInit() {
    //console.log('value', this.value);
    // Set value if default date is present
    if (this.value) this.date = new Date(this.value);
    this.month = this.date.getMonth();
    this.year  = this.date.getFullYear();
    if (this.value) this.selectDay(this.date.getDate());
    this.updateMonth();
    for (var i = this.startYear; i <= this.endYear; i++) {
      this.yearRange.push(i);
    }
  }
  @Input() label:  string = 'Date';
  @Input() value:  string;
  @Input() startYear: number = new Date().getFullYear();
  @Input() endYear: number = new Date().getFullYear();
  @Output() update: EventEmitter<string> = new EventEmitter<string>();
}