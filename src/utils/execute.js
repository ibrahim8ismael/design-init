import { execa } from 'execa';

export async function runCommand(bin, args, options = {}) {
  const result = await execa(bin, args, {
    stdio: options.silent ? 'pipe' : 'inherit',
    reject: false,
    ...options,
  });
  return result;
}

export async function runNpx(pkg, args, options = {}) {
  return runCommand('npx', [`${pkg}@latest`, ...args], {
    ...options,
  });
}
