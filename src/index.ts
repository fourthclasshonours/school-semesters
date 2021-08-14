import fs from 'fs';

import generateICal from './calendar/generateICal';
import DigiPen from './uni/DigiPen';
import NTU from './uni/NTU';
import NUS from './uni/NUS';
import SMU from './uni/SMU';
import SUSS from './uni/SUSS';
import SUTD from './uni/SUTD';

async function run() {
  const output: Record<string, App.Uni> = {
    SMU: SMU(),
    NUS: NUS(),
    DigiPen: DigiPen(),
    NTU: NTU(),
    SUTD: SUTD(),
    SUSS: SUSS(),
  };

  for (const [filename, data] of Object.entries(output)) {
    fs.writeFileSync(`output/${filename}.json`, JSON.stringify(data, null, 2));
  }

  for (const [filename, uni] of Object.entries(output)) {
    // Create sub-directory
    if (!fs.existsSync(`output/${filename}`)) {
      fs.mkdirSync(`output/${filename}`);
    }

    for (const term of uni.terms) {
      const calendarData = generateICal(uni, term);
      const termFileName = term.label.replace(/\//g, '-');

      fs.writeFileSync(`output/${filename}/${termFileName}.ics`, calendarData);
    }
  }
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
