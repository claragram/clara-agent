import { defineLocale } from './define-locale'

export const fr = defineLocale({
  language: {
    label: 'Langue',
    description: "Choisissez la langue de l'interface du bureau.",
    saving: 'Enregistrement de la langue…',
    saveError: 'Échec de la mise à jour de la langue',
    switchTo: 'Changer de langue',
    searchPlaceholder: 'Rechercher une langue…',
    noResults: 'Aucune langue trouvée'
  },
  settings: {
    appearance: {
      title: 'Apparence',
      intro: 'Propre à l’application bureau.',
      colorMode: 'Mode de couleur',
      colorModeDesc: 'Choisissez un mode fixe ou laissez Clara suivre le thème du système.',
      uiScaleTitle: 'Échelle de l’interface',
      uiScaleDesc: (percent: number) =>
        `Ajuste la taille du texte et des commandes dans toute l'application. Actuel : ${percent}%.`
    }
  }
})
