import * as p from '@clack/prompts';
import { existsSync } from 'fs';
import { runCommand } from '../utils/execute.js';

export async function initShadcn({ force } = {}) {
  const configExists = existsSync('components.json');

  if (configExists && !force) {
    p.log.info('shadcn/ui already initialized (components.json found)');
    return false;
  }

  p.log.step('Initializing shadcn/ui...');

  const result = await runCommand('npx', [
    'shadcn@latest', 'init', '-d', '-y',
  ]);

  if (result.exitCode === 0) {
    p.log.success('shadcn/ui initialized');
    return true;
  }

  p.log.error('shadcn init failed: ' + (result.stderr || 'Unknown error'));
  return false;
}
