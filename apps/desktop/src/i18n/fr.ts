import { defineLocale } from './define-locale'

export const fr = defineLocale({
  common: {
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    cancel: 'Annuler',
    close: 'Fermer',
    confirm: 'Confirmer',
    delete: 'Supprimer',
    refresh: 'Actualiser',
    retry: 'Réessayer',
    search: 'Rechercher...',
    loading: 'Chargement...',
    create: 'Créer',
    creating: 'Création...',
    set: 'Définir',
    replace: 'Remplacer',
    clear: 'Effacer',
    live: 'En direct',
    off: 'Désactivé',
    enabled: 'activé',
    disabled: 'désactivé',
    active: 'actif',
    inactive: 'inactif',
    unknown: 'inconnu',
    untitled: 'Sans titre',
    none: 'Aucun',
    form: 'Formulaire',
    noResults: 'Aucun résultat',
    of: 'sur',
    page: 'Page',
    msgs: 'msgs',
    tools: 'outils',
    match: 'correspondance',
    other: 'Autre',
    configured: 'configuré',
    removed: 'supprimé',
    failedToToggle: 'Échec du basculement',
    failedToRemove: 'Échec de la suppression',
    failedToReveal: "Échec de l'affichage",
    collapse: 'Réduire',
    expand: 'Développer',
    general: 'Général',
    messaging: 'Messagerie',
    back: 'Retour',
    next: 'Suivant',
    done: 'Terminé',
    copy: 'Copier',
    copied: 'Copié !',
    download: 'Télécharger',
    upload: 'Téléverser',
    edit: 'Modifier',
    view: 'Voir',
    help: 'Aide',
    version: 'Version',
    status: 'État',
    settings: 'Paramètres'
  },

  settings: {
    title: 'Paramètres',
    appearance: 'Apparence',
    language: 'Langue',
    languageDescription: "Choisissez la langue de l'interface de Clara.",
    theme: 'Thème',
    themeDescription: "Personnalisez l'apparence visuelle de Clara.",
    themeDark: 'Sombre',
    themeLight: 'Clair',
    themeSystem: 'Système',
    general: 'Général',
    models: 'Modèles',
    tools: 'Outils',
    skills: 'Compétences',
    gateway: 'Passerelle',
    apiKeys: 'Clés API',
    security: 'Sécurité',
    sessions: 'Sessions',
    shortcuts: 'Raccourcis',
    about: 'À propos',
    advanced: 'Avancé',
    storage: 'Stockage',
    notifications: 'Notifications',
    sound: 'Sons & Audio',
    voice: 'Voix & Synthèse vocale',
    profile: 'Profils d’agents',
    telemetry: 'Télémétrie',
    updates: 'Mises à jour',
    checkForUpdates: 'Vérifier les mises à jour',
    installUpdate: 'Installer la mise à jour',
    restartToApply: 'Redémarrer pour appliquer',
    upToDate: 'Clara est à jour.'
  },

  chat: {
    placeholder: 'Envoyez un message à Clara...',
    thinking: 'Réflexion en cours...',
    generating: 'Génération...',
    stop: 'Arrêter la génération',
    newSession: 'Nouvelle session',
    clearHistory: "Effacer l'historique",
    renameSession: 'Renommer la session',
    deleteSession: 'Supprimer la session',
    pinSession: 'Épingler la session',
    exportSession: 'Exporter la session',
    noMessages: 'Commencez une conversation avec Clara.',
    toolsUsed: 'Outils utilisés',
    modelSelector: 'Sélectionner un modèle',
    reasoningEffort: 'Effort de raisonnement',
    contextWindow: 'Fenêtre de contexte',
    tokenUsage: 'Utilisation des tokens'
  },

  nav: {
    chat: 'Chat',
    sessions: 'Sessions',
    projects: 'Projets',
    tools: 'Outils',
    skills: 'Compétences',
    models: 'Modèles',
    profiles: 'Profils',
    logs: 'Journaux',
    analytics: 'Analyses',
    settings: 'Paramètres',
    docs: 'Documentation',
    portal: 'Portail Web',
    workprise: 'Workprise'
  },

  tools: {
    terminal: {
      pending: 'Exécution de la commande...',
      done: 'Commande exécutée',
      pendingAction: 'Exécution dans le terminal'
    },
    web_search: {
      pending: 'Recherche sur le web...',
      done: 'Recherche terminée',
      pendingAction: 'Recherche web'
    },
    web_extract: {
      pending: "Extraction du contenu de l'URL...",
      done: 'Contenu extrait',
      pendingAction: 'Extraction de page web'
    },
    read_file: {
      pending: 'Lecture du fichier...',
      done: 'Fichier lu',
      pendingAction: 'Lecture de fichier'
    },
    write_file: {
      pending: "Écriture dans le fichier...",
      done: 'Fichier enregistré',
      pendingAction: 'Écriture de fichier'
    },
    edit_file: {
      pending: 'Modification du fichier...',
      done: 'Fichier modifié',
      pendingAction: 'Modification de fichier'
    },
    execute_code: {
      pending: 'Exécution du code...',
      done: 'Code exécuté',
      pendingAction: 'Exécution de script'
    }
  }
})
