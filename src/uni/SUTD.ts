import moment, { Moment } from 'moment';

import { Day, nthDayOfMonth } from '../util';

function generateTerm(start: Moment, label: string, vacationWeekCount: number) {
  const periods: App.Period[] = [];

  let tempStart = start.clone();
  let tempEnd = start.clone();

  // Term pre-recess
  for (let weekIndex = 0; weekIndex < 5; weekIndex++) {
    tempEnd = tempEnd.clone().add(1, 'week');
  }
  tempEnd = tempEnd.clone().add(6, 'days'); // Recess starts one day earlier

  const periodClass1: App.Period = {
    date_start: tempStart.toISOString(true),
    date_end: tempEnd.clone().toISOString(true),
    type: 'class',
  };

  periods.push(periodClass1);

  // Recess
  tempStart = tempEnd.clone();
  tempEnd = tempEnd.clone().add(1, 'week');
  tempEnd = tempEnd.clone().add(1, 'days'); // Recess ends one day later

  const periodRecess: App.Period = {
    date_start: tempStart.toISOString(true),
    date_end: tempEnd.clone().toISOString(true),
    type: 'recess',
  };

  periods.push(periodRecess);

  // Term post-recess
  tempStart = tempEnd.clone();

  for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
    tempEnd = tempEnd.clone().add(1, 'week');
  }
  tempEnd = tempEnd.clone().add(2, 'days'); // Exam is the last three days of term

  const periodClass2: App.Period = {
    date_start: tempStart.toISOString(true),
    date_end: tempEnd.clone().toISOString(true),
    type: 'class',
  };

  periods.push(periodClass2);

  // Exam
  tempStart = tempEnd.clone();
  tempEnd = tempEnd.clone().add(3, 'days');
  tempEnd = tempEnd.clone().add(1, 'days'); // Add one day to for last day of term, which is technically not exam but class.

  const periodExam: App.Period = {
    date_start: tempStart.toISOString(true),
    date_end: tempEnd.clone().toISOString(true),
    type: 'exam',
  };

  periods.push(periodExam);

  // Vacation
  tempStart = tempEnd.clone();

  for (let weekIndex = 0; weekIndex < vacationWeekCount - 1; weekIndex++) {
    tempEnd = tempEnd.clone().add(1, 'week');
  }
  tempEnd = tempEnd.clone().add(1, 'days'); // Add one day because class period ends on Saturday

  const periodVacation: App.Period = {
    date_start: tempStart.toISOString(true),
    date_end: tempEnd.clone().toISOString(true),
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
      return 3;
    }
    case 2: {
      return 20;
    }
    default: {
      return 3;
    }
  }
}

export default function SUTD() {
  const terms: App.Term[] = [];

  const currentYear = moment().year();

  // Generate for the next four years
  for (let yearIndex = -1; yearIndex < 4; yearIndex++) {
    const januaryMoment = moment()
      .set('year', currentYear + yearIndex)
      .set('month', 0)
      .set('date', 1);

    let start = nthDayOfMonth(januaryMoment, Day.Mon, 4);

    const yearName = `AY${start.format('YYYY')}`;

    // Terms
    for (let termIndex = 0; termIndex < 3; termIndex++) {
      const vacationWeekCount = getVacationWeekCount(termIndex + 1);

      // HACK Trimester 3 starts during Trimester 2's vacation.
      // Patch start date for Trimester 3
      if (termIndex + 1 === 3) {
        const septemberMoment = moment()
          .set('year', currentYear + yearIndex)
          .set('month', 8)
          .set('date', 1);
        start = nthDayOfMonth(septemberMoment, Day.Mon, 2);
      }

      const { term, end } = generateTerm(
        start,
        `Trimester ${termIndex + 1} ${yearName}`,
        vacationWeekCount
      );

      terms.push(term);

      start = end.clone();
    }
  }

  const uni: App.Uni = {
    name: 'Singapore University of Technology and Design',
    terms,
  };

  return uni;
}
