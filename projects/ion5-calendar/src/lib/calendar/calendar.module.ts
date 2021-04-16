import { NgModule } from '@angular/core';
import { CalendarComponent } from './calendar.component';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    CalendarComponent
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
  ],
  exports: [CalendarComponent]
})
export class CalendarModule { }
