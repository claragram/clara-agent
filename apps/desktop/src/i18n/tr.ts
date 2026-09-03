import { defineLocale } from './define-locale'

export const tr = defineLocale({
  language: {
    label: 'Dil',
    description: 'Masaüstü arayüzü için dili seçin.',
    saving: 'Dil kaydediliyor…',
    saveError: 'Dil güncellemesi başarısız oldu',
    switchTo: 'Dili değiştir',
    searchPlaceholder: 'Dil ara…',
    noResults: 'Dil bulunamadı'
  },
  settings: {
    appearance: {
      title: 'Görünüm',
      uiScaleTitle: 'Arayüz Ölçeği',
      uiScaleDesc: (percent: number) =>
        `Uygulama genelinde metin ve kontrolleri ölçeklendirir. Geçerli: %${percent}.`
    }
  }
})
