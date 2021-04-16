import { Component, EventEmitter, Output, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MAX_YEARS_COUNT } from '../const/max-years-count.const';
import { MONTH_NAMES } from '../const/months-names.const';
import { WEEK_DAYS } from '../const/week-days.const';
import { DatePickerTypeEnum } from '../enum/data-picker-type.enum';
import { CalendarModelIO } from '../model/calendar.model';
import { DatePickerType } from '../model/date-picker-type';
import { DateRangeModelIO } from '../model/date-range.model';
import { DateService } from '../service/date.service';

import { DestroyableBase } from '../service/destroyable-base';
import { getCalendar } from './get-calendar';


/*Календарь компонент */
@Component({
  selector: 'ion5-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [DatePickerType],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent extends DestroyableBase implements OnInit {
  /* Диапазон дат в 31 день, приходит, если это это процесс для выбора даты для поля 'To' */
  /* Диапазон дат в 31 день, приходит, если это это процесс для выбора даты для поля 'To' */
  @Input()
  dateRange!: DateRangeModelIO;

  /* Отсылаем выбранную дату в поле выбора диапалона дат */
  @Output() applyDate = new EventEmitter<Date>();

  /* цифры для форирования календаря */
  public calendarBox: CalendarModelIO[] = [];

  /* Выбранная дата календаря */
  public calendarDate!: Date;
  /* Дата отображаемого месяца */
  public pickedMonthDate: Date = new Date();
  /* Выбранный год календаря */
  /* Выбранный год календаря */
  public year!: number;
  /* Выбранный месяц календаря */
  /* Выбранный месяц календаря */
  public month!: number;
  public monthTitle!: string;
  public yearTitle!: string;
  public weekDays!: string[];
  public isDisabled = true;
  public activeDateName!: string;

  /* Флаг для блокировки кнопки предыдущей даты */
  public isPrevDateValid$ = new BehaviorSubject(false);
  /* Флаг для блокировки кнопки следующей даты */
  public isNextDateValid$ = new BehaviorSubject(false);

  constructor(
    private datePickerType: DatePickerType,
    private dateService: DateService,
  ) {
    super();
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
    if (this.dateRange.from) {
      this.pickedMonthDate = this.dateRange.from;
    }
  }

  /*Инициализация календаря */
  public initCalendar(): void {
    this.year = this.pickedMonthDate.getFullYear();
    this.month = this.pickedMonthDate.getMonth();
    switch (this.datePickerType.currentType) {
      case DatePickerTypeEnum.Day:
        this.monthTitle = MONTH_NAMES[this.month];
        this.yearTitle = `${this.year} г.`;
        this.checkValidOfControlButtons();
        break;
      case DatePickerTypeEnum.Month:
        this.monthTitle = '';
        this.yearTitle = `${this.year} г.`;
        this.checkValidOfControlButtons();
        break;
      case DatePickerTypeEnum.Year:
        this.monthTitle = '';
        this.yearTitle = '';
        break;
    }
    this.calendarBox = getCalendar(
      this.pickedMonthDate,
      this.dateRange,
      this.datePickerType.currentType,
      this.dateService,
    );
  }

  /*Проверка валидности кнопок переключения даты */
  public checkValidOfControlButtons(): void {
    const firstValidDate = this.dateService.moment().subtract(MAX_YEARS_COUNT - 1, 'years').startOf('year');
    const lastValidDate = this.dateService.moment().add(1, 'day');
    const range = this.dateService.range(firstValidDate, lastValidDate);
    const notExcludeStartAndEndDatesConst = {
      excludeEnd: false,
      excludeStart: false,
    };
    
    this.isPrevDateValid$.next(range.contains(
      this.dateCotrol('subtract'),
      notExcludeStartAndEndDatesConst,
    ));
    this.isNextDateValid$.next(range.contains(
      this.dateCotrol('add'),
      notExcludeStartAndEndDatesConst,
    ));
  }

  /*Дата выбрана */
  public pickDate(name: string): void {
    this.calendarDate = this.dateService.moment(name, 'YYYY-MM-DD').toDate();
    this.activeDateName = name;
    switch (this.datePickerType.currentType) {
      case DatePickerTypeEnum.Year:
        this.pickedMonthDate = this.calendarDate;
        this.datePickerType.dateType(DatePickerTypeEnum.Month);
        this.initCalendar();
        break;
      case DatePickerTypeEnum.Month:
        this.pickedMonthDate = this.calendarDate;
        this.datePickerType.dateType(DatePickerTypeEnum.Day);
        this.initCalendar();
        break;
      default:
        this.isDisabled = false;
    }
  }

  /*Предыдущий период */
  public goToPreviousMonth(): void {
    this.pickedMonthDate = this.dateCotrol('subtract');

    this.initCalendar();
  }

  /*Следующий период */
  public goToNextMonth(): void {
    this.pickedMonthDate = this.dateCotrol('add');
    this.initCalendar();
  }

  /*Метод для получения следующего/предыдущего месяца/года */
  private dateCotrol(operation: 'add' | 'subtract'): Date {
    const count = operation === 'add' ? 1 : -1;
    if (this.showMonth) {
      return this.dateService.moment(`${this.year + count} 1`, 'YYYY-MM-DD').toDate();
    } else {
      const calendarMonth = operation === 'add' ? this.month === 11 : this.month === 0;
      if (calendarMonth) {
        const month = operation === 'add' ? 1 : 12;
        return this.dateService.moment(`${this.year + count} ${month}`, 'YYYY-MM-DD').toDate();
      } else {
        return this.dateService.moment(`${this.year} ${this.month + 1 + count}`, 'YYYY-MM-DD').toDate();
      }
    }
  }

  /*Изменение отображаемого типа */
  public changeType(type: number): void {
    this.datePickerType.dateType(type);
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
