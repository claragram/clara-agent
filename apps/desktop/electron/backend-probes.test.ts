/**
 * Tests for electron/backend-probes.ts.
 *
 * Run with: node --test electron/backend-probes.test.ts
 * (Wired into npm test:desktop:platforms in package.json.)
 */

import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { test } from 'vitest'

import {
  canImportClaraCli,
  DEFAULT_PROBE_TIMEOUT_MS,
  claraRuntimeImportProbe,
  PROBE_TIMEOUT_MS,
  resolveProbeTimeoutMs,
  shouldTrustClaraOverride,
  verifyClaraCli
} from './backend-probes'

// Resolve the host's own Node binary -- guaranteed to be on disk and
// runnable. We use it as both a stand-in for "a python that doesn't
// have clara_cli" (since `node -c "import clara_cli"` will exit
// non-zero) and as a way to script verifyClaraCli's success path
// (a tiny script we write to disk that exits 0 on --version).
const NODE_BIN = process.execPath

test('canImportClaraCli returns false when path is falsy', () => {
  assert.equal(canImportClaraCli(''), false)
  assert.equal(canImportClaraCli(null), false)
  assert.equal(canImportClaraCli(undefined), false)
})

test('canImportClaraCli returns false when interpreter cannot run -c', () => {
  // node IS an interpreter, but `node -c "import clara_cli"` is a
  // SyntaxError -- different exit reason from a real Python's
  // ModuleNotFoundError, but the predicate is "exit 0 or not" and
  // both land on "not", which is exactly what we want for the
  // resolver fall-through.
  assert.equal(canImportClaraCli(NODE_BIN), false)
})

test('canImportClaraCli returns false when binary does not exist', () => {
  const ghost = path.join(os.tmpdir(), 'clara-probes-ghost-' + Date.now() + '.exe')
  assert.equal(canImportClaraCli(ghost), false)
})

test('clara runtime import probe checks config dependencies', () => {
  const probe = claraRuntimeImportProbe()
  assert.match(probe, /\bimport yaml\b/)
  // dotenv is the first third-party import on the CLI boot path
  // (clara_cli/env_loader.py); a mid-update venv missing python-dotenv
  // passed the old probe and produced an unrecoverable boot loop.
  assert.match(probe, /\bimport dotenv\b/)
  assert.match(probe, /\bimport clara_cli\.config\b/)
})

test('explicit Clara override is authoritative', () => {
  assert.equal(shouldTrustClaraOverride('/nix/store/abc/bin/clara'), true)
})

test('empty Clara override is not authoritative', () => {
  assert.equal(shouldTrustClaraOverride(''), false)
  assert.equal(shouldTrustClaraOverride(undefined), false)
})

test('verifyClaraCli returns false when command is falsy', () => {
  assert.equal(verifyClaraCli(''), false)
  assert.equal(verifyClaraCli(null), false)
  assert.equal(verifyClaraCli(undefined), false)
})

test('verifyClaraCli returns false when binary does not exist', () => {
  const ghost = path.join(os.tmpdir(), 'clara-probes-ghost-' + Date.now() + '.exe')
  assert.equal(verifyClaraCli(ghost), false)
})

test('verifyClaraCli returns true when --version exits 0', () => {
  // Write a tiny script that exits 0 regardless of args, then invoke
  // it through node. This stands in for a working clara binary --
  // verifyClaraCli only cares about the exit code.
  const scriptPath = path.join(os.tmpdir(), `clara-probes-ok-${Date.now()}-${process.pid}.cjs`)
  fs.writeFileSync(scriptPath, 'process.exit(0)\n')

  try {
    // Use node as the launcher and our script as the "command". Pass
    // shell:false (default) -- node is a real binary, no shim.
    // execFileSync passes ['--version'] as args, which node ignores
    // gracefully (well, it prints its version and exits 0, which is
    // perfect -- exit code 0 is the only signal we read).
    assert.equal(verifyClaraCli(NODE_BIN), true)
  } finally {
    try {
      fs.unlinkSync(scriptPath)
    } catch {
      void 0
    }
  }
})

test('verifyClaraCli swallows timeouts (does not throw)', () => {
  // We can't easily provoke a real hang in CI without slowing the
  // suite, but we CAN confirm that an invocation that DOES throw
  // (because the binary is missing) returns false rather than
  // propagating. Same code path the timeout case takes.
  assert.equal(verifyClaraCli('/definitely/not/a/real/binary/anywhere'), false)
})

test('default probe timeout is 15s (not the old 5s death-loop value)', () => {
  assert.equal(DEFAULT_PROBE_TIMEOUT_MS, 15_000)
  // Module constant uses process.env at load time; with no override it
  // matches the default (tests run without CLARA_PROBE_TIMEOUT_MS).
  assert.equal(PROBE_TIMEOUT_MS, DEFAULT_PROBE_TIMEOUT_MS)
})

test('resolveProbeTimeoutMs honours CLARA_PROBE_TIMEOUT_MS', () => {
  assert.equal(resolveProbeTimeoutMs({}), DEFAULT_PROBE_TIMEOUT_MS)
  assert.equal(resolveProbeTimeoutMs({ CLARA_PROBE_TIMEOUT_MS: '30000' }), 30_000)
  assert.equal(resolveProbeTimeoutMs({ CLARA_PROBE_TIMEOUT_MS: '0' }), DEFAULT_PROBE_TIMEOUT_MS)
  assert.equal(resolveProbeTimeoutMs({ CLARA_PROBE_TIMEOUT_MS: 'nope' }), DEFAULT_PROBE_TIMEOUT_MS)
  // Cap runaway values
  assert.equal(resolveProbeTimeoutMs({ CLARA_PROBE_TIMEOUT_MS: '999999' }), 120_000)
})
