import fs from 'fs';

import NUS from './NUS';
import SMU from './SMU';

async function run() {
  const output: Record<string, App.Uni> = {
    SMU: SMU(),
    NUS: NUS(),
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
