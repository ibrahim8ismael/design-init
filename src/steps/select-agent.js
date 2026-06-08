import * as p from '@clack/prompts';
import pc from 'picocolors';
import { AGENTS, SKILL_SOURCE } from '../utils/constants.js';
import { runCommand } from '../utils/execute.js';

export async function selectAgent({ agent } = {}) {
  let agentObj;

  if (agent) {
    agentObj = AGENTS.find(a => a.value === agent || a.slug === agent);
    if (!agentObj) {
      p.log.error(`Unknown agent "${agent}". Valid: ${AGENTS.map(a => a.value).join(', ')}`);
      process.exit(1);
    }
  } else {
    const selected = await p.select({
      message: 'Which AI coding agent are you using?',
      options: AGENTS.map(a => ({
        label: a.name,
        value: a.value,
        hint: a.slug,
      })),
    });

    if (p.isCancel(selected)) {
      p.cancel('Cancelled.');
      process.exit(0);
    }

    agentObj = AGENTS.find(a => a.value === selected);
  }

  p.log.step(`Installing impeccable.style skills for ${pc.cyan(agentObj.name)}...`);

  const result = await runCommand('npx', [
    'skills', 'add', SKILL_SOURCE,
    '-a', agentObj.slug,
    '-y',
  ]);

  if (result.exitCode === 0) {
    p.log.success('Skills installed for ' + agentObj.name);
  } else {
    p.log.warn('Skill installation had issues (exit ' + result.exitCode + ')');
    p.log.warn('You can reinstall: npx skills add pbakaus/impeccable');
  }

  return agentObj;
}
