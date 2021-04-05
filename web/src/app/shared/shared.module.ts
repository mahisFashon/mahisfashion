import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatepickerComponent } from './components/datepicker/datepicker.component';

@NgModule({
  declarations: [DatepickerComponent],
  exports: [
    DatepickerComponent
  ],
  imports: [
    CommonModule, FormsModule
  ]
})
export class SharedModule { }
