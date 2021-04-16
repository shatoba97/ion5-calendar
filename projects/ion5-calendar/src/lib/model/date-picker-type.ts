import { Injectable } from '@angular/core';
import { DatePickerTypeEnum } from '../enum/data-picker-type.enum';


@Injectable()
export class DatePickerType {
    constructor() { }

  private datePickerType = DatePickerTypeEnum.Day;

  public get currentType(): DatePickerTypeEnum {
    return this.datePickerType;
  }

  public dateType(type: number): void {
    if (DatePickerTypeEnum[type]) {
      this.datePickerType = type;
    }
  }
}
