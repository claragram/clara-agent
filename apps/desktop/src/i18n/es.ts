import { defineLocale } from './define-locale'

export const es = defineLocale({
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    search: 'Search...',
    close: 'Close'
  },
  settings: {
    title: 'Configuración',
    language: 'Idioma',
    languageDescription: 'Elija el idioma de la interfaz de Clara.',
    appearance: 'Apariencia'
  },
  chat: {
    placeholder: 'Enviar un mensaje a Clara...'
  }
})
