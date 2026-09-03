import { contextBridge, ipcRenderer, webFrame, webUtils } from 'electron'

// Which translucency the OS can back. Asked __PROT_1_synchroclaraly__ because the renderer
// needs it before its first paint, and answered by main because deciding it
// needs `os.release()` — a sandboxed preload may only require electron, events,
// timers and url, so importing node:os here throws before contextBridge runs
// and takes the ENTIRE bridge down with it (window.claraDesktop undefined =>
// "Desktop IPC bridge is unavailable"). No reply means no glass, which degrades
// to an ordinary opaque window rather than a page thinned over nothing.
const translucencySupport = ipcRenderer.sendSync('clara:translucency:support')
const hudWindowing = ipcRenderer.sendSync('clara:hud:windowing')
const hudNativeDrag = hudWindowing?.nativeDrag === true
const launchFlags = ipcRenderer.sendSync('clara:launch-flags')

contextBridge.exposeInMainWorld('claraDesktop', {
  glassSupported: translucencySupport?.glass === true,
  translucencySupported: translucencySupport?.translucency === true,
  // Launch-flag fact: the app was started with --local, so the renderer may
  // show the local-models surfaces. Static for the window's lifetime.
  localModelsEnabled: launchFlags?.localModels === true,
  getConnection: profile => ipcRenderer.invoke('clara:connection', profile),
  // Registry-scoped backend resolution: { connectionId, profile } → descriptor.
  getConnectionFor: payload => ipcRenderer.invoke('clara:connection:for', payload),
  getProfileRoutes: profiles => ipcRenderer.invoke('clara:plugin-profile-routes', profiles),
  revalidateConnection: () => ipcRenderer.invoke('clara:connection:revalidate'),
  touchBackend: profile => ipcRenderer.invoke('clara:backend:touch', profile),
  getGatewayWsUrl: profile => ipcRenderer.invoke('clara:gateway:ws-url', profile),
  // Registry-scoped fresh WS URL: { connectionId, profile } → result shape of
  // getGatewayWsUrl, minted against that connection's backend.
  getGatewayWsUrlFor: payload => ipcRenderer.invoke('clara:gateway:ws-url-for', payload),
  // Union agent roster across every registered connection.
  getAgentRoster: () => ipcRenderer.invoke('clara:agents:roster'),
  openSessionWindow: (sessionId, opts) => ipcRenderer.invoke('clara:window:openSession', sessionId, opts),
  openSessionInTerminal: (sessionId, opts) => ipcRenderer.invoke('clara:window:openInTerminal', sessionId, opts),
  openWindow: () => ipcRenderer.invoke('clara:window:openInstance'),
  openBrowserWindow: tabId => ipcRenderer.invoke('clara:window:openBrowser', tabId),
  onBrowserPopoutClosed: callback => {
    const listener = (_event, tabId) => callback(tabId)
    ipcRenderer.on('clara:browser-popout:closed', listener)

    return () => ipcRenderer.removeListener('clara:browser-popout:closed', listener)
  },
  claimAmbientCue: key => ipcRenderer.invoke('clara:ambient:claim', key),
  wakeIndicator: {
    getState: () => ipcRenderer.invoke('clara:wake-indicator:get'),
    setState: state => ipcRenderer.send('clara:wake-indicator:set', state),
    onState: callback => {
      const listener = (_event, state) => callback(state)
      ipcRenderer.on('clara:wake-indicator:state', listener)

      return () => ipcRenderer.removeListener('clara:wake-indicator:state', listener)
    }
  },
  petOverlay: {
    // Main renderer → main process: window lifecycle + drag. `request` is
    // `{ bounds, screen }`; resolves with the screen bounds it actually used.
    open: request => ipcRenderer.invoke('clara:pet-overlay:open', request),
    close: () => ipcRenderer.invoke('clara:pet-overlay:close'),
    setBounds: bounds => ipcRenderer.send('clara:pet-overlay:set-bounds', bounds),
    setIgnoreMouse: ignore => ipcRenderer.send('clara:pet-overlay:ignore-mouse', ignore),
    // Flip the overlay focusable (and focus it) while the composer needs keys.
    setFocusable: focusable => ipcRenderer.send('clara:pet-overlay:set-focusable', focusable),
    // Main renderer → overlay (forwarded by main): push the latest pet state.
    pushState: payload => ipcRenderer.send('clara:pet-overlay:state', payload),
    // Overlay → main renderer (forwarded by main): pop back in / composer submit.
    control: payload => ipcRenderer.send('clara:pet-overlay:control', payload),
    // Overlay subscribes to state pushes.
    onState: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('clara:pet-overlay:state', listener)

      return () => ipcRenderer.removeListener('clara:pet-overlay:state', listener)
    },
    // Main renderer subscribes to overlay control messages.
    onControl: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('clara:pet-overlay:control', listener)

      return () => ipcRenderer.removeListener('clara:pet-overlay:control', listener)
    }
  },
  // HUD mode: the chrome-free floating chat. A full app renderer (own gateway)
  // sized as a floating bar, so it mounts the real composer. Main owns the
  // window; `onChanged` keeps every window's toggle truthful.
  hud: {
    nativeDrag: hudNativeDrag,
    windowing: {
      clientPlacement: hudWindowing?.clientPlacement !== false,
      controlDrag: hudWindowing?.controlDrag === true,
      nativeDrag: hudNativeDrag,
      solid: hudWindowing?.solid === true,
      workspaceTransfer: hudWindowing?.workspaceTransfer === true
    },
    open: request => ipcRenderer.invoke('clara:hud:open', request),
    close: () => ipcRenderer.invoke('clara:hud:close'),
    setIgnoreMouse: ignore => ipcRenderer.send('clara:hud:ignore-mouse', ignore),
    beginMove: () => ipcRenderer.send('clara:hud:begin-move'),
    endMove: () => ipcRenderer.send('clara:hud:end-move'),
    moveBy: delta => ipcRenderer.send('clara:hud:move-by', delta),
    setWorkspaceTransfer: transferring => ipcRenderer.send('clara:hud:workspace-transfer', transferring),
    setBounds: bounds => ipcRenderer.send('clara:hud:set-bounds', bounds),
    resetLayout: () => ipcRenderer.invoke('clara:hud:reset-layout'),
    // Whether the band covers the window below the bar. Main pairs it with the
    // user's translucency setting to decide the native frost (macOS vibrancy /
    // Windows 11 DWM backdrop) — see hudFrostFor.
    setFrost: showing => ipcRenderer.invoke('clara:hud:frost', showing),
    // The HUD tells main which session it is on; main hands that back to the
    // app window when the HUD closes, so the app can re-home onto it.
    setSession: sessionId => ipcRenderer.send('clara:hud:session', sessionId),
    onGoto: callback => {
      const listener = (_event, sessionId) => callback(sessionId)
      ipcRenderer.on('clara:hud:goto', listener)

      return () => ipcRenderer.removeListener('clara:hud:goto', listener)
    },
    onChanged: callback => {
      const listener = (_event, state) => callback(state)
      ipcRenderer.on('clara:hud:changed', listener)

      return () => ipcRenderer.removeListener('clara:hud:changed', listener)
    },
    // Linux only, and silent elsewhere: where the cursor is, in page
    // coordinates, or null when it has left the window. Stands in for the
    // mousemove that `setIgnoreMouseEvents(true, { forward: true })` delivers on
    // macOS and Windows but not here.
    onCursor: callback => {
      const listener = (_event, point) => callback(point)
      ipcRenderer.on('clara:hud:cursor', listener)

      return () => ipcRenderer.removeListener('clara:hud:cursor', listener)
    },
    // Main's game-overlay watch: whether a fullscreen app (a game) is under
    // the HUD, so the renderer can step back to the low-opacity overlay
    // treatment while one owns the screen.
    onGameOverlay: callback => {
      const listener = (_event, state) => callback(state)
      ipcRenderer.on('clara:hud:game-overlay', listener)

      return () => ipcRenderer.removeListener('clara:hud:game-overlay', listener)
    }
  },
  // Quick Entry: the global-hotkey mini composer window. Main owns the OS
  // shortcut + the persisted preference; the quick window only captures text
  // and hands it back, and the primary renderer submits it through the normal
  // prompt path.
  quickEntry: {
    getSettings: () => ipcRenderer.invoke('clara:quick-entry:settings:get'),
    setSettings: patch => ipcRenderer.invoke('clara:quick-entry:settings:set', patch),
    submit: payload => ipcRenderer.send('clara:quick-entry:submit', payload),
    dismiss: () => ipcRenderer.send('clara:quick-entry:dismiss'),
    // Primary renderer → main → quick window: gateway connection state + the
    // recent-session options the target picker offers. Main caches the latest
    // payload so a freshly spawned quick window starts from truth.
    pushState: payload => ipcRenderer.send('clara:quick-entry:state', payload),
    // Quick window subscribes to those pushes.
    onState: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('clara:quick-entry:state', listener)

      return () => ipcRenderer.removeListener('clara:quick-entry:state', listener)
    },
    // Main → primary renderer: a submit captured by the quick window.
    onSubmit: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('clara:quick-entry:submit', listener)

      return () => ipcRenderer.removeListener('clara:quick-entry:submit', listener)
    },
    // Main → quick window: you were just summoned (reset draft + refocus).
    onShown: callback => {
      const listener = () => callback()
      ipcRenderer.on('clara:quick-entry:shown', listener)

      return () => ipcRenderer.removeListener('clara:quick-entry:shown', listener)
    }
  },
  getBootProgress: () => ipcRenderer.invoke('clara:boot-progress:get'),
  getConnectionConfig: profile => ipcRenderer.invoke('clara:connection-config:get', profile),
  saveConnectionConfig: payload => ipcRenderer.invoke('clara:connection-config:save', payload),
  applyConnectionConfig: payload => ipcRenderer.invoke('clara:connection-config:apply', payload),
  testConnectionConfig: payload => ipcRenderer.invoke('clara:connection-config:test', payload),
  // Opt-in OS-keychain encryption for stored gateway secrets (default off —
  // see secret-storage-policy.ts). get never touches the OS keychain.
  getSecretStorageEncryption: () => ipcRenderer.invoke('clara:secret-storage:get'),
  setSecretStorageEncryption: (on: boolean) => ipcRenderer.invoke('clara:secret-storage:set', on),
  // v2 multi-connection registry: named agent sources (local / remote / cloud / ssh).
  connections: {
    list: () => ipcRenderer.invoke('clara:connections:list'),
    save: payload => ipcRenderer.invoke('clara:connections:save', payload),
    remove: id => ipcRenderer.invoke('clara:connections:remove', id),
    setPrimary: id => ipcRenderer.invoke('clara:connections:set-primary', id),
    setLaunchMode: mode => ipcRenderer.invoke('clara:connections:set-launch-mode', mode),
    setLastUsed: id => ipcRenderer.invoke('clara:connections:set-last-used', id),
    test: id => ipcRenderer.invoke('clara:connections:test', id),
    updateManaged: id => ipcRenderer.invoke('clara:connections:update-managed', id),
    // Fan out `clara update` to every eligible registered connection.
    // Optional excludeIds skips rows the caller updates through another path.
    updateAll: options => ipcRenderer.invoke('clara:connections:update-all', options),
    // Registry lifecycle push (main → renderer): a connection was removed or
    // materially edited, so secondaries scoped to it must be disposed (and,
    // for edits, re-dialed at the new target).
    onChanged: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('clara:connections:changed', listener)

      return () => ipcRenderer.removeListener('clara:connections:changed', listener)
    }
  },
  sshConfigHosts: () => ipcRenderer.invoke('clara:ssh-config:hosts'),
  sshResolveHost: host => ipcRenderer.invoke('clara:ssh-config:resolve', host),
  probeConnectionConfig: remoteUrl => ipcRenderer.invoke('clara:connection-config:probe', remoteUrl),
  oauthLoginConnectionConfig: remoteUrl => ipcRenderer.invoke('clara:connection-config:oauth-login', remoteUrl),
  oauthLogoutConnectionConfig: remoteUrl => ipcRenderer.invoke('clara:connection-config:oauth-logout', remoteUrl),
  // Clara Cloud: one portal login powers discovery + silent per-agent sign-in
  // (cloud-auto-discovery Phase 3).
  cloud: {
    status: () => ipcRenderer.invoke('clara:cloud:status'),
    login: () => ipcRenderer.invoke('clara:cloud:login'),
    logout: () => ipcRenderer.invoke('clara:cloud:logout'),
    discover: org => ipcRenderer.invoke('clara:cloud:discover', org),
    agentSignIn: dashboardUrl => ipcRenderer.invoke('clara:cloud:agent-sign-in', dashboardUrl)
  },
  profile: {
    get: () => ipcRenderer.invoke('clara:profile:get'),
    remember: name => ipcRenderer.invoke('clara:profile:remember', name),
    set: name => ipcRenderer.invoke('clara:profile:set', name)
  },
  api: request => ipcRenderer.invoke('clara:api', request),
  notify: payload => ipcRenderer.invoke('clara:notify', payload),
  requestMicrophoneAccess: () => ipcRenderer.invoke('clara:requestMicrophoneAccess'),
  readWindowBelow: () => ipcRenderer.invoke('clara:window:readBelow'),
  readFileDataUrl: filePath => ipcRenderer.invoke('clara:readFileDataUrl', filePath),
  readFileDataUrlForAttach: filePath => ipcRenderer.invoke('clara:readFileDataUrlForAttach', filePath),
  dataUrlReadMax: {
    get: () => ipcRenderer.invoke('clara:data-url-read-max:get'),
    set: maxMb => ipcRenderer.invoke('clara:data-url-read-max:set', maxMb)
  },
  readFileText: filePath => ipcRenderer.invoke('clara:readFileText', filePath),
  readPluginSource: (filePath: string) => ipcRenderer.invoke('clara:readPluginSource', filePath),
  selectPaths: options => ipcRenderer.invoke('clara:selectPaths', options),
  selectSavePath: options => ipcRenderer.invoke('clara:selectSavePath', options),
  writeClipboard: text => ipcRenderer.invoke('clara:writeClipboard', text),
  readClipboard: () => ipcRenderer.invoke('clara:readClipboard'),
  saveGatewayFile: payload => ipcRenderer.invoke('clara:saveGatewayFile', payload),
  saveImageFromUrl: url => ipcRenderer.invoke('clara:saveImageFromUrl', url),
  contextMenuEdit: command => ipcRenderer.invoke('clara:context-menu:edit', command),
  contextMenuCopyImage: () => ipcRenderer.invoke('clara:context-menu:copy-image'),
  contextMenuSpellcheck: action => ipcRenderer.invoke('clara:context-menu:spellcheck', action),
  contextMenuGuestAddWord: payload => ipcRenderer.invoke('clara:context-menu:guest-add-word', payload),
  onContextMenuSpellcheck: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('clara:context-menu-spellcheck', listener)

    return () => ipcRenderer.removeListener('clara:context-menu-spellcheck', listener)
  },
  saveImageBuffer: (data, ext, name) => ipcRenderer.invoke('clara:saveImageBuffer', { data, ext, name }),
  capturePreview: payload => ipcRenderer.invoke('clara:capturePreview', payload),
  saveClipboardImage: () => ipcRenderer.invoke('clara:saveClipboardImage'),
  getPathForFile: file => {
    try {
      return webUtils.getPathForFile(file) || ''
    } catch {
      return ''
    }
  },
  normalizePreviewTarget: (target, baseDir) => ipcRenderer.invoke('clara:normalizePreviewTarget', target, baseDir),
  watchPreviewFile: url => ipcRenderer.invoke('clara:watchPreviewFile', url),
  watchDirectory: dir => ipcRenderer.invoke('clara:watchDirectory', dir),
  stopPreviewFileWatch: id => ipcRenderer.invoke('clara:stopPreviewFileWatch', id),
  setActiveWork: payload => ipcRenderer.send('clara:active-work', payload),
  setTitleBarTheme: payload => ipcRenderer.send('clara:titlebar-theme', payload),
  setNativeTheme: mode => ipcRenderer.send('clara:native-theme', mode),
  setTranslucency: payload => ipcRenderer.send('clara:translucency', payload),
  setKeepAwake: on => ipcRenderer.send('clara:keep-awake', on),
  setDisableF12: blocked => ipcRenderer.send('clara:devtools:disable-f12', blocked),
  setPreviewShortcutActive: active => ipcRenderer.send('clara:previewShortcutActive', Boolean(active)),
  openExternal: url => ipcRenderer.invoke('clara:openExternal', url),
  mcpOauth: {
    // One-shot loopback listener for MCP OAuth against remote backends: bind
    // on this machine, hand redirectUri to mcp.servers.oauth.start, then wait
    // for the provider redirect and relay code/state via oauth.callback.
    listen: () => ipcRenderer.invoke('clara:mcp-oauth:listen'),
    wait: (id, timeoutMs) => ipcRenderer.invoke('clara:mcp-oauth:wait', id, timeoutMs),
    cancel: id => ipcRenderer.invoke('clara:mcp-oauth:cancel', id)
  },
  openPreviewInBrowser: url => ipcRenderer.invoke('clara:openPreviewInBrowser', url),
  reachPreviewUrl: url => ipcRenderer.invoke('clara:preview:reach', url),
  setActiveConnectionRoute: route => ipcRenderer.send('clara:connection:active-route', route),
  fetchLinkTitle: url => ipcRenderer.invoke('clara:fetchLinkTitle', url),
  resolveFavicon: url => ipcRenderer.invoke('clara:resolveFavicon', url),
  sanitizeWorkspaceCwd: cwd => ipcRenderer.invoke('clara:workspace:sanitize', cwd),
  settings: {
    getDefaultProjectDir: () => ipcRenderer.invoke('clara:setting:defaultProjectDir:get'),
    setDefaultProjectDir: dir => ipcRenderer.invoke('clara:setting:defaultProjectDir:set', dir),
    pickDefaultProjectDir: () => ipcRenderer.invoke('clara:setting:defaultProjectDir:pick')
  },
  zoom: {
    // Current zoom of this window, as { level, percent }.
    get: () => ipcRenderer.invoke('clara:zoom:get'),
    // __PROT_0_Synchroclara__ zoom factor (1 = 100%). Coordinate math needs it in the
    // same tick as the event it converts, so no IPC round-trip here.
    factor: () => webFrame.getZoomFactor(),
    setPercent: percent => ipcRenderer.send('clara:zoom:set-percent', percent),
    // Fires on every zoom change, including the Ctrl/Cmd +/-/0 shortcuts,
    // so the settings UI can stay in sync with the keyboard.
    onChanged: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('clara:zoom:changed', listener)

      return () => ipcRenderer.removeListener('clara:zoom:changed', listener)
    }
  },
  revealLogs: () => ipcRenderer.invoke('clara:logs:reveal'),
  getRecentLogs: () => ipcRenderer.invoke('clara:logs:recent'),
  // Fire-and-forget: persists a renderer error-boundary catch (with component
  // stack) to desktop.log so crashes survive the window (#79428).
  reportRendererError: report => ipcRenderer.send('clara:logs:renderer-error', report),
  readDir: dirPath => ipcRenderer.invoke('clara:fs:readDir', dirPath),
  gitRoot: startPath => ipcRenderer.invoke('clara:fs:gitRoot', startPath),
  revealPath: targetPath => ipcRenderer.invoke('clara:fs:reveal', targetPath),
  openDir: dirPath => ipcRenderer.invoke('clara:fs:openDir', dirPath),
  desktopPluginsRoot: () => ipcRenderer.invoke('clara:fs:desktopPluginsRoot'),
  logsRoot: () => ipcRenderer.invoke('clara:fs:logsRoot'),
  agentPluginsRoot: () => ipcRenderer.invoke('clara:fs:agentPluginsRoot'),
  renamePath: (targetPath, newName) => ipcRenderer.invoke('clara:fs:rename', targetPath, newName),
  writeTextFile: (filePath, content) => ipcRenderer.invoke('clara:fs:writeText', filePath, content),
  trashPath: targetPath => ipcRenderer.invoke('clara:fs:trash', targetPath),
  git: {
    worktreeList: repoPath => ipcRenderer.invoke('clara:git:worktreeList', repoPath),
    worktreeAdd: (repoPath, options) => ipcRenderer.invoke('clara:git:worktreeAdd', repoPath, options),
    worktreeRemove: (repoPath, worktreePath, options) =>
      ipcRenderer.invoke('clara:git:worktreeRemove', repoPath, worktreePath, options),
    branchSwitch: (repoPath, branch) => ipcRenderer.invoke('clara:git:branchSwitch', repoPath, branch),
    branchList: repoPath => ipcRenderer.invoke('clara:git:branchList', repoPath),
    baseBranchList: repoPath => ipcRenderer.invoke('clara:git:baseBranchList', repoPath),
    repoStatus: repoPath => ipcRenderer.invoke('clara:git:repoStatus', repoPath),
    fileDiff: (repoPath, filePath) => ipcRenderer.invoke('clara:git:fileDiff', repoPath, filePath),
    scanRepos: (roots, options) => ipcRenderer.invoke('clara:git:scanRepos', roots, options),
    review: {
      list: (repoPath, scope, baseRef) => ipcRenderer.invoke('clara:git:review:list', repoPath, scope, baseRef),
      diff: (repoPath, filePath, scope, baseRef, staged) =>
        ipcRenderer.invoke('clara:git:review:diff', repoPath, filePath, scope, baseRef, staged),
      stage: (repoPath, filePath) => ipcRenderer.invoke('clara:git:review:stage', repoPath, filePath),
      unstage: (repoPath, filePath) => ipcRenderer.invoke('clara:git:review:unstage', repoPath, filePath),
      revert: (repoPath, filePath) => ipcRenderer.invoke('clara:git:review:revert', repoPath, filePath),
      revParse: (repoPath, ref) => ipcRenderer.invoke('clara:git:review:revParse', repoPath, ref),
      commit: (repoPath, message, push) => ipcRenderer.invoke('clara:git:review:commit', repoPath, message, push),
      commitContext: repoPath => ipcRenderer.invoke('clara:git:review:commitContext', repoPath),
      push: repoPath => ipcRenderer.invoke('clara:git:review:push', repoPath),
      shipInfo: repoPath => ipcRenderer.invoke('clara:git:review:shipInfo', repoPath),
      prList: (repoPath, branches, numbers) =>
        ipcRenderer.invoke('clara:git:review:prList', repoPath, branches, numbers),
      fetchPrComment: (repoPath, url) => ipcRenderer.invoke('clara:git:review:fetchPrComment', repoPath, url),
      createPr: repoPath => ipcRenderer.invoke('clara:git:review:createPr', repoPath)
    }
  },
  terminal: {
    attach: id => ipcRenderer.invoke('clara:terminal:attach', id),
    cwd: id => ipcRenderer.invoke('clara:terminal:cwd', id),
    dispose: id => ipcRenderer.invoke('clara:terminal:dispose', id),
    resize: (id, size) => ipcRenderer.invoke('clara:terminal:resize', id, size),
    start: options => ipcRenderer.invoke('clara:terminal:start', options),
    write: (id, data) => ipcRenderer.invoke('clara:terminal:write', id, data),
    onData: (id, callback) => {
      const channel = `clara:terminal:${id}:data`
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on(channel, listener)

      return () => ipcRenderer.removeListener(channel, listener)
    },
    onExit: (id, callback) => {
      const channel = `clara:terminal:${id}:exit`
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on(channel, listener)

      return () => ipcRenderer.removeListener(channel, listener)
    }
  },
  onClosePreviewRequested: callback => {
    const listener = () => callback()
    ipcRenderer.on('clara:close-preview-requested', listener)

    return () => ipcRenderer.removeListener('clara:close-preview-requested', listener)
  },
  onPreviewNav: callback => {
    const listener = (_event, command) => callback(command)
    ipcRenderer.on('clara:preview-nav', listener)

    return () => ipcRenderer.removeListener('clara:preview-nav', listener)
  },
  onOpenFolderRequested: callback => {
    const listener = () => callback()
    ipcRenderer.on('clara:open-folder-requested', listener)

    return () => ipcRenderer.removeListener('clara:open-folder-requested', listener)
  },
  onOpenUpdatesRequested: callback => {
    const listener = () => callback()
    ipcRenderer.on('clara:open-updates', listener)

    return () => ipcRenderer.removeListener('clara:open-updates', listener)
  },
  onDeepLink: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('clara:deep-link', listener)

    return () => ipcRenderer.removeListener('clara:deep-link', listener)
  },
  signalDeepLinkReady: () => ipcRenderer.invoke('clara:deep-link-ready'),
  probePluginRepo: payload => ipcRenderer.invoke('clara:plugin:probe', payload),
  installDesktopPlugin: payload => ipcRenderer.invoke('clara:plugin:installDesktop', payload),
  onWindowStateChanged: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('clara:window-state-changed', listener)

    return () => ipcRenderer.removeListener('clara:window-state-changed', listener)
  },
  onFocusSession: callback => {
    const listener = (_event, sessionId) => callback(sessionId)
    ipcRenderer.on('clara:focus-session', listener)

    return () => ipcRenderer.removeListener('clara:focus-session', listener)
  },
  onNotificationAction: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('clara:notification-action', listener)

    return () => ipcRenderer.removeListener('clara:notification-action', listener)
  },
  onNotificationActivate: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('clara:notification-activate', listener)

    return () => ipcRenderer.removeListener('clara:notification-activate', listener)
  },
  onPreviewFileChanged: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('clara:preview-file-changed', listener)

    return () => ipcRenderer.removeListener('clara:preview-file-changed', listener)
  },
  onBackendExit: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('clara:backend-exit', listener)

    return () => ipcRenderer.removeListener('clara:backend-exit', listener)
  },
  // Soft gateway-mode apply finished tearing down the primary backend. Renderer
  // should wipe session lists + re-dial without a window reload.
  onConnectionApplied: callback => {
    const listener = () => callback()
    ipcRenderer.on('clara:connection:applied', listener)

    return () => ipcRenderer.removeListener('clara:connection:applied', listener)
  },
  onPowerResume: callback => {
    const listener = () => callback()
    ipcRenderer.on('clara:power-resume', listener)

    return () => ipcRenderer.removeListener('clara:power-resume', listener)
  },
  // AC ↔ battery transitions; renderers slow their backstop polls on battery.
  getOnBattery: () => ipcRenderer.invoke('clara:power-battery:get'),
  onBatteryChanged: callback => {
    const listener = (_event, onBattery) => callback(Boolean(onBattery))
    ipcRenderer.on('clara:power-battery', listener)

    return () => ipcRenderer.removeListener('clara:power-battery', listener)
  },
  onBootProgress: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('clara:boot-progress', listener)

    return () => ipcRenderer.removeListener('clara:boot-progress', listener)
  },
  // First-launch bootstrap progress -- emitted by the install.ps1 stage
  // runner in main.ts (apps/desktop/electron/bootstrap-runner.ts).
  // Renderer's install overlay subscribes to live events and queries the
  // current snapshot via getBootstrapState() to recover after a devtools
  // reload mid-bootstrap.
  getBootstrapState: () => ipcRenderer.invoke('clara:bootstrap:get'),
  continueBootstrapLocal: () => ipcRenderer.invoke('clara:bootstrap:continue-local'),
  recycleBackend: profile => ipcRenderer.invoke('clara:backend:recycle', profile),
  resetBootstrap: () => ipcRenderer.invoke('clara:bootstrap:reset'),
  repairBootstrap: () => ipcRenderer.invoke('clara:bootstrap:repair'),
  cancelBootstrap: () => ipcRenderer.invoke('clara:bootstrap:cancel'),
  onBootstrapEvent: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('clara:bootstrap:event', listener)

    return () => ipcRenderer.removeListener('clara:bootstrap:event', listener)
  },
  getVersion: () => ipcRenderer.invoke('clara:version'),
  relaunchApp: () => ipcRenderer.invoke('clara:app:relaunch'),
  getRemoteDisplayReason: () => ipcRenderer.invoke('clara:get-remote-display-reason'),
  uninstall: {
    summary: () => ipcRenderer.invoke('clara:uninstall:summary'),
    run: mode => ipcRenderer.invoke('clara:uninstall:run', { mode })
  },
  updates: {
    check: () => ipcRenderer.invoke('clara:updates:check'),
    apply: opts => ipcRenderer.invoke('clara:updates:apply', opts),
    getBranch: () => ipcRenderer.invoke('clara:updates:branch:get'),
    setBranch: name => ipcRenderer.invoke('clara:updates:branch:set', name),
    onProgress: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('clara:updates:progress', listener)

      return () => ipcRenderer.removeListener('clara:updates:progress', listener)
    }
  },
  themes: {
    fetchMarketplace: id => ipcRenderer.invoke('clara:vscode-theme:fetch', id),
    searchMarketplace: query => ipcRenderer.invoke('clara:vscode-theme:search', query)
  },
  // Find-in-page (Ctrl/Cmd+F): delegates to Electron's
  // webContents.findInPage on the IPC sender's window so a Cmd+F pressed
  // in a secondary session window searches THAT window, not the primary.
  // `onFoundInPage` returns the unsubscribe fn; the renderer wires it via
  // `initFindInPageListener` in store/find-in-page.ts and tears it down
  // when the FindBar unmounts.
  findInPage: (query, options) => ipcRenderer.invoke('clara:find-in-page', query, options),
  stopFindInPage: () => ipcRenderer.invoke('clara:stop-find-in-page'),
  onFoundInPage: callback => {
    const listener = (_event, result) => callback(result)
    ipcRenderer.on('clara:found-in-page', listener)

    return () => ipcRenderer.removeListener('clara:found-in-page', listener)
  },
  // Main-process `before-input-event` forwards Ctrl/Cmd+F here so renderer
  // can open the FindBar even when the GTK compositor has already grabbed
  // the chord at the windowing layer (#81727).
  onOpenFindBarRequested: callback => {
    const listener = () => callback()
    ipcRenderer.on('clara:open-find-bar', listener)

    return () => ipcRenderer.removeListener('clara:open-find-bar', listener)
  }
})
