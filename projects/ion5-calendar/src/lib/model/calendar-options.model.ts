export interface CalendarOptionsModelIO {
  dateTo?: Date | string | Callback;
  dateFrom?: Date | string;
  type: Type;

}

export type Callback = (dateFrom: Date | string) => Date;
export type Type = 'selectDate' | 'dateRange';
