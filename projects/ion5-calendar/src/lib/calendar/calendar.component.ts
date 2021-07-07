import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateRangeModelIO, DateService } from '../../public-api';
import { CalendarModeEnum } from '../enum/calendar-mode.enum';


/*Календарь компонент */
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {

  constructor(
    public modalCtrl: ModalController,
    private dateService: DateService,
    ) { }

  /* Закрыть модальное окно */
  @Input()
  public closeModal!: (val: DateRangeModelIO) => {};

  /* Возможные режимы */
  public CalendarModeEnum = CalendarModeEnum;

  /* Текущий режим */
  public mode = this.CalendarModeEnum.selectRange;

  /* Дата начала периода поиска статистики */
  public dateFrom$ = new BehaviorSubject<string>(undefined);

  /* Дата конца периода поиска статистики */
  public dateTo$ = new BehaviorSubject<string>(undefined);

  /* Диапазон возможных для выбора дат */
  public dateRange!: DateRangeModelIO;

  /*Флаг, кликабельна ли кнопка применить */
  public isDisabled$ = combineLatest([this.dateFrom$, this.dateTo$]).pipe(
    map(([dateFrom, dateTo]) => !(dateFrom && dateTo)),
    startWith(true),
  );

  public isBusy$ = new BehaviorSubject(false);

  /* Выбрать начало периода */
  public openCalendarFrom(): void {
    this.isBusy$.next(true);
    this.dateFrom$.next(null);
    this.mode = this.CalendarModeEnum.selectFrom;
  }

  /* Выбрать конец периода */
  public openCalendarTo(): void {
    this.isBusy$.next(true);
    this.mode = this.CalendarModeEnum.selectTo;
  }


  /* Применить выбранные даты и закрыть модальное окно */
  public applyDates(): void {
    this.closeModal({
      from: this.dateService.moment(this.dateFrom$.getValue()).toDate(),
      to: this.dateService.moment(this.dateTo$.getValue()).toDate(),
    });
  }

  /* Закрыть модальное окно */
  public close(): void {
    this.closeModal(null);
  }

  /* Посчитать диапазон дат в 31 днень */
  public calculateDateRange(): void {
    const dateFromMoment = this.dateService.moment(this.dateFrom$.getValue(), 'YYYY-MM-DD');
    const candidateDateTo = this.dateService.add(30, 'd', dateFromMoment);
    const dateTo = candidateDateTo.isBefore(this.dateService.moment())
        ? candidateDateTo.toDate()
        : null;
    this.dateRange = {
      from: this.dateService.moment(this.dateFrom$.getValue()).toDate(),
      to: dateTo,
    }
  }

  /* Применить выбранные даты к полю 'From' */
  public applyDateFrom(date: Date): void {
    this.dateFrom$.next(this.dateService.getDateStringFromMoment(date, 'YYYY-MM-DD', 'YYYY-MM-DD'));
    this.dateTo$.next(undefined);
    this.mode = this.CalendarModeEnum.selectRange;
    this.isBusy$.next(false);
    this.calculateDateRange();
  }

  /* Применить выбранные даты к полю 'To' */
  public applyDateTo(date: Date): void {
    this.dateTo$.next(this.dateService.getDateStringFromMoment(date, 'YYYY-MM-DD', 'YYYY-MM-DD'));
    this.mode = this.CalendarModeEnum.selectRange;
    this.isBusy$.next(false);
  }

  public get dateRangeFrom(): DateRangeModelIO {
    const dateFrom = this.dateFrom$.getValue()
      ? this.dateService.moment(this.dateFrom$.getValue(), 'YYYY-MM-DD').toDate()
      : null;

    return {
      from: dateFrom,
      to: null
    };
  }
 }
