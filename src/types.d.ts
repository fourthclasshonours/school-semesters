declare namespace App {
  type PeriodType = 'class' | 'recess' | 'exam' | 'vacation';

  interface Period {
    date_start: string;
    date_end: string;
    type: PeriodType;
  }

  // Used to represent a term or semester
  interface Term {
    label: string;
    periods: Period[];
  }

  interface Uni {
    name: string;
    terms: Term[];
  }
}
