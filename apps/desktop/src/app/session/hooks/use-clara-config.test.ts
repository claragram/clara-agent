// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { $terminalFontFamily, setTerminalFontFamilyFromConfig } from '@/app/right-sidebar/terminal/terminal-font'
import { getClaraConfig } from '@/clara'
import { persistString } from '@/lib/storage'
import {
  $currentCwd,
  $currentFastMode,
  $currentReasoningEffort,
  $defaultReasoningEffort,
  markComposerSelectionManual,
  setCurrentCwd,
  setCurrentFastMode,
  setCurrentModelSource,
  setCurrentReasoningEffort,
  setDefaultReasoningEffort
} from '@/store/session'

import { deferred } from '../../../test/deferred'

import { useClaraConfig } from './use-clara-config'

vi.mock('@/clara', () => ({
  getClaraConfig: vi.fn(),
  getClaraConfigDefaults: vi.fn().mockResolvedValue({})
}))

const WORKSPACE_CWD_KEY = 'clara.desktop.workspace-cwd'

const mockConfig = (config: Record<string, unknown>) =>
  vi.mocked(getClaraConfig).mockResolvedValue(config as Awaited<ReturnType<typeof getClaraConfig>>)

describe('useClaraConfig refreshClaraConfig', () => {
  beforeEach(() => {
    // Reset atoms and localStorage between tests
    setCurrentCwd('')
    setCurrentFastMode(false)
    setCurrentModelSource('')
    setCurrentReasoningEffort('')
    setDefaultReasoningEffort('')
    setTerminalFontFamilyFromConfig('')
    persistString(WORKSPACE_CWD_KEY, null)
  })

  // Regression: the composer keeps a manual model pick sticky, which skips the
  // composer reseed. The profile default must still be published, because the
  // model picker resolves "the default effort" from it when applying a model's
  // preset — otherwise selecting a model silently downgrades a configured
  // `agent.reasoning_effort: high` to Clara' built-in medium.
  it('publishes the profile default effort even when a manual pick blocks the composer reseed', async () => {
    setCurrentModelSource('manual')
    setCurrentReasoningEffort('low')

    mockConfig({ agent: { reasoning_effort: 'high' } })
    const { result } = renderHook(() => useClaraConfig({ activeSessionIdRef: { current: null } }))

    await act(async () => {
      await result.current.refreshClaraConfig()
    })

    expect($defaultReasoningEffort.get()).toBe('high')
    // The manual pick itself is still respected.
    expect($currentReasoningEffort.get()).toBe('low')
  })

  it('does not let terminal.cwd replace an inactive selected workspace', async () => {
    setCurrentCwd('/Users/example/repo/.worktrees/feature')

    mockConfig({ terminal: { cwd: '/Users/example/new-workspace' } })
    const { result } = renderHook(() => useClaraConfig({ activeSessionIdRef: { current: null } }))

    await act(async () => {
      await result.current.refreshClaraConfig()
    })

    expect($currentCwd.get()).toBe('/Users/example/repo/.worktrees/feature')
  })

  it('does not let terminal.cwd replace an active session workspace', async () => {
    setCurrentCwd('/Users/example/repo/.worktrees/attached')

    mockConfig({ terminal: { cwd: '/Users/example/new-workspace' } })
    const { result } = renderHook(() => useClaraConfig({ activeSessionIdRef: { current: 'session-1' } }))

    await act(async () => {
      await result.current.refreshClaraConfig()
    })

    expect($currentCwd.get()).toBe('/Users/example/repo/.worktrees/attached')
  })

  it('does not let a stale forced config refresh overwrite newer draft selector intent', async () => {
    const profileConfig = deferred<Awaited<ReturnType<typeof getClaraConfig>>>()
    vi.mocked(getClaraConfig).mockReturnValueOnce(profileConfig.promise)

    const { result } = renderHook(() => useClaraConfig({ activeSessionIdRef: { current: null } }))

    let pendingRefresh!: Promise<void>
    act(() => {
      pendingRefresh = result.current.refreshClaraConfig(true)
    })
    expect(getClaraConfig).toHaveBeenCalled()

    // The user turns Fast off and chooses a different effort while the profile
    // defaults are still loading. That newer picker intent owns the composer.
    markComposerSelectionManual()
    setCurrentReasoningEffort('high')
    setCurrentFastMode(false)
    profileConfig.resolve({
      agent: { reasoning_effort: 'low', service_tier: 'priority' }
    } as Awaited<ReturnType<typeof getClaraConfig>>)

    await act(async () => {
      await pendingRefresh
    })

    expect($currentReasoningEffort.get()).toBe('high')
    expect($currentFastMode.get()).toBe(false)
  })

  it('does not publish config after its switch loses ownership', async () => {
    const staleConfig = deferred<Awaited<ReturnType<typeof getClaraConfig>>>()
    vi.mocked(getClaraConfig).mockReturnValueOnce(staleConfig.promise)
    const { result } = renderHook(() => useClaraConfig({ activeSessionIdRef: { current: null } }))
    let ownsSwitch = true

    let refresh!: Promise<void>
    act(() => {
      refresh = result.current.refreshClaraConfig(false, () => ownsSwitch)
    })

    ownsSwitch = false
    staleConfig.resolve({
      agent: { reasoning_effort: 'high', service_tier: 'priority' },
      terminal: { font_family: 'MesloLGS NF' }
    } as Awaited<ReturnType<typeof getClaraConfig>>)

    await act(async () => {
      await refresh
    })

    expect($defaultReasoningEffort.get()).toBe('')
    expect($currentReasoningEffort.get()).toBe('')
    expect($currentFastMode.get()).toBe(false)
    expect($terminalFontFamily.get()).toBe('')
  })

  it('does not let an older profile config overwrite a newer profile', async () => {
    const profileB = deferred<Awaited<ReturnType<typeof getClaraConfig>>>()
    const profileC = deferred<Awaited<ReturnType<typeof getClaraConfig>>>()
    vi.mocked(getClaraConfig).mockReturnValueOnce(profileB.promise).mockReturnValueOnce(profileC.promise)

    const { result } = renderHook(() => useClaraConfig({ activeSessionIdRef: { current: null } }))

    let refreshB!: Promise<void>
    let refreshC!: Promise<void>
    act(() => {
      refreshB = result.current.refreshClaraConfig(true)
      refreshC = result.current.refreshClaraConfig(true)
    })

    profileC.resolve({ agent: { reasoning_effort: 'low', service_tier: 'normal' } })
    await act(async () => {
      await refreshC
    })
    profileB.resolve({ agent: { reasoning_effort: 'high', service_tier: 'priority' } })
    await act(async () => {
      await refreshB
    })

    expect($currentReasoningEffort.get()).toBe('low')
    expect($currentFastMode.get()).toBe(false)
  })

  it('loads the profile terminal font for already-mounted terminal surfaces', async () => {
    mockConfig({ terminal: { font_family: 'MesloLGS NF' } })
    const { result } = renderHook(() => useClaraConfig({ activeSessionIdRef: { current: null } }))

    await act(async () => {
      await result.current.refreshClaraConfig()
    })

    expect($terminalFontFamily.get()).toBe('MesloLGS NF')
  })

  it('does not let an older profile response restore its terminal font', async () => {
    const profileB = deferred<Awaited<ReturnType<typeof getClaraConfig>>>()
    const profileC = deferred<Awaited<ReturnType<typeof getClaraConfig>>>()
    vi.mocked(getClaraConfig).mockReturnValueOnce(profileB.promise).mockReturnValueOnce(profileC.promise)
    const { result } = renderHook(() => useClaraConfig({ activeSessionIdRef: { current: null } }))

    let refreshB!: Promise<void>
    let refreshC!: Promise<void>
    act(() => {
      refreshB = result.current.refreshClaraConfig(true)
      refreshC = result.current.refreshClaraConfig(true)
    })

    profileC.resolve({ terminal: { font_family: 'Hack Nerd Font' } })
    await act(async () => {
      await refreshC
    })
    profileB.resolve({ terminal: { font_family: 'MesloLGS NF' } })
    await act(async () => {
      await refreshB
    })

    expect($terminalFontFamily.get()).toBe('Hack Nerd Font')
  })
})
