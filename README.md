# school-semesters
[![.github/workflows/run.yml](https://github.com/fourthclasshonours/school-semesters/actions/workflows/run.yml/badge.svg)](https://github.com/fourthclasshonours/school-semesters/actions/workflows/run.yml)

This repository allows the generation of school terms.

Academic calendars usually reside in PDF files, which is a great visual format but not ideal for data processing. The code here does not attempt to parse PDF files, but rather tries to mimic the logic used to set school terms (e.g. 2nd Sunday of August).

Output files are generated in the `gh-pages` branch.

### Date format
All dates are formatted to the yyyy-MM-DD format with no time/timezone information. Note that if timezone information is required for computation, Singapore Standard Time (UTC+8) should be used.

**Example of a term period**
```ts
{
  date_start: "2020-09-07",
  date_end: "2020-10-19",
  type: "class"
}
```

In the example of a term period above, the start date is inclusive but the end date is exclusive. This means that this particular period begins on 7th August 2020, but ends at the end of 19th October 2020 (depending on your definition of end, e.g. 23:59, 23:59:59, etc.).
