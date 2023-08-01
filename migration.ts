import { Logger } from '@nestjs/common';
import { exec } from 'child_process';
import * as util from 'util';

const command = `npm run typeorm migration:create ./src/migrations/${process.argv[2]}`;

(() => exec(command, (error, stdout, stderr) => {
  if (error !== null) {
    Logger.error('migration error', util.inspect(stderr));
  }
  console.log('migration output', util.inspect(stdout));
}))();
