import { defineLocale } from './define-locale'

export const pt = defineLocale({
  language: {
    label: 'Idioma',
    description: 'Escolha o idioma da interface desktop.',
    saving: 'Salvando idioma…',
    saveError: 'Falha ao atualizar o idioma',
    switchTo: 'Mudar idioma',
    searchPlaceholder: 'Pesquisar idiomas…',
    noResults: 'Nenhum idioma encontrado'
  },
  settings: {
    appearance: {
      title: 'Aparência',
      uiScaleTitle: 'Escala da interface',
      uiScaleDesc: (percent: number) =>
        `Dimensiona texto e controles em todo o aplicativo. Atual: ${percent}%.`
    }
  }
})
