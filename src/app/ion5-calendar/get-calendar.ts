import { extendMoment } from 'moment-range';
import moment from 'moment';
const Moment = extendMoment(moment);

import { DatePickerTypeEnum } from './enum/data-picker-type.enum';
import { CalendarModelIO } from './model/calendar.model';
import { DateRangeModelIO } from './model/date-range.model';

export const getCalendarDays = (
  customDate: Date,
  dateRange: DateRangeModelIO,
): CalendarModelIO[] => {
  const month = customDate.getMonth();
  const year = customDate.getFullYear();

  const weekDaysAmount = 7;
  const december = 12;
  const january = 0;

  const customMonthDaysAmount = new Date(year, month + 1, 0).getDate();
  const customMonthLastDayWeekDay = new Date(
    year + '-' + (month + 1) + '-' + customMonthDaysAmount,
  ).getDay();
  const nextMonthDaysAmountCutted =
    weekDaysAmount - (customMonthLastDayWeekDay || 7);

  function createPrevMonthOptions(year: number, month: number) {
    if (month === january) {
      year = year - 1;
      month = december;
    }
    const prevMonthDaysAmount = new Date(year, month, 0).getDate();
    const prevMonthLastDayWeekDay = new Date(
      year + '-' + month + '-' + prevMonthDaysAmount,
    ).getDay();

    return [prevMonthDaysAmount, prevMonthLastDayWeekDay];
  }

  const [prevMonthDaysAmount, prevMonthLastDayWeekDay] = createPrevMonthOptions(
    year,
    month,
  );
  const prevMonthDaysAmountCutted =
    prevMonthDaysAmount - prevMonthLastDayWeekDay + 1;

  // создание аргументов для передачи функции daysBoxArguments
  const firstDay = 1;
  const disabledButton = true;
  const notDisabledButton = false;
  const prevMonthDaysBox = [
    prevMonthDaysAmountCutted,
    prevMonthDaysAmount,
    disabledButton,
  ];
  const customMonthDaysBox = [
    firstDay,
    customMonthDaysAmount,
    notDisabledButton,
  ];
  const nextMonthDaysBox = [
    firstDay,
    nextMonthDaysAmountCutted,
    disabledButton,
  ];
  const daysBoxArguments = [
    prevMonthDaysBox,
    customMonthDaysBox,
    nextMonthDaysBox,
  ];

  // Заполнение календаря
  const daysBox = [] as CalendarModelIO[];
  daysBoxArguments.forEach((monthArguments: [number, number, boolean]) =>
    fillDaysBox(...monthArguments),
  );
  function fillDaysBox(dayNumber: number, maxCount: number, disabled: boolean) {
    const currentMonth = !disabled;
    while (dayNumber <= maxCount) {
      const fullDate = year + '-' + (month + 1) + '-' + dayNumber;

      //  изменить активность кнопки текущего месяца в зависимости от даты  поля 'From' в период 31 день
      if (currentMonth) {
        if(dateRange) {
          const range = Moment.range(dateRange.from, dateRange.to);
          const dateFitsDateRange = range.contains(new Date(fullDate));
          if (dateFitsDateRange) {
            disabled = false;
          } else {
            disabled = true;
          }
        } else {
          const dateFitsDateRange = Moment().isAfter(new Date(fullDate));
          if (dateFitsDateRange) {
            disabled = false;
          } else {
            disabled = true;
          }
        }
      }

      daysBox.push({ name: `${dayNumber}`, disabled, fullDate });
      dayNumber++;
    }
  }
  return daysBox;
};

export const getCalendarMonth = (
  customDate: Date,
  dateRange: DateRangeModelIO,
): CalendarModelIO[] => {
  return (Array.apply(null, new Array(12)) as Array<number>).map((el, i) => {
    const date = `${customDate.getFullYear()} ${i + 1}`;
    const monthName = Moment(date).format('MMM').toUpperCase();
    if (dateRange) {
      const range = Moment.range(dateRange.from, dateRange.to);
      const monthFitsDateRange =
        customDate.getFullYear() === dateRange.from.getFullYear() &&
        dateRange.from.getMonth() !== i &&
        !range.contains(new Date(date)) ||
        customDate.getFullYear() !== dateRange.from.getFullYear();
      return {
        name: monthName,
        disabled: monthFitsDateRange,
        fullDate: date,
      };
    }
    const monthBeforeCurentDate = Moment(new Date()).isBefore(date);
    return {
      name: monthName,
      disabled: monthBeforeCurentDate,
      fullDate: date,
    };
  });
};

export const getCalendarYears = (
  customDate: Date,
  dateRange: DateRangeModelIO,
): CalendarModelIO[] => {
  return (Array.apply(null, new Array(10)) as [])
    .map((el, i) => {
      return Moment().year() - i;
    })
    .reverse()
    .map((year) => {
      if (dateRange) {
        const monthFitsDateRange = dateRange.from.getFullYear() !== year;
        return {
          name: year.toString(),
          disabled: monthFitsDateRange,
          fullDate: year.toString(),
        };
      }
      const monthBeforeCurentDate = Moment(new Date()).isBefore(year);
      return {
        name: year.toString(),
        disabled: monthBeforeCurentDate,
        fullDate: year.toString(),
      };
    });
};

export const getCalendar = (
  customDate: Date,
  dateRange: DateRangeModelIO,
  type: DatePickerTypeEnum,
) => {
  if (type === DatePickerTypeEnum.Day) {
    return getCalendarDays(customDate, dateRange);
  }

  if (type === DatePickerTypeEnum.Month) {
    return getCalendarMonth(customDate, dateRange);
  }

  return getCalendarYears(customDate, dateRange);
};
