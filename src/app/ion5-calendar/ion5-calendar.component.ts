import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { MONTH_NAMES } from './const/months-names.const';
import { WEEK_DAYS } from './const/week-days.const';
import { DatePickerTypeEnum } from './enum/data-picker-type.enum';
import { getCalendar } from './get-calendar';

import { CalendarOptionsModelIO } from './model/calendar-options.model';
import { CalendarModelIO } from './model/calendar.model';
import { DatePickerType } from './model/date-picker-type';
import { DateRangeModelIO } from './model/date-range.model';

@Component({
  selector: 'ion5-calendar',
  templateUrl: 'ion5-calendar.component.html',
  styleUrls: ['ion5-calendar.component.scss'],
  providers: [DatePickerType],
})
export class IonCalendarComponent implements OnDestroy, OnInit {
  /* Options for calendar: type, dates from and to */
  @Input() options: CalendarOptionsModelIO;

  /* Отсылаем выбранную дату в поле выбора диапалона дат */
  @Output() applyDate = new EventEmitter<Date | DateRangeModelIO>();

  /* цифры для форирования календаря */
  public calendarBox: CalendarModelIO[] = [];

  /* Выбранная дата календаря */
  public calendarDate: Date;
  /* Выбранный год календаря */
  public year: number;
  /* Выбранный месяц календаря */
  public month: number;
  public title: string;
  public weekDays: string[];
  public isDisabled = true;
  private destroy$ = new Subject();

  constructor(private datePickerType: DatePickerType) {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit() {
    this.initCalendarDate();
    this.initCalendar();
    this.weekDays = WEEK_DAYS;
  }

  /*Закрыть выбор даты */
  public closeDataPicker() {
    this.applyDate.emit(this.calendarDate);
  }

  /*Инициализация даты */
  public initCalendarDate(): void {
    if (this.options?.dateFrom) {
      this.calendarDate = new Date(this.options.dateFrom);
    } else {
      this.calendarDate = new Date();
    }
  }

  /*Инициализация календаря */
  public initCalendar(): void {
    this.year = this.calendarDate.getFullYear();
    this.month = this.calendarDate.getMonth();
    switch (this.datePickerType.currentType) {
      case DatePickerTypeEnum.Day:
        this.title = MONTH_NAMES[this.month] + ' ' + this.year + ' г.';
        break;
      case DatePickerTypeEnum.Month:
        this.title = this.year + ' г.';
        break;
      case DatePickerTypeEnum.Year:
        this.title = '';
        break;
    }

    this.calendarBox = getCalendar(
      this.calendarDate,
      this.getDateRange(),
      this.datePickerType.currentType
    );
  }

  private getDateRange(): DateRangeModelIO {
    const dateFrom = this.options?.dateFrom
      ? new Date(this.options.dateFrom)
      : null;
    let dateTo = null;
    if (this.options?.dateTo) {
      if (typeof this.options.dateTo === 'function') {
        dateTo = this.options.dateTo(dateFrom);
      } else {
        dateTo = this.calendarDate = new Date(this.options.dateTo);
      }
    }
    return dateFrom || dateTo
      ? { from: dateFrom, to: dateTo }
      : null;
  }

  /*Дата выбрана */
  public pickDate(name: string): void {
    this.calendarDate = new Date(name);
    if (!this.showDays) {
      this.datePickerType.previousType;
      this.initCalendar();
    } else {
      this.isDisabled = false;
    }
  }

  /*Предыдущий период */
  public goToPreviousMonth(): void {
    if (this.showMonth) {
      this.calendarDate = new Date(this.year - 1, 0);
    } else {
      const calendarMonthIsJanuary = this.month === 0;
      if (calendarMonthIsJanuary) {
        const december = 11;
        this.calendarDate = new Date(this.year - 1, december);
      } else {
        this.calendarDate = new Date(this.year, this.month - 1);
      }
    }
    this.initCalendar();
  }

  /*Следующий период */
  public goToNextMonth(): void {
    if (this.showMonth) {
      this.calendarDate = new Date(this.year + 1, 0);
    } else {
      const calendarMonthIsDecember = this.month === 11;
      if (calendarMonthIsDecember) {
        const january = 0;
        this.calendarDate = new Date(this.year + 1, january);
      } else {
        this.calendarDate = new Date(this.year, this.month + 1);
      }
    }
    this.initCalendar();
  }

  /*Изменение отображаемого типа */
  public changeType(): void {
    this.datePickerType.nextType;
    this.initCalendar();
  }

  /*Текущий отображаемы тип дунь */
  public get showDays(): boolean {
    return this.datePickerType.currentType === DatePickerTypeEnum.Day;
  }

  /*Текущий отображаемы тип месяц */
  public get showMonth(): boolean {
    return this.datePickerType.currentType === DatePickerTypeEnum.Month;
  }

  /*Текущий отображаемы тип год */
  public get showYears(): boolean {
    return this.datePickerType.currentType === DatePickerTypeEnum.Year;
  }
}
