import { defineLocale } from './define-locale'

export const de = defineLocale({
  language: {
    label: 'Sprache',
    description: 'Wählen Sie die Sprache für die Desktop-Oberfläche.',
    saving: 'Sprache wird gespeichert…',
    saveError: 'Sprachaktualisierung fehlgeschlagen',
    switchTo: 'Sprache wechseln',
    searchPlaceholder: 'Sprachen suchen…',
    noResults: 'Keine Sprachen gefunden'
  },
  settings: {
    appearance: {
      title: 'Erscheinungsbild',
      uiScaleTitle: 'Skalierung der Benutzeroberfläche',
      uiScaleDesc: (percent: number) =>
        `Skaliert Text und Steuerelemente in der gesamten App. Aktuell: ${percent}%.`
    }
  }
})
