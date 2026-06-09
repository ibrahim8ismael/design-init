import { execa } from 'execa';

export async function runCommand(bin, args, options = {}) {
  const { silent, ...execaOptions } = options;

  const result = await execa(bin, args, {
    stdio: silent ? 'pipe' : 'inherit',
    reject: false,
    ...execaOptions,
  });

  return result;
}

export async function runNpx(pkg, args, options = {}) {
  return runCommand('npx', [`${pkg}@latest`, ...args], {
    ...options,
  });
}
