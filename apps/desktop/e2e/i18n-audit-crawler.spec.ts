/**
 * Automated Screenshot & i18n DOM Audit Crawler for Clara Desktop
 *
 * Boots Clara in French locale, navigates through all primary views,
 * subviews, dialogs, and panels, captures visual screenshots, and extracts
 * all visible text strings to detect untranslated English text.
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

import { expect, test, type Page } from '@playwright/test'

import { type MockBackendFixture, setupMockBackend, waitForAppReady } from './fixtures'

const SCREENSHOTS_DIR = path.resolve(
  import.meta.dirname,
  '../../../../screenshots/audit-fr'
)

interface ExtractedStringEntry {
  view: string
  text: string
}

const extractedStrings: ExtractedStringEntry[] = []

async function captureScreen(page: Page, viewName: string) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
  const screenshotPath = path.join(SCREENSHOTS_DIR, `${viewName}.png`)
  
  await page.waitForTimeout(400)
  await page.screenshot({ path: screenshotPath, animations: 'disabled' })
  console.log(`[i18n-crawler] Captured screenshot: ${viewName}.png`)

  // Extract visible texts from DOM
  const texts = await page.evaluate(() => {
    const results: string[] = []
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT
          const parent = node.parentElement
          if (!parent) return NodeFilter.FILTER_REJECT
          const style = window.getComputedStyle(parent)
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
            return NodeFilter.FILTER_REJECT
          }
          return NodeFilter.FILTER_ACCEPT
        }
      }
    )

    let current = walker.nextNode()
    while (current) {
      const text = current.textContent?.trim()
      if (text && text.length > 1 && !results.includes(text)) {
        results.push(text)
      }
      current = walker.nextNode()
    }
    return results
  })

  for (const text of texts) {
    extractedStrings.push({ view: viewName, text })
  }
}

// Allowlist for apps, connectors, plugins names, brands, third-party, codes
const ALLOWED_BRAND_WORDS = new Set([
  'clara', 'workprise', 'nous', 'agent', 'mock', 'model', 'gpt', 'claude', 'sonnet', 'opus',
  'haiku', 'openai', 'anthropic', 'deepseek', 'openrouter', 'ollama', 'gemini', 'groq', 'xai',
  'grok', 'fireworks', 'mistral', 'qwen', 'llama', 'mcp', 'github', 'discord', 'docker', 'npm',
  'json', 'yaml', 'url', 'uri', 'api', 'http', 'https', 'stt', 'tts', 'hud', 'ram', 'vram', 'gpu',
  'cpu', 'os', 'macos', 'linux', 'windows', 'darwin', 'arm64', 'x64', 'elevenlabs', 'minimax',
  'dashscope', 'together', 'cohere', 'azure', 'bedrock', 'vertex', 'ssh', 'git', 'diff', 'patch',
  'bash', 'zsh', 'terminal', 'cmd', 'ctrl', 'alt', 'shift', 'tab', 'enter', 'esc', 'meta',
  'v0.21.0', 'f44ce06', 'now', 'sessions', 'bots', 'airtable', 'telegram', 'slack', 'whatsapp',
  'mattermost', 'matrix', 'signal', 'bluebubbles', 'homeassistant', 'twilio', 'dingtalk', 'feishu',
  'wecom', 'weixin', 'qqbot', 'searxng', 'duckduckgo', 'hugging', 'face', 'gguf', 'llama.cpp', 'nvidia',
  'intel', 'apple', 'silicon', 'metal', 'cuda', 'rocm', 'vllm', 'zyphra', 'lm', 'studio'
])

let fixture: MockBackendFixture | null = null

test.describe('French i18n & Visual Audit Crawler', () => {
  test.beforeAll(async () => {
    fixture = await setupMockBackend({
      extraDisplayConfig: '  language: fr'
    })
    await waitForAppReady(fixture!, 120_000)
  })

  test.afterAll(async () => {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
    const reportPath = path.join(SCREENSHOTS_DIR, 'extracted-strings-fr.json')
    fs.writeFileSync(reportPath, JSON.stringify(extractedStrings, null, 2), 'utf8')

    // Find suspected untranslated English strings outside the allowlist
    const flagged: { view: string; text: string; matchedWords: string[] }[] = []
    const englishWordRegex = /\b(the|and|you|your|with|for|are|from|have|this|that|all|not|can|will|should|must|choose|select|manage|enabled|disabled|default|defaults|settings|profile|profiles|session|sessions|provider|providers|shortcut|shortcuts|backup|custom|local|server|client|runtime|install|download|delete|remove|clear|apply|cancel|close|search|warning|error|success|ready|running|stopped|failed)\b/gi

    for (const item of extractedStrings) {
      // Ignore skill body documentation text
      if (item.text.startsWith('# Airtable') || item.text.includes('Personal Access Token')) {
        continue
      }
      // Ignore simulated mock server responses
      if (item.text.includes('Hello from the mock inference server')) {
        continue
      }
      const words = item.text.match(englishWordRegex)
      if (words) {
        const filtered = words.filter(w => !ALLOWED_BRAND_WORDS.has(w.toLowerCase()))
        if (filtered.length > 0) {
          flagged.push({ view: item.view, text: item.text, matchedWords: filtered })
        }
      }
    }

    const flaggedReportPath = path.join(SCREENSHOTS_DIR, 'flagged-untranslated-strings.json')
    fs.writeFileSync(flaggedReportPath, JSON.stringify(flagged, null, 2), 'utf8')
    console.log(`[i18n-crawler] Saved ${flagged.length} flagged strings to ${flaggedReportPath}`)

    await fixture?.cleanup()
    fixture = null
  })

  test('01 - Main chat view (empty state in French)', async () => {
    const page = fixture!.page
    await captureScreen(page, '01_chat_empty_fr')
  })

  test('02 - Model picker dropdown', async () => {
    const page = fixture!.page
    const modelPickerButton = page.locator('button:has-text("mock-model"), [data-slot="model-picker-trigger"]').first()
    if (await modelPickerButton.isVisible()) {
      await modelPickerButton.click()
      await captureScreen(page, '02_model_picker_fr')
      await page.keyboard.press('Escape')
    }
  })

  test('03 - Active conversation state', async () => {
    const page = fixture!.page
    const composer = page.locator('[contenteditable="true"]').first()
    if (await composer.isVisible()) {
      await composer.click()
      await composer.type('Bonjour Clara, comment vas-tu ?', { delay: 15 })
      await page.keyboard.press('Enter')
      await page.waitForTimeout(2000)
      await captureScreen(page, '03_chat_active_turn_fr')
    }
  })

  test('04 - Left sidebar navigation tabs', async () => {
    const page = fixture!.page

    const navItems = ['Bots', 'Fonctionnalités', 'Messagerie', 'Artefacts', 'Tâches planifiées']
    for (const item of navItems) {
      const btn = page.locator(`button:has-text("${item}"), [role="button"]:has-text("${item}")`).first()
      if (await btn.isVisible()) {
        await btn.click()
        await page.waitForTimeout(400)
        await captureScreen(page, `04_sidebar_${item.toLowerCase().replace(/[^a-z0-9]/g, '_')}_fr`)
      }
    }
  })

  test('05 - Settings Dialog & All Subtabs', async () => {
    const page = fixture!.page
    
    // Direct navigate to HashRouter Settings route
    await page.evaluate(() => {
      window.location.hash = '#/settings'
    })
    await page.waitForTimeout(1000)

    await captureScreen(page, '05_settings_modal_root_fr')

    // Query nav buttons inside Settings overlay
    const navButtons = page.locator('button[data-tour^="nav-"]')
    const count = await navButtons.count()
    console.log(`[i18n-crawler] Found ${count} settings nav buttons`)

    for (let i = 0; i < count; i++) {
      const btn = navButtons.nth(i)
      if (await btn.isVisible()) {
        const label = (await btn.textContent())?.trim().slice(0, 30).replace(/[^a-zA-Z0-9_-]/g, '_') || `tab_${i}`
        await btn.click()
        await page.waitForTimeout(400)
        await captureScreen(page, `05_settings_${i + 1}_${label}_fr`)
      }
    }

    // Return back to main chat
    await page.evaluate(() => {
      window.location.hash = '#/'
    })
    await page.waitForTimeout(400)
  })

  test('06 - Command Palette', async () => {
    const page = fixture!.page
    await page.keyboard.press('Meta+k').catch(() => page.keyboard.press('Control+k'))
    await page.waitForTimeout(500)
    await captureScreen(page, '06_command_palette_fr')
    await page.keyboard.press('Escape')
  })
})
