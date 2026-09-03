import type { PanelSection } from '../types.js'

export const SETUP_REQUIRED_TITLE = 'Setup Required'

export const buildSetupRequiredSections = (): PanelSection[] => [
  {
    text: 'Clara needs a model provider before the TUI can start a session.'
  },
  {
    rows: [
      ['/model', 'configure provider + model in-place'],
      ['/setup', 'run full first-time setup wizard in-place'],
      ['Ctrl+C', 'exit and run `clara setup` manually']
    ],
    title: 'Actions'
  }
]
