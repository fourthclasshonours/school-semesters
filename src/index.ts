import SMU from './SMU';

async function run() {
  console.dir(SMU(), { depth: null });
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
