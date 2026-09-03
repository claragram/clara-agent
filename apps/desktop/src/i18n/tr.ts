import { defineLocale } from './define-locale'

export const tr = defineLocale({
  common: {
    save: 'Kaydet',
    cancel: 'İptal',
    search: 'Search...',
    close: 'Close'
  },
  settings: {
    title: 'Ayarlar',
    language: 'Dil',
    languageDescription: 'Clara arayüz dilini seçin.',
    appearance: 'Görünüm'
  },
  chat: {
    placeholder: 'Clara ya bir mesaj gönderin...'
  }
})
