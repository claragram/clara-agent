import { defineLocale } from './define-locale'

export const pt = defineLocale({
  common: {
    save: 'Salvar',
    cancel: 'Cancelar',
    search: 'Search...',
    close: 'Close'
  },
  settings: {
    title: 'Configurações',
    language: 'Idioma',
    languageDescription: 'Escolha o idioma da interface de Clara.',
    appearance: 'Aparência'
  },
  chat: {
    placeholder: 'Envie uma mensagem para Clara...'
  }
})
