import { defineLocale } from './define-locale'

export const it = defineLocale({
  common: {
    save: 'Salva',
    cancel: 'Annulla',
    search: 'Search...',
    close: 'Close'
  },
  settings: {
    title: 'Impostazioni',
    language: 'Lingua',
    languageDescription: 'Scegli la lingua dell interfaccia di Clara.',
    appearance: 'Aspetto'
  },
  chat: {
    placeholder: 'Invia un messaggio a Clara...'
  }
})
