import { Component } from '@angular/core';
import { CalendarComponent } from 'ion5-calendar';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'test-app';
  constructor(
    public modalCtrl: ModalController,
  ) {}

  async onClick() {
    const t = await this.modalCtrl.create({
      component: CalendarComponent,
      componentProps: {
        dateRange: null,
      }
    });
    t.present();
  }
}
