import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonCalendarComponent } from '../ion5-calendar/ion5-calendar.component';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  @Input() name: string;

  constructor(
    public modalCtrl: ModalController,

  ) { }

  ngOnInit() {}

  async onClick() {
    const c = await this.modalCtrl.create({
      component: IonCalendarComponent,
    });
    await c.present();
  }
}
