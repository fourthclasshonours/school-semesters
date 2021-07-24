import fs from 'fs';

import DigiPen from './uni/DigiPen';
import NTU from './uni/NTU';
import NUS from './uni/NUS';
import SMU from './uni/SMU';

async function run() {
  const output: Record<string, App.Uni> = {
    SMU: SMU(),
    NUS: NUS(),
    DigiPen: DigiPen(),
    NTU: NTU(),
  };

  fs.writeFileSync('output/output.json', JSON.stringify(output, null, 2));
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
