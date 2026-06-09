import * as p from '@clack/prompts';
import { SHADCN_COMPONENTS } from '../utils/constants.js';
import { runCommand } from '../utils/execute.js';

export async function addComponents({ components } = {}) {
  let chosen = components;

  if (!chosen) {
    const allOption = { label: 'All components', value: '__all__' };
    const componentOptions = SHADCN_COMPONENTS.map(c => ({
      label: c,
      value: c,
    }));

    const result = await p.multiselect({
      message: 'Which shadcn/ui components to add?',
      options: [allOption, ...componentOptions],
      required: false,
    });

    if (p.isCancel(result)) {
      p.cancel('Cancelled.');
      process.exit(0);
    }

    chosen = result;
  }

  if (!chosen || chosen.length === 0) {
    p.log.info('No components selected, skipping.');
    return [];
  }

  const isAll = chosen.includes('__all__');

  if (isAll) {
    p.log.step('Adding all shadcn/ui components...');

    const result = await runCommand('npx', [
      'shadcn@latest', 'add', '--all', '-y',
    ]);

    if (result.exitCode === 0) {
      p.log.success('All components added');
      return '__all__';
    }

    p.log.error('Failed to add components');
    if (result.stderr) p.log.error(result.stderr);
    return [];
  }

  p.log.step(`Adding ${chosen.length} shadcn/ui components...`);

  const result = await runCommand('npx', [
    'shadcn@latest', 'add', ...chosen, '-y',
  ]);

  if (result.exitCode === 0) {
    p.log.success(`Added ${chosen.length} components`);
  } else {
    p.log.warn('Some components may have failed');
    if (result.stderr) p.log.error(result.stderr);
  }

  return chosen;
}
