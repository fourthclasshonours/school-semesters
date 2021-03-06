import moment, { Moment } from 'moment';

import { DATE_FORMAT } from '../constants';
import { Day, nthDayOfMonth } from '../util';

function generateWeek(
  start: Moment,
  end: Moment,
  weekNo: number,
  type: App.PeriodType
): App.Period {
  return {
    date_start: start.format(DATE_FORMAT),
    date_end: end.clone().format(DATE_FORMAT),
    type: type,
    week_no: weekNo,
  };
}

function generateInstrWeek(
  start: Moment,
  end: Moment,
  weekNo: number
): App.Period {
  return generateWeek(start, end, weekNo, 'class');
}

function generateExamWeek(
  start: Moment,
  end: Moment,
  weekNo: number
): App.Period {
  return generateWeek(start, end, weekNo, 'exam');
}

function generateTerm(start: Moment, label: string, vacationWeekCount: number) {
  if (start.weekday() !== 1) {
    throw new Error('Start date given does not fall on a Monday.');
  }

  // Initialize the looping process from a week ago so that each individual sections can start from the correct starting date
  // Outer scope tempStart and tempEnd should both start on Mondays and they should be a week apart.
  let tempStart = start.clone().subtract(1, 'week');
  let tempEnd = start.clone();

  const periods: App.Period[] = [];

  let weekNo = 1;

  // Term pre-recess
  for (weekNo; weekNo < 8; weekNo++) {
    tempStart = tempStart.clone().add(1, 'week');
    tempEnd = tempEnd.clone().add(1, 'week');
    periods.push(generateInstrWeek(tempStart, tempEnd, weekNo));
  }

  // Recess
  tempStart = tempEnd.clone();
  tempEnd = tempEnd.clone().add(1, 'week');

  const periodRecess: App.Period = {
    date_start: tempStart.format(DATE_FORMAT),
    date_end: tempEnd.clone().format(DATE_FORMAT),
    type: 'recess',
    week_no: weekNo,
  };

  periods.push(periodRecess);
  weekNo += 1;

  // Term post-recess
  for (weekNo; weekNo < 15; weekNo++) {
    tempStart = tempStart.clone().add(1, 'week');
    tempEnd = tempEnd.clone().add(1, 'week');
    periods.push(generateInstrWeek(tempStart, tempEnd, weekNo));
  }

  // Exam
  for (weekNo; weekNo < 17; weekNo++) {
    tempStart = tempStart.clone().add(1, 'week');
    tempEnd = tempEnd.clone().add(1, 'week');
    periods.push(generateExamWeek(tempStart, tempEnd, weekNo));
  }

  // Vacation
  tempStart = tempEnd.clone();
  tempEnd = tempEnd.clone().add(vacationWeekCount, 'week');

  const periodVacation: App.Period = {
    date_start: tempStart.format(DATE_FORMAT),
    date_end: tempEnd.clone().format(DATE_FORMAT),
    type: 'vacation',
  };

  periods.push(periodVacation);

  const term: App.Term = {
    label,
    periods,
  };

  return { term, end: tempEnd };
}

function getVacationWeekCount(termNum: number) {
  switch (termNum) {
    case 1: {
      return 5;
    }
    default: {
      return 15;
    }
  }
}

export default function SMU() {
  const terms: App.Term[] = [];

  const currentYear = moment().year();

  // Generate for the next four years
  for (let yearIndex = -1; yearIndex < 4; yearIndex++) {
    const augustMoment = moment()
      .set('year', currentYear + yearIndex)
      .set('month', 7)
      .set('date', 1);

    let start = nthDayOfMonth(augustMoment, Day.Mon, 3);

    const yearName = `AY${start.format('YYYY')}-${start
      .clone()
      .add(1, 'year')
      .format('YY')}`;

    // Terms
    for (let termIndex = 0; termIndex < 2; termIndex++) {
      const vacationWeekCount = getVacationWeekCount(termIndex + 1);

      const { term, end } = generateTerm(
        start,
        `Term ${termIndex + 1} ${yearName}`,
        vacationWeekCount
      );

      terms.push(term);
      start = end.clone();
    }
  }

  const uni: App.Uni = {
    name: 'Singapore Management University',
    terms,
  };

  return uni;
}
