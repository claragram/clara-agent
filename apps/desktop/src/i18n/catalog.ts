import { ar } from './ar'
import { de } from './de'
import { en } from './en'
import { es } from './es'
import { fr } from './fr'
import { it } from './it'
import { ja } from './ja'
import { ko } from './ko'
import { pt } from './pt'
import { ru } from './ru'
import { tr } from './tr'
import type { Locale, Translations } from './types'
import { zh } from './zh'
import { zhHant } from './zh-hant'

export const TRANSLATIONS: Record<Locale, Translations> = {
  fr,
  en,
  de,
  es,
  it,
  pt,
  ko,
  tr,
  zh,
  'zh-hant': zhHant,
  ja,
  ar,
  ru
}
