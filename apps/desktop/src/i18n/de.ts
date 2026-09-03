import { defineLocale } from './define-locale'

export const de = defineLocale({
  common: {
    save: 'Speichern',
    cancel: 'Abbrechen',
    search: 'Search...',
    close: 'Close'
  },
  settings: {
    title: 'Einstellungen',
    language: 'Sprache',
    languageDescription: 'Wählen Sie die Benutzeroberflächensprache von Clara.',
    appearance: 'Erscheinungsbild'
  },
  chat: {
    placeholder: 'Nachricht an Clara senden...'
  }
})
