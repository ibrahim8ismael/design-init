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

  const componentsToAdd = chosen.includes('__all__')
    ? SHADCN_COMPONENTS
    : chosen;

  p.log.step(`Adding ${componentsToAdd.length} shadcn/ui components...`);

  const result = await runCommand('npx', [
    'shadcn@latest', 'add', ...componentsToAdd, '-y',
  ]);

  if (result.exitCode === 0) {
    p.log.success(`Added ${componentsToAdd.length} components`);
  } else {
    p.log.warn('Some components may have failed');
    if (result.stderr) p.log.error(result.stderr);
  }

  return componentsToAdd;
}
