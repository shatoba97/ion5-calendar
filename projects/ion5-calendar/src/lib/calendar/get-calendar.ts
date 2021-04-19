import { MAX_YEARS_COUNT } from "../const/max-years-count.const";
import { DatePickerTypeEnum } from "../enum/data-picker-type.enum";
import { CalendarModelIO } from "../model/calendar.model";
import { DateRangeModelIO } from "../model/date-range.model";
import { DateService } from "../service/date.service";

export const getCalendar = (
  customDate: Date,
  dateRange: DateRangeModelIO | null,
  type: DatePickerTypeEnum,
  dateService: DateService,
  maxYears: number = MAX_YEARS_COUNT
) => {
  const getCalendarDays = (): CalendarModelIO[] => {
    dateRange = checkDateRange(dateRange);
    const month = customDate.getMonth();
    const year = customDate.getFullYear();

    const weekDaysAmount = 7;
    const december = 12;
    const january = 0;

    const customMonthDaysAmount = new Date(year, month + 1, 0).getDate();
    const customMonthLastDayWeekDay = dateService.moment(`${year}-${month + 1}-${customMonthDaysAmount}`)
      .toDate()
      .getDay();
    const nextMonthDaysAmountCutted =
      weekDaysAmount - (customMonthLastDayWeekDay || 7);

    function createPrevMonthOptions(year: number, month: number) {
      if (month === january) {
        year = year - 1;
        month = december;
      }

      const prevMonthDaysAmount = new Date(year, month, 0).getDate();
      const prevMonthLastDayWeekDay = dateService.moment(`${year}-${month}-${prevMonthDaysAmount}`)
        .toDate()
        .getDay();

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
    type dayBox = [number, number, boolean];
    const prevMonthDaysBox: dayBox = [
      prevMonthDaysAmountCutted,
      prevMonthDaysAmount,
      disabledButton,
    ];
    const customMonthDaysBox: dayBox = [
      firstDay,
      customMonthDaysAmount,
      notDisabledButton,
    ];
    const nextMonthDaysBox: dayBox = [
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
        let fullDate = dateService.getDateStringFromMoment(`${year}-${month + 1}-${dayNumber}`, 'YYYY-MM-DD', 'YYYY-MM-DD');

        //  изменить активность кнопки текущего месяца в зависимости от даты  поля 'From' в период 31 день
        if (currentMonth) {
          if (dateRange) {
            const range = dateService.range(dateRange.from, dateRange.to);
            disabled = !range.contains(dateService.moment(fullDate, 'YYYY-MM-DD'));
          } else {
            disabled = dateService.isAfter(fullDate, dateService.moment());
          }
        }
        if (disabled) {
          fullDate = '';
        }

        daysBox.push({ name: `${dayNumber}`, disabled, fullDate });
        dayNumber++;
      }
    }
    return daysBox;
  };

  const getCalendarMonth = (): CalendarModelIO[] => {
    dateRange = checkDateRange(dateRange);

    return (Array.apply(null, new Array(12)) as Array<number>).map((el, i) => {
      const date = `${customDate.getFullYear()} ${i + 1}`;
      const monthName = dateService.getDateStringFromMoment(date, 'MMM', 'YYYY-MM-DD').toUpperCase();
      if (dateRange) {
        const range = dateService.range(dateService.moment(dateRange.from).startOf('M'), dateService.moment(dateRange.to).endOf('M'));
        const monthFitsDateRange =
          (customDate.getFullYear() === dateRange.from.getFullYear() || customDate.getFullYear() === dateRange.to.getFullYear())
          && (dateRange.from.getMonth() === i || dateRange.to.getMonth() === i)
          && range.contains(
            dateService.moment(date, 'YYYY-MM'),
            {
              excludeEnd: false,
              excludeStart: false,
            }
          );
        return {
          name: monthName,
          disabled: !monthFitsDateRange,
          fullDate: date,
        };
      }
      const monthBeforeCurrentDate = dateService.isBefore(undefined, dateService.moment(date, 'YYYY-MM'));
      return {
        name: monthName,
        disabled: monthBeforeCurrentDate,
        fullDate: date,
      };
    });
  };

  const getCalendarYears = (): CalendarModelIO[] => {
    dateRange = checkDateRange(dateRange);

    return (Array.apply(null, new Array(maxYears)) as [])
      .map((el, i) => {
        return dateService.moment().year() - i;
      })
      .reverse()
      .map((year) => {
        if (dateRange) {
          const monthFitsDateRange = dateRange.from.getFullYear() === year || dateRange.to.getFullYear() === year;
          return {
            name: year.toString(),
            disabled: !monthFitsDateRange,
            fullDate: year.toString(),
          };
        }
        const monthBeforeCurentDate = dateService.isBefore(undefined, year);
        return {
          name: year.toString(),
          disabled: monthBeforeCurentDate,
          fullDate: year.toString(),
        };
      });
  };

  if (type === DatePickerTypeEnum.Day) {
    return getCalendarDays();
  }

  if (type === DatePickerTypeEnum.Month) {
    return getCalendarMonth();
  }

  return getCalendarYears();
};

const checkDateRange = (range: DateRangeModelIO | null): DateRangeModelIO | null => {
  if (!range?.from && !range?.to) {
    range = null;
  }
  if (range?.from && !range?.to) {
    range.to = new Date();
  }

  return range;
};
