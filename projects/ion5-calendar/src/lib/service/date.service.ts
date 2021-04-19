import { Injectable } from '@angular/core';
import { DateRange, MomentRangeStaticMethods } from 'moment-range';
import {moment} from './moment';
import * as Moment from 'moment';


const momentDefaultFormat = 'YYYY-MM-DD hh:mm:ss';
@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  /** */
  public moment(
    inp?: Moment.MomentInput,
    format: Moment.MomentFormatSpecification = momentDefaultFormat,
    language?: string, strict?: boolean
  ): MomentRangeStaticMethods & Moment.Moment {
    return moment(this.checkDate(inp), format, language, strict);
  }

  /**
   * Отнять от даты время и получить результат
   * @param amount Время которое необходимо отнять
   * @param unit В чем измеряется время
   * @param date От какой даты осчитывать
   */
  public subtract(amount: Moment.DurationInputArg1, unit?: Moment.DurationInputArg2, date?: Moment.MomentInput,): Moment.Moment {
    return moment(this.checkDate(date)).subtract(amount, unit);
  }

  /**
   * Прибавить к дате время и получить результат
   * @param amount Время которое необходимо прибавить
   * @param unit В чем измеряется время
   * @param date От какой даты осчитывать
   */
  public add(amount: Moment.DurationInputArg1, unit?: Moment.DurationInputArg2, date?: Moment.MomentInput): Moment.Moment {
    return moment(this.checkDate(date)).add(amount, unit);
  }

  /**
   * Установить локализацию
   */
  public locale(lg: string): string {
    return moment.locale(lg);
  }

  /**
   * Установить формат даты
   * @param inp Дата
   * @param format Формат даты
   * @param language Локализация
   * @param strict Строгий синтаксический анализ отключает
   *  устаревший откат к собственному конструктору Date при синтаксическом анализе строки.
   */
  public utc(inp?: Moment.MomentInput, format?: Moment.MomentFormatSpecification, language?: string, strict?: boolean): Moment.Moment {
    return moment.utc(inp, format, strict);
  }

  /**
   * Получить промежуток дат
   * @param start Стартовая дата
   * @param end  Конечная дата
   */
  public range(start: Moment.Moment | Date, end: Moment.Moment | Date): DateRange {
    return moment().range(start, end);
  }

  /**
   * Определение последовательности дат
   * @param startDate Стартовая дата
   * @param endDate  Конечная дата
   * @param granularity По какому типу сравнивать
   */
  public isAfter(startDate: Moment.MomentInput, endDate: Moment.MomentInput, granularity?: Moment.unitOfTime.StartOf): boolean {
    return moment(this.checkDate(startDate), 'YYYY-MM-DD').isAfter(this.checkDate(endDate), granularity);
  }

  /**
   * Определение последовательности дат
   * @param startDate Стартовая дата
   * @param endDate  Конечная дата
   * @param granularity По какому типу сравнивать
   */
  public isBefore(startDate: Moment.MomentInput, endDate: Moment.MomentInput, granularity?: Moment.unitOfTime.StartOf): boolean {
    return moment(this.checkDate(startDate), 'YYYY-MM-DD').isBefore(this.checkDate(endDate), granularity);
  }

  /**
   * Получить строку из даты
   * @param date Дата
   * @param format Формат даты
   * @param momentFormat Формат для moment
   */
  public getDateStringFromMoment(date: Moment.MomentInput, format: string, momentFormat: string = momentDefaultFormat): string {
    return moment(date, momentFormat).format(format);
  }

  private checkDate(date: Moment.MomentInput): MomentRangeStaticMethods & Moment.Moment | Moment.MomentInput {
    return date ? date : moment();
  }
}
