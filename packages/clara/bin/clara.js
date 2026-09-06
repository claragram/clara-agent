#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const home = process.env.CLARA_HOME || join(homedir(), '.clara');
const isWindows = process.platform === 'win32';

// Known install paths
const candidates = [
  join(process.cwd(), isWindows ? 'clara.exe' : 'clara'),
  isWindows ? join(home, 'clara.exe') : join(home, 'clara'),
  isWindows
    ? join(homedir(), 'AppData', 'Local', 'clara', 'clara.exe')
    : join(homedir(), '.local', 'bin', 'clara'),
  isWindows
    ? join(home, 'clara-agent', 'clara.exe')
    : join(home, 'clara-agent', 'clara'),
];

function findOnPath() {
  const cmd = isWindows ? 'where' : 'which';
  const res = spawnSync(cmd, ['clara'], { stdio: 'pipe', encoding: 'utf-8' });
  if (res.status === 0 && res.stdout) {
    const lines = res.stdout.trim().split(/\r?\n/);
    if (lines.length > 0 && lines[0]) {
      return lines[0].trim();
    }
  }
  return null;
}

let claraBinary = findOnPath();
if (!claraBinary) {
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      claraBinary = candidate;
      break;
    }
  }
}

if (!claraBinary) {
  console.log('\x1b[35m%s\x1b[0m', '☤ Clara Agent — Claragram (claragram.com)');
  console.log('Clara runtime not detected. Initiating automated setup...\n');

  const rawFallback = 'https://raw.githubusercontent.com/claragram/clara-agent/main/scripts/install.sh';
  const primaryUrl = 'https://agent.claragram.com/install.sh';

  if (isWindows) {
    const installCmd = `try { iex (irm ${primaryUrl}) } catch { iex (irm https://raw.githubusercontent.com/claragram/clara-agent/main/scripts/install.ps1) }`;
    const install = spawnSync(
      'powershell',
      ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', installCmd],
      { stdio: 'inherit' }
    );
    if (install.status !== 0) {
      console.error('Installation encountered an issue. Run manually:');
      console.error('  iex (irm https://agent.claragram.com/install.ps1)');
      process.exit(install.status || 1);
    }
  } else {
    const installCmd = `(curl -fsSL ${primaryUrl} 2>/dev/null || curl -fsSL ${rawFallback}) | bash`;
    const install = spawnSync('bash', ['-c', installCmd], {
      stdio: 'inherit',
    });
    if (install.status !== 0) {
      console.error('Installation encountered an issue. Run manually:');
      console.error('  curl -fsSL https://agent.claragram.com/install.sh | bash');
      process.exit(install.status || 1);
    }
  }

  claraBinary = findOnPath();
  if (!claraBinary) {
    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        claraBinary = candidate;
        break;
      }
    }
  }
}

if (!claraBinary) {
  console.log('✅ Setup complete. You can now launch Clara with: clara');
  process.exit(0);
}

// Forward execution to native clara executable
const child = spawn(claraBinary, args, {
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});
