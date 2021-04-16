import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import { DateRange, MomentRangeStaticMethods } from 'moment-range';
import { moment } from './moment';

const momentDefaultFormat = 'YYYY-MM-DD hh:mm:ss';
@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  /** */
  public moment(
    inp?: moment.MomentInput,
    format: moment.MomentFormatSpecification = momentDefaultFormat,
    language?: string, strict?: boolean
  ): MomentRangeStaticMethods & Moment {
    return moment(this.checkDate(inp), format, language, strict);
  }

  /**
   * Отнять от даты время и получить результат
   * @param amount Время которое необходимо отнять
   * @param unit В чем измеряется время
   * @param date От какой даты осчитывать
   */
  public subtract(amount: moment.DurationInputArg1, unit?: moment.DurationInputArg2, date?: moment.MomentInput,): moment.Moment {
    return moment(this.checkDate(date)).subtract(amount, unit);
  }

  /**
   * Прибавить к дате время и получить результат
   * @param amount Время которое необходимо прибавить
   * @param unit В чем измеряется время
   * @param date От какой даты осчитывать
   */
  public add(amount: moment.DurationInputArg1, unit?: moment.DurationInputArg2, date?: moment.MomentInput): moment.Moment {
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
  public utc(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, language?: string, strict?: boolean): moment.Moment {
    return moment.utc(inp, strict);
  }

  /**
   * Получить промежуток дат
   * @param start Стартовая дата
   * @param end  Конечная дата
   */
  public range(start: Moment | Date, end: Moment | Date): DateRange {
    return moment().range(start, end);
  }

  /**
   * Определение последовательности дат
   * @param startDate Стартовая дата
   * @param endDate  Конечная дата
   * @param granularity По какому типу сравнивать
   */
  public isAfter(startDate: moment.MomentInput, endDate: moment.MomentInput, granularity?: moment.unitOfTime.StartOf): boolean {
    return moment(this.checkDate(startDate), 'YYYY-MM-DD').isAfter(this.checkDate(endDate), granularity);
  }

  /**
   * Определение последовательности дат
   * @param startDate Стартовая дата
   * @param endDate  Конечная дата
   * @param granularity По какому типу сравнивать
   */
  public isBefore(startDate: moment.MomentInput, endDate: moment.MomentInput, granularity?: moment.unitOfTime.StartOf): boolean {
    return moment(this.checkDate(startDate), 'YYYY-MM-DD').isBefore(this.checkDate(endDate), granularity);
  }

  /**
   * Получить строку из даты
   * @param date Дата
   * @param format Формат даты
   * @param momentFormat Формат для moment
   */
  public getDateStringFromMoment(date: moment.MomentInput, format: string, momentFormat: string = momentDefaultFormat): string {
    return moment(date, momentFormat).format(format);
  }

  private checkDate(date: moment.MomentInput): MomentRangeStaticMethods & Moment | moment.MomentInput {
    return date ? date : moment();
  }
}
