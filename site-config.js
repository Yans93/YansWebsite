/*
  YANS — configuration du site
  ------------------------------------------------------------
  Tout ce qui change souvent se modifie ici : prix, contenu des
  formules, coordonnées de contact et mentions légales.
  Aucun autre fichier n'est à toucher pour ça.
*/
window.YANS_CONFIG = {

  /* ---------- Contact ----------
     email         : adresse qui reçoit les demandes (affichée et utilisée pour le bouton « Envoyer par e-mail »)
     instagramUrl  : lien complet vers ton profil, ex. "https://www.instagram.com/ton_compte"
     formEndpoint  : adresse d'un service de réception de formulaires (Formspree, Getform, etc.).
                     Tant qu'elle est vide, le site n'envoie rien tout seul : il prépare la demande
                     et propose de la copier ou de l'envoyer par e-mail. */
  contact: {
    email: "",
    instagramUrl: "",
    formEndpoint: ""
  },

  /* ---------- Mentions légales ----------
     Laisse une chaîne vide pour afficher « À compléter ». */
  legal: {
    editor: "",      // nom ou raison sociale
    status: "",      // ex. "micro-entrepreneur"
    address: "",     // adresse postale
    siret: "",       // numéro SIRET
    publisher: "",   // directeur de la publication
    host: ""         // nom et adresse de l'hébergeur
  },

  /* ---------- Listes du formulaire ---------- */
  specialties: [
    "Coach sportif personnel",
    "Coach de football",
    "Préparateur physique",
    "Coach fitness et musculation",
    "Autre spécialité"
  ],

  /* ---------- Formules ----------
     price     : prix affiché (texte libre)
     inherits  : nom de la formule dont elle reprend le contenu (facultatif)
     badge     : petite étiquette au-dessus de la carte (facultatif)
     featured  : true pour mettre la carte en valeur (facultatif)
     features  : liste des prestations, une ligne par prestation */
  offers: [
    {
      id: "START",
      price: "24,99",
      tagline: "L'essentiel pour être trouvé en ligne.",
      features: [
        "Présentation du coach",
        "Description de son activité et de ses spécialités",
        "Coordonnées et liens vers ses réseaux sociaux",
        "Design responsive"
      ]
    },
    {
      id: "PRO",
      price: "44,99",
      tagline: "Pour présenter clairement tes prestations.",
      inherits: "START",
      features: [
        "Présentation détaillée des prestations",
        "Section dédiée aux services et aux tarifs du coach",
        "Galerie de photos",
        "Design plus personnalisé"
      ]
    },
    {
      id: "PREMIUM",
      price: "99,99",
      tagline: "Pour te démarquer des autres coachs.",
      inherits: "PRO",
      badge: "Recommandée",
      featured: true,
      features: [
        "Design plus approfondi et personnalisé",
        "Présentation avancée du parcours et des spécialités",
        "Sections supplémentaires adaptées à l'activité du coach",
        "Mise en valeur des témoignages et des résultats, lorsque le client dispose de contenus authentiques"
      ]
    },
    {
      id: "ULTIMATE",
      price: "124,99",
      tagline: "Pour une identité entièrement sur mesure.",
      inherits: "PREMIUM",
      badge: "Haut de gamme",
      badgeStyle: "light",
      features: [
        "Design haut de gamme entièrement personnalisé",
        "Structure de site plus complète",
        "Sections personnalisées selon les objectifs du coach",
        "Présentation détaillée de son activité, de ses prestations et de son identité professionnelle",
        "Optimisation approfondie de l'affichage mobile et de l'expérience utilisateur"
      ]
    }
  ],

  /* Phrase affichée sous les formules */
  priceNote: "Prix en euros. Les délais et les modalités sont définis avec toi avant le démarrage du projet."
};
