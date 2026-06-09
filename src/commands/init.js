import * as p from '@clack/prompts';
import { selectAgent } from '../steps/select-agent.js';
import { initShadcn } from '../steps/init-shadcn.js';
import { addComponents } from '../steps/add-components.js';
import { addDesignSystem } from '../steps/add-design.js';

export async function initCommand(options) {
  p.intro('design-init — bootstrap your design system');

  const components = options.components
    ? options.components.split(',').map(s => s.trim()).filter(Boolean)
    : undefined;

  const agent = await selectAgent({ agent: options.agent });
  const initStatus = await initShadcn({ force: options.force });
  const added = initStatus === 'failed'
    ? []
    : await addComponents({ components });
  const design = await addDesignSystem({ design: options.design });

  p.outro('Done — your project is design-ready!');

  console.log();
  console.log('  Summary:');
  console.log(`  • Agent:          ${agent.name}`);
  if (initStatus === 'done') console.log('  • shadcn init:    done');
  if (added === '__all__') console.log('  • Components:     all added');
  else if (Array.isArray(added) && added.length > 0) console.log(`  • Components:     ${added.length} added`);
  if (design) console.log(`  • Design system:  ${design}`);
  console.log();
}
