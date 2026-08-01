#!/usr/bin/env node
import { run } from '../src/run.js';

run(process.argv.slice(2)).catch((error) => {
  console.error(`\n✖ ${error.message}\n`);
  process.exit(1);
});
