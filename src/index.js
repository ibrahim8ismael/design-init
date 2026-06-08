import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { initCommand } from './commands/init.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkg = JSON.parse(
  readFileSync(resolve(__dirname, '../package.json'), 'utf-8')
);

export function createProgram() {
  const program = new Command();

  program
    .name('design-init')
    .description('Bootstrap design systems with shadcn/ui, impeccable.style skills, and DESIGN.md')
    .version(pkg.version);

  program
    .command('init')
    .description('Initialize a design system in your project')
    .option('-a, --agent <agent>', 'AI coding agent (opencode, claude-code, codex, gemini-cli)')
    .option('-c, --components <components>', 'Comma-separated shadcn components to add')
    .option('-d, --design <design>', 'Design system slug from getdesign.md (e.g. vercel, stripe)')
    .option('-f, --force', 'Force reinitialize shadcn even if components.json exists')
    .action(initCommand);

  program
    .command('list-designs')
    .description('List available design systems from getdesign.md')
    .action(async () => {
      const { fetchDesigns } = await import('./steps/add-design.js');
      const designs = await fetchDesigns();
      if (designs && designs.length > 0) {
        console.log(`\nAvailable design systems (${designs.length}):\n`);
        const cats = {};
        for (const d of designs) {
          const c = d.category || 'Other';
          if (!cats[c]) cats[c] = [];
          cats[c].push(d);
        }
        for (const [cat, items] of Object.entries(cats)) {
          console.log(`  ${cat}:`);
          for (const d of items) {
            console.log(`    ${d.slug.padEnd(20)} ${d.name}`);
          }
          console.log();
        }
      } else {
        console.log('Could not fetch designs.');
      }
    });

  return program;
}
