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

  tempEnd = tempEnd.clone().add(5, 'days');

  const periodClass1: App.Period = {
    date_start: tempStart.toISOString(true),
    date_end: tempEnd.clone().toISOString(true),
    type: 'class',
  };

  periods.push(periodClass1);

  // Reading 1
  tempStart = tempEnd.clone();
  tempEnd = tempEnd.clone().add(1, 'week');
  tempEnd.add(2, 'days');

  const periodReading1: App.Period = {
    date_start: tempStart.toISOString(true),
    date_end: tempEnd.clone().toISOString(true),
    type: 'reading',
  };

  periods.push(periodReading1);

  // Term post-recess
  tempStart = tempEnd.clone();

  for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
    tempEnd = tempEnd.clone().add(1, 'week');
  }

  tempEnd = tempEnd.clone().add(5, 'days');

  const periodClass2: App.Period = {
    date_start: tempStart.toISOString(true),
    date_end: tempEnd.clone().toISOString(true),
    type: 'class',
  };

  periods.push(periodClass2);

  // Reading 2
  tempStart = tempEnd.clone();
  tempEnd = tempEnd.clone().add(1, 'week');

  const periodReading2: App.Period = {
    date_start: tempStart.toISOString(true),
    date_end: tempEnd.clone().toISOString(true),
    type: 'reading',
  };

  periods.push(periodReading2);

  // Exam
  tempStart = tempEnd.clone();
  tempEnd = tempEnd.clone().add(2, 'week');
  tempEnd.add(1, 'days');

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
  tempEnd.add(1, 'days');

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

export default function NUS() {
  const terms: App.Term[] = [];

  const currentYear = moment().year();

  // Generate for the next four years
  for (let yearIndex = -1; yearIndex < 4; yearIndex++) {
    const augustMoment = moment()
      .set('year', currentYear + yearIndex)
      .set('month', 7)
      .set('date', 1);

    let start = nthDayOfMonth(augustMoment, Day.Mon, 2);

    const yearName = `AY${start.format('YYYY')}/${start
      .clone()
      .add(1, 'year')
      .format('YYYY')}`;

    // Terms
    for (let termIndex = 0; termIndex < 2; termIndex++) {
      const vacationWeekCount = termIndex === 0 ? 6 : 16;

      const { term, end } = generateTerm(
        start,
        `Semester ${termIndex + 1} ${yearName}`,
        vacationWeekCount
      );

      terms.push(term);
      start = end.clone();
    }
  }

  const uni: App.Uni = {
    name: 'National University of Singapore',
    terms,
  };

  return uni;
}
