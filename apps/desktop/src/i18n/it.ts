import { defineLocale } from './define-locale'

export const it = defineLocale({
  language: {
    label: 'Lingua',
    description: "Scegli la lingua per l'interfaccia desktop.",
    saving: 'Salvataggio lingua…',
    saveError: 'Aggiornamento lingua non réussito',
    switchTo: 'Cambia lingua',
    searchPlaceholder: 'Cerca lingue…',
    noResults: 'Nessuna lingua trovata'
  },
  settings: {
    appearance: {
      title: 'Aspetto',
      uiScaleTitle: 'Scala interfaccia',
      uiScaleDesc: (percent: number) =>
        `Ridimensiona testo e controlli nell'intera app. Attuale: ${percent}%.`
    }
  }
})
