import { Moment } from 'moment';

export enum Day {
  Mon = 1,
  Tue = 2,
  Wed = 3,
  Thu = 4,
  Fri = 5,
  Sat = 6,
  Sun = 7,
}

/**
 * https://stackoverflow.com/a/60023927
 **/
export const nthDayOfMonth = (
  monthMoment: Moment,
  day: Day,
  weekNumber: number
) => {
  const m = monthMoment
    .clone()
    .startOf('month') // go to the beginning of the month
    .day(day);
  if (m.month() !== monthMoment.month()) m.add(7, 'd');
  return m.add(7 * (weekNumber - 1), 'd');
};
