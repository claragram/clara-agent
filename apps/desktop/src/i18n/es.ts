import { defineLocale } from './define-locale'

export const es = defineLocale({
  language: {
    label: 'Idioma',
    description: 'Elige el idioma para la interfaz de escritorio.',
    saving: 'Guardando idioma…',
    saveError: 'Error al actualizar el idioma',
    switchTo: 'Cambiar idioma',
    searchPlaceholder: 'Buscar idiomas…',
    noResults: 'No se encontraron idiomas'
  },
  settings: {
    appearance: {
      title: 'Apariencia',
      uiScaleTitle: 'Escala de interfaz',
      uiScaleDesc: (percent: number) =>
        `Escala el texto y los controles en toda la aplicación. Actual: ${percent}%.`
    }
  }
})
