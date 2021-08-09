import fs from 'fs';

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
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
