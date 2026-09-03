import { describe, expect, it } from 'vitest'

import {
  normalizeClaraOpenString,
  pathFromClaraDeepLink,
  pathFromOpenDeepLink,
  resolveClaraOpenPath
} from './clara-open-target'

describe('normalizeClaraOpenString', () => {
  it('accepts hash-router paths and strips a leading hash', () => {
    expect(normalizeClaraOpenString('/index-network/intent/1')).toBe('/index-network/intent/1')
    expect(normalizeClaraOpenString('#/index-network/intent/1')).toBe('/index-network/intent/1')
  })

  it('maps plugin-scoped clara:// deep links to the same path', () => {
    expect(normalizeClaraOpenString('clara://index-network/intent/1')).toBe('/index-network/intent/1')
    expect(normalizeClaraOpenString('clara://index-network/intent/1?focus=true')).toBe(
      '/index-network/intent/1?focus=true'
    )
  })

  it('maps clara://open/… deep links by stripping the open host', () => {
    expect(normalizeClaraOpenString('clara://open/index-network/intent/1')).toBe('/index-network/intent/1')
    expect(normalizeClaraOpenString('clara://open/settings/plugins')).toBe('/settings/plugins')
  })

  it('rejects reserved clara kinds and unsafe paths', () => {
    expect(normalizeClaraOpenString('clara://blueprint/morning-brief')).toBeNull()
    expect(normalizeClaraOpenString('clara://plugin/install')).toBeNull()
    expect(normalizeClaraOpenString('https://example.com/x')).toBeNull()
    expect(normalizeClaraOpenString('/../etc/passwd')).toBeNull()
    expect(normalizeClaraOpenString('index-network')).toBeNull()
  })
})

describe('resolveClaraOpenPath', () => {
  it('merges structured path + params', () => {
    expect(resolveClaraOpenPath({ path: '/index-network/intent/1', params: { focus: 'true' } })).toBe(
      '/index-network/intent/1?focus=true'
    )
  })

  it('resolves href the same as a bare string', () => {
    expect(resolveClaraOpenPath({ href: 'clara://index-network/intent/1' })).toBe('/index-network/intent/1')
  })
})

describe('pathFromClaraDeepLink', () => {
  it('builds the navigate path from a plugin-scoped deep-link payload', () => {
    expect(pathFromClaraDeepLink('index-network', 'intent/1')).toBe('/index-network/intent/1')
  })

  it('builds the navigate path from clara://open/… payloads', () => {
    expect(pathFromOpenDeepLink('index-network/intent/1')).toBe('/index-network/intent/1')
    expect(pathFromClaraDeepLink('open', 'agent/42')).toBe('/agent/42')
  })

  it('ignores reserved kinds', () => {
    expect(pathFromClaraDeepLink('blueprint', 'morning-brief')).toBeNull()
    expect(pathFromClaraDeepLink('plugin', 'install')).toBeNull()
  })
})
