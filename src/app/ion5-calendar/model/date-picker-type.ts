import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatePickerTypeEnum } from '../enum/data-picker-type.enum';


@Injectable()
export class DatePickerType {
  constructor() {}

  private datePickerTypeEnum = [
    DatePickerTypeEnum.Day,
    DatePickerTypeEnum.Month,
    DatePickerTypeEnum.Year,
  ];

  private datePickerType = DatePickerTypeEnum.Day;

  public get currentType(): DatePickerTypeEnum {
    return this.datePickerType;
  }

  public get nextType(): DatePickerTypeEnum {
    const index = this.datePickerTypeEnum.findIndex(
      (el) => this.datePickerType === el,
    );
    if(index === this.datePickerTypeEnum.length - 1) {
      this.datePickerType = this.datePickerTypeEnum[0];
      return this.datePickerTypeEnum[0];
    }
    this.datePickerType = this.datePickerTypeEnum[index + 1];
    return this.datePickerTypeEnum[index + 1];
  }

  public get previousType(): DatePickerTypeEnum {
    const index = this.datePickerTypeEnum.findIndex(
      (el) => this.datePickerType === el,
    );
    if(index === 0) {
      this.datePickerType = this.datePickerTypeEnum[this.datePickerTypeEnum.length - 1];
      return this.datePickerTypeEnum[this.datePickerTypeEnum.length - 1];
    }
    this.datePickerType = this.datePickerTypeEnum[index - 1];
    return this.datePickerTypeEnum[index - 1];
  }
}
