import { NgModule } from '@angular/core';
import { CalendarComponent } from './calendar.component';
import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';



@NgModule({
  declarations: [
    CalendarComponent
  ],
  // providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
  ],
  exports: [CalendarComponent]
})
export class CalendarModule { }
