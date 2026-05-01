// ============================================================================
// TMT — Bibliothèque complète : Jeux + Enchaînements
// Public : Enfants 6-10 ans (Muay Thai)
// ============================================================================

// ============================================================================
// TYPES
// ============================================================================

export type GameMoment = 'jeu1' | 'jeu2' | 'bonus'

export type Game = {
  id: string
  name: string
  moment: GameMoment
  description: string
  objective: string
  isCustom?: boolean
}

export type ComboLevel = 1 | 2 | 3 | 4 | 5 | 6

export type ComboStep = {
  number: number
  title: string
}

export type Combo = {
  id: string
  name: string
  level: ComboLevel
  steps: ComboStep[]
  keyPoints: string[]
  isCustom?: boolean
}

// ============================================================================
// JEUX D'ENTRÉE (Jeu 1 — 5 min)
// Objectif : mise en route, coordination, posture, ambiance, écoute
// ============================================================================

export const GAMES: Game[] = [
  // —————————————————————————————————————————————————————————————
  // 🟢 JEU 1 — Jeux d'entrée
  // —————————————————————————————————————————————————————————————
  {
    id: 'jeu1-001',
    name: 'Le miroir du boxeur',
    moment: 'jeu1',
    description: "Par 2 face à face, à bonne distance. L'un fait des mouvements lents de boxe : garde, direct bras avant, direct bras arrière, esquive, pas avant, pas arrière, pas de côté. L'autre reproduit en miroir. Inversion toutes les 30 sec.",
    objective: 'Coordination, observation, garde, déplacements.',
  },
  {
    id: 'jeu1-002',
    name: 'Le miroir fou',
    moment: 'jeu1',
    description: "Même principe que le miroir du boxeur, mais l'animateur annonce des consignes rapides : « direct bras avant », « esquive », « pas arrière », « garde haute », « pivot ». Les enfants doivent suivre sans se précipiter.",
    objective: 'Réactivité, écoute, coordination, posture.',
  },
  {
    id: 'jeu1-003',
    name: 'Loup touche-touche boxeur',
    moment: 'jeu1',
    description: "Un loup désigné, tous en garde. Le loup touche doucement les autres qui deviennent loups à leur tour. Obligation de rester en garde et de se déplacer en pas chassés, sans courir normalement.",
    objective: 'Déplacements en garde, vitesse, vigilance.',
  },
  {
    id: 'jeu1-004',
    name: 'Loup glacé garde',
    moment: 'jeu1',
    description: "Variante du loup glacé classique. Quand on est touché, on se fige en position de garde. Un coéquipier doit venir taper doucement dans les gants pour délivrer.",
    objective: "Posture de garde, esprit d'équipe, déplacements.",
  },
  {
    id: 'jeu1-005',
    name: 'Loup esquive',
    moment: 'jeu1',
    description: "Un loup doit toucher les épaules des autres. Les enfants peuvent éviter en faisant une petite esquive à gauche ou à droite, tout en gardant les mains hautes.",
    objective: 'Esquives simples, lecture, vigilance, garde.',
  },
  {
    id: 'jeu1-006',
    name: '1-2-3 soleil boxeur',
    moment: 'jeu1',
    description: "Le meneur tourne le dos en disant « 1, 2, 3, soleil ». Les enfants avancent en garde et doivent se figer en garde quand il se retourne. Celui qui bouge ou n'est pas en garde recule.",
    objective: 'Garde immobile, contrôle de soi, posture.',
  },
  {
    id: 'jeu1-007',
    name: '1-2-3 soleil technique',
    moment: 'jeu1',
    description: "Même principe, mais quand le meneur se retourne, les enfants doivent être figés dans une position annoncée : garde haute, direct bras avant, esquive, pas arrière, genoux fléchis.",
    objective: 'Écoute, mémorisation, posture, équilibre.',
  },
  {
    id: 'jeu1-008',
    name: 'Béret boxeur',
    moment: 'jeu1',
    description: "2 équipes face à face, numérotées. Un foulard au milieu. L'animateur appelle un numéro, les 2 enfants concernés doivent récupérer le foulard en se déplaçant uniquement en garde et en pas chassés.",
    objective: "Déplacements, réactivité, esprit d'équipe.",
  },
  {
    id: 'jeu1-009',
    name: 'Béret technique',
    moment: 'jeu1',
    description: "Même principe que le béret boxeur, mais avant de récupérer le foulard, l'enfant doit réaliser une action annoncée : direct bras avant, direct bras avant – direct bras arrière, esquive, garde haute.",
    objective: 'Réactivité, technique, écoute, coordination.',
  },
  {
    id: 'jeu1-010',
    name: 'Jacques a dit version boxe',
    moment: 'jeu1',
    description: "Classique avec consignes de boxe : « Jacques a dit garde haute », « Jacques a dit direct bras avant », « Jacques a dit direct bras arrière », « Jacques a dit esquive », « Jacques a dit pas arrière ». Les enfants ne doivent exécuter que si « Jacques a dit ».",
    objective: 'Mémorisation des coups, écoute, technique.',
  },
  {
    id: 'jeu1-011',
    name: "Le chef d'orchestre",
    moment: 'jeu1',
    description: "Tous en cercle en garde. Un enfant sort. Un chef est désigné, il fait des mouvements de boxe que les autres reproduisent. L'enfant qui revient doit deviner qui est le chef.",
    objective: 'Observation, technique, ambiance.',
  },
  {
    id: 'jeu1-012',
    name: 'Les statues de boxe',
    moment: 'jeu1',
    description: "Les enfants se déplacent en garde. Au signal « statue », ils doivent s'arrêter dans une position demandée : garde, direct bras avant, direct bras arrière, esquive, low kick dans le vide.",
    objective: 'Posture, équilibre, contrôle.',
  },
  {
    id: 'jeu1-013',
    name: 'Feu rouge boxeur',
    moment: 'jeu1',
    description: "L'animateur annonce des couleurs : vert = déplacement en garde, orange = petits pas lents, rouge = arrêt en garde, bleu = direct bras avant – direct bras arrière, noir = esquive.",
    objective: 'Écoute, réaction, déplacement, contrôle.',
  },
  {
    id: 'jeu1-014',
    name: 'Les animaux boxeurs',
    moment: 'jeu1',
    description: "Chaque animal correspond à une action : kangourou = petits sauts en garde, crabe = déplacement latéral, tortue = garde très haute, serpent = esquive, tigre = direct bras avant – direct bras arrière.",
    objective: 'Imagination, motricité, coordination, ambiance.',
  },
  {
    id: 'jeu1-015',
    name: 'La chasse aux couleurs',
    moment: 'jeu1',
    description: "Des plots de couleurs sont placés dans la salle. L'animateur annonce une couleur. Les enfants doivent rejoindre un plot de cette couleur en garde. Avant de toucher le plot, ils font une action : direct bras avant, esquive ou garde haute.",
    objective: 'Déplacements, écoute, vitesse contrôlée.',
  },
  {
    id: 'jeu1-016',
    name: 'Le train des boxeurs',
    moment: 'jeu1',
    description: "Les enfants sont en file indienne. Le premier dirige le train en garde : pas avant, pas arrière, pas de côté, pivot. Les autres suivent sans se coller. Changement de conducteur régulièrement.",
    objective: 'Déplacements collectifs, attention, coordination.',
  },
  {
    id: 'jeu1-017',
    name: 'La garde magique',
    moment: 'jeu1',
    description: "Les enfants se déplacent en garde. Quand l'animateur dit « magie », tout le monde doit remonter immédiatement les mains en garde parfaite.",
    objective: 'Réflexe de garde, vigilance, posture.',
  },
  {
    id: 'jeu1-018',
    name: 'La ronde des directs',
    moment: 'jeu1',
    description: "Les enfants sont en cercle. Chacun fait un direct bras avant dans le vide, l'un après l'autre, comme une vague. Puis on ajoute direct bras avant – direct bras arrière.",
    objective: 'Rythme, coordination, technique simple.',
  },
  {
    id: 'jeu1-019',
    name: 'Les îles de garde',
    moment: 'jeu1',
    description: "Des cerceaux ou plots représentent des îles. Les enfants se déplacent en garde dans la salle. Au signal, ils doivent trouver une île et se mettre en garde parfaite.",
    objective: 'Déplacements, équilibre, garde.',
  },
  {
    id: 'jeu1-020',
    name: 'Le déménageur boxeur',
    moment: 'jeu1',
    description: "Des objets légers sont au centre. Les enfants doivent les ramener dans leur camp en se déplaçant en garde. Ils ne peuvent prendre qu'un objet à la fois.",
    objective: 'Cardio léger, déplacements, organisation.',
  },

  // —————————————————————————————————————————————————————————————
  // 🟡 JEU 2 — Jeux de transition (par 2)
  // —————————————————————————————————————————————————————————————
  {
    id: 'jeu2-001',
    name: 'Touche-genou',
    moment: 'jeu2',
    description: "Par 2, en garde, mains ouvertes. Toucher doucement le genou de l'autre sans se faire toucher. 4 manches de 30 à 45 sec, changement de partenaire.",
    objective: 'Déplacements, esquives, lecture.',
  },
  {
    id: 'jeu2-002',
    name: 'Touche-épaule',
    moment: 'jeu2',
    description: "Par 2, en garde. Toucher doucement les épaules de l'adversaire avec les mains ouvertes.",
    objective: 'Distance, garde haute, réactivité.',
  },
  {
    id: 'jeu2-003',
    name: 'Touche-gant',
    moment: 'jeu2',
    description: "Par 2 face à face. Chacun essaie de toucher doucement le gant avant de l'autre. Les enfants doivent garder une bonne distance et revenir en garde.",
    objective: 'Précision, distance, vigilance.',
  },
  {
    id: 'jeu2-004',
    name: 'Touche-pied',
    moment: 'jeu2',
    description: "Par 2 face à face. Toucher le pied avant de l'adversaire avec son propre pied avant, sans se faire toucher. Les mains restent en garde.",
    objective: 'Travail des appuis, déplacements, distance jambes.',
  },
  {
    id: 'jeu2-005',
    name: 'Touche-ventre contrôlé',
    moment: 'jeu2',
    description: "Par 2, mains ouvertes. Le but est de toucher doucement le ventre ou le plastron imaginaire de l'autre, sans frapper.",
    objective: 'Distance, contrôle, précision.',
  },
  {
    id: 'jeu2-006',
    name: 'Le foulard dans la ceinture',
    moment: 'jeu2',
    description: "Chacun glisse un foulard dans sa ceinture dans le dos. Par 2, il faut attraper le foulard de l'autre sans se faire prendre le sien. Déplacement en garde et en pas chassés.",
    objective: 'Déplacements, esquives, vivacité.',
  },
  {
    id: 'jeu2-007',
    name: 'Stop-attaque',
    moment: 'jeu2',
    description: "Par 2 face à face. L'un attaque doucement avec un coup au choix, l'autre doit esquiver, parer ou reculer. Au signal « stop », on inverse. Aucune frappe en force, c'est du toucher.",
    objective: 'Réflexes, défense, lecture du coup.',
  },
  {
    id: 'jeu2-008',
    name: 'Duel des ombres',
    moment: 'jeu2',
    description: "Par 2, sans contact. L'un attaque dans le vide, l'autre défend dans le vide : esquive, pas arrière, parade imaginaire. Puis inversion.",
    objective: 'Lecture, défense, coordination.',
  },
  {
    id: 'jeu2-009',
    name: 'Le radar',
    moment: 'jeu2',
    description: "Par 2. L'attaquant avance doucement avec des directs très légers ou dans le vide. Le défenseur doit reculer en garde en gardant la bonne distance.",
    objective: 'Gestion de distance, déplacement arrière, calme.',
  },
  {
    id: 'jeu2-010',
    name: 'La bulle de sécurité',
    moment: 'jeu2',
    description: "Chaque enfant imagine une bulle autour de lui. Le partenaire essaie de toucher doucement l'épaule. Le défenseur garde sa bulle avec les déplacements, sans pousser.",
    objective: 'Distance, esquive, placement.',
  },
  {
    id: 'jeu2-011',
    name: 'Le mur invisible',
    moment: 'jeu2',
    description: "Un enfant avance doucement. L'autre doit l'empêcher d'entrer dans sa zone en utilisant uniquement son déplacement, sa garde et un direct bras avant très léger.",
    objective: "Distance, direct d'arrêt, contrôle.",
  },
  {
    id: 'jeu2-012',
    name: '1 contre 1 dans le cercle',
    moment: 'jeu2',
    description: "Tous en cercle. 2 enfants au centre s'affrontent au touche-genou, touche-gant ou touche-épaule pendant 30 sec, puis on tourne.",
    objective: 'Mise en confiance avant les assauts, opposition ludique.',
  },
  {
    id: 'jeu2-013',
    name: 'Roi du cercle',
    moment: 'jeu2',
    description: "Un enfant est au centre. Les autres passent un par un pour un duel de 20 à 30 sec en touche-épaule ou touche-gant. On change régulièrement le roi.",
    objective: 'Adaptation, confiance, opposition contrôlée.',
  },
  {
    id: 'jeu2-014',
    name: "L'attaque autorisée",
    moment: 'jeu2',
    description: "Par 2. Pendant une manche, seul un coup est autorisé : direct bras avant. Le partenaire doit défendre, esquiver ou se déplacer. Puis on change de coup autorisé.",
    objective: 'Travail thématique, sécurité, précision.',
  },
  {
    id: 'jeu2-015',
    name: 'Le trésor protégé',
    moment: 'jeu2',
    description: "Un plot est placé derrière un défenseur. L'attaquant doit toucher le plot sans se faire toucher doucement l'épaule par le défenseur.",
    objective: 'Déplacement, feinte, défense de zone.',
  },
  {
    id: 'jeu2-016',
    name: 'Le duel des lignes',
    moment: 'jeu2',
    description: "Deux enfants sont face à face sur une ligne. Ils doivent toucher l'épaule de l'autre sans sortir de la ligne.",
    objective: 'Équilibre, distance, contrôle.',
  },
  {
    id: 'jeu2-017',
    name: 'Les gants aimantés',
    moment: 'jeu2',
    description: "Par 2, les enfants gardent leurs gants proches, comme s'ils étaient aimantés. Au signal, chacun essaie de toucher doucement l'épaule de l'autre.",
    objective: 'Distance courte, vigilance, coordination.',
  },
  {
    id: 'jeu2-018',
    name: 'Pare-pluie',
    moment: 'jeu2',
    description: "Par 2. L'attaquant envoie des directs très lents vers les gants. Le défenseur pare doucement, comme s'il écartait une goutte de pluie.",
    objective: 'Parade simple, calme, précision.',
  },
  {
    id: 'jeu2-019',
    name: 'La tortue',
    moment: 'jeu2',
    description: "Par 2. L'attaquant touche doucement les gants du défenseur. Le défenseur reste solide en garde haute, menton rentré, sans fermer les yeux.",
    objective: 'Garde, confiance, posture.',
  },
  {
    id: 'jeu2-020',
    name: 'Parade-riposte',
    moment: 'jeu2',
    description: "Par 2. L'attaquant fait un direct bras avant lent. Le défenseur pare puis répond par un direct bras avant léger.",
    objective: 'Défense active, coordination, riposte.',
  },
  {
    id: 'jeu2-021',
    name: 'Esquive et sortie',
    moment: 'jeu2',
    description: "L'attaquant fait un direct lent. Le défenseur esquive puis sort sur le côté avec un petit pas latéral.",
    objective: "Esquive, déplacement, sortie de l'axe.",
  },
  {
    id: 'jeu2-022',
    name: 'Le ressort',
    moment: 'jeu2',
    description: "L'attaquant avance doucement. Le défenseur recule en garde. Au signal, le défenseur répond avec un direct bras avant léger.",
    objective: 'Distance, défense, riposte.',
  },
  {
    id: 'jeu2-023',
    name: 'La queue du dragon',
    moment: 'jeu2',
    description: "2 équipes en file indienne, chacun tient la taille du précédent. Le dernier a un foulard accroché derrière. La tête de chaque file doit attraper la queue de l'autre équipe.",
    objective: 'Déplacements collectifs, dynamique, échauffement final avant assauts.',
  },

  // —————————————————————————————————————————————————————————————
  // 🔵 BONUS — Selon temps disponible
  // —————————————————————————————————————————————————————————————
  {
    id: 'bonus-001',
    name: "L'épervier boxeur",
    moment: 'bonus',
    description: "Un épervier au centre. Les autres traversent d'un côté à l'autre en pas chassés et en garde. Les enfants attrapés deviennent éperviers.",
    objective: "Classique d'école adapté à la boxe, déplacements, esquives.",
  },
  {
    id: 'bonus-002',
    name: 'La rivière aux crocodiles',
    moment: 'bonus',
    description: "Une zone au sol représente la rivière. Des crocodiles en garde doivent toucher ceux qui traversent. Les traversants passent en pas chassés, en garde ou avec petits sauts.",
    objective: 'Déplacements, esquives, ambiance.',
  },
  {
    id: 'bonus-003',
    name: "Le facteur n'est pas passé",
    moment: 'bonus',
    description: "Les enfants sont en cercle. Le facteur tourne autour avec un foulard et le pose discrètement derrière un enfant, qui doit le rattraper avant que le facteur prenne sa place.",
    objective: "Vigilance, vitesse, classique d'école.",
  },
  {
    id: 'bonus-004',
    name: 'Les pirates et les trésors',
    moment: 'bonus',
    description: "Des objets sont au centre. Deux équipes doivent ramener le plus de trésors possible dans leur camp, uniquement en déplacement de boxe.",
    objective: "Cardio, esprit d'équipe, déplacement.",
  },
  {
    id: 'bonus-005',
    name: 'Le château fort',
    moment: 'bonus',
    description: "Une équipe protège des plots, l'autre essaie de les toucher. Les défenseurs ne poussent pas : ils se placent et touchent doucement l'épaule des attaquants.",
    objective: 'Placement, défense de zone, coopération.',
  },
  {
    id: 'bonus-006',
    name: 'Les gardiens du temple',
    moment: 'bonus',
    description: "Des plots sont au centre. Les gardiens les protègent. Les attaquants doivent toucher les plots sans se faire toucher l'épaule.",
    objective: 'Feinte, déplacement, défense.',
  },
  {
    id: 'bonus-007',
    name: 'Le relais des champions',
    moment: 'bonus',
    description: "Deux équipes. Chaque enfant part en garde jusqu'à un plot, réalise une technique ou un enchaînement, puis revient taper dans le gant du suivant.",
    objective: "Technique, cardio, esprit d'équipe.",
  },
  {
    id: 'bonus-008',
    name: 'Le relais esquive',
    moment: 'bonus',
    description: "Les enfants traversent une zone où l'animateur ou des camarades tiennent des frites en mousse. Ils doivent passer en esquivant doucement.",
    objective: 'Esquive, confiance, coordination.',
  },
  {
    id: 'bonus-009',
    name: 'Le parcours du boxeur',
    moment: 'bonus',
    description: "Parcours avec plots : déplacement en garde, direct bras avant – direct bras arrière devant un plot, esquive sous une corde, pas arrière, low kick dans le vide.",
    objective: 'Motricité complète, coordination, technique.',
  },
  {
    id: 'bonus-010',
    name: 'Le tunnel des esquives',
    moment: 'bonus',
    description: "Deux lignes d'enfants forment un tunnel avec des bras ou des frites en mousse. Les autres passent dessous en garde avec une petite flexion des jambes.",
    objective: 'Esquive, jambes fléchies, équilibre.',
  },
  {
    id: 'bonus-011',
    name: 'Le labyrinthe des appuis',
    moment: 'bonus',
    description: "Des plots sont disposés au sol. Les enfants doivent les contourner en garde, sans croiser les pieds.",
    objective: 'Appuis, déplacement, équilibre.',
  },
  {
    id: 'bonus-012',
    name: 'Les missions secrètes',
    moment: 'bonus',
    description: "Chaque équipe reçoit une mission : faire 20 directs propres, réussir 10 esquives, traverser la salle en garde, réaliser 10 enchaînements propres.",
    objective: 'Autonomie, coopération, motivation.',
  },
  {
    id: 'bonus-013',
    name: 'Le ballon boxeur',
    moment: 'bonus',
    description: "Avec un ballon léger. Les enfants se font des passes en garde. Avant d'envoyer le ballon, ils annoncent une technique puis la réalisent dans le vide.",
    objective: 'Coordination, communication, vocabulaire technique.',
  },
  {
    id: 'bonus-014',
    name: 'Les statues à délivrer',
    moment: 'bonus',
    description: "Une équipe doit figer les autres en les touchant. Les joueurs figés restent en garde. Pour les délivrer, un coéquipier doit venir faire avec eux direct bras avant – direct bras arrière.",
    objective: 'Entraide, technique, déplacement.',
  },
  {
    id: 'bonus-015',
    name: 'Le roi de la garde',
    moment: 'bonus',
    description: "Les enfants tiennent une garde parfaite pendant 20 sec. L'animateur corrige doucement : mains hautes, menton rentré, pieds écartés.",
    objective: 'Posture, concentration, retour au calme.',
  },
  {
    id: 'bonus-016',
    name: 'Le champion silencieux',
    moment: 'bonus',
    description: "Les enfants réalisent un enchaînement dans le vide sans faire de bruit avec les pieds.",
    objective: 'Appuis légers, contrôle, équilibre.',
  },
  {
    id: 'bonus-017',
    name: 'La photo du boxeur',
    moment: 'bonus',
    description: "L'animateur dit « photo ». Les enfants prennent leur plus belle garde. Puis : « photo direct », « photo esquive », « photo low kick ».",
    objective: 'Posture, mémorisation, amusement.',
  },
  {
    id: 'bonus-018',
    name: 'Le souffle du boxeur',
    moment: 'bonus',
    description: "Les enfants en cercle. Inspiration par le nez, expiration par la bouche. Puis garde haute, relâchement des épaules.",
    objective: 'Retour au calme, respiration, concentration.',
  },
  {
    id: 'bonus-019',
    name: 'Le salut des champions',
    moment: 'bonus',
    description: "Par 2, les enfants se mettent en garde, font un petit enchaînement dans le vide, puis se saluent avec les gants.",
    objective: 'Respect, discipline, rituel de fin.',
  },
]

// ============================================================================
// COMBOS — 60 enchaînements répartis sur 6 niveaux
// Nomenclature : bras avant / bras arrière / jambe avant / jambe arrière
// ============================================================================

export const COMBOS: Combo[] = [
  // —————————————————————————————————————————————————————————————
  // 🟢 NIVEAU 1 — Bases des poings
  // —————————————————————————————————————————————————————————————
  {
    id: 'combo-001',
    name: 'Direct bras avant – direct bras arrière',
    level: 1,
    steps: [
      { number: 1, title: 'Garde stable' },
      { number: 2, title: 'Direct bras avant seul' },
      { number: 3, title: 'Direct bras arrière seul' },
      { number: 4, title: 'Direct bras avant – direct bras arrière' },
      { number: 5, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Le direct bras avant part vite et revient vite.',
      'Le direct bras arrière part après une légère rotation du corps.',
      'La main qui ne frappe pas reste au visage.',
      'Les pieds restent bien posés au sol.',
      "L'enfant finit en garde, sans baisser les mains.",
    ],
  },
  {
    id: 'combo-002',
    name: 'Direct bras avant – direct bras arrière – direct bras avant',
    level: 1,
    steps: [
      { number: 1, title: 'Direct bras avant' },
      { number: 2, title: 'Direct bras avant – direct bras arrière' },
      { number: 3, title: 'Direct bras avant – direct bras arrière – direct bras avant' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Le dernier direct bras avant sert à reprendre la distance.',
      'Les coups doivent être droits.',
      'Les épaules restent relâchées.',
      'Les mains reviennent au visage après chaque coup.',
      "L'enfant ne doit pas avancer en déséquilibre.",
    ],
  },
  {
    id: 'combo-003',
    name: 'Direct bras avant – direct bras arrière – pas arrière',
    level: 1,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Petit pas arrière' },
      { number: 3, title: 'Garde haute' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      "Après l'attaque, l'enfant ne reste pas devant son partenaire.",
      'Le pas arrière est court et contrôlé.',
      'Les mains restent hautes pendant le déplacement.',
      'Le regard reste sur le partenaire.',
      'Les pieds ne se croisent pas.',
    ],
  },
  {
    id: 'combo-004',
    name: 'Direct bras avant – direct bras arrière – crochet bras avant',
    level: 1,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Crochet bras avant seul' },
      { number: 3, title: 'Direct bras avant – direct bras arrière – crochet bras avant' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Le crochet bras avant doit être court.',
      'Le coude reste à bonne hauteur.',
      'Le corps tourne légèrement avec le crochet.',
      "L'autre main reste en protection.",
      "L'enfant ne doit pas faire un grand mouvement circulaire.",
    ],
  },
  {
    id: 'combo-005',
    name: 'Direct bras avant – crochet bras arrière',
    level: 1,
    steps: [
      { number: 1, title: 'Direct bras avant seul' },
      { number: 2, title: 'Crochet bras arrière seul' },
      { number: 3, title: 'Direct bras avant – crochet bras arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Le direct bras avant sert à ouvrir la distance.',
      'Le crochet bras arrière arrive après une rotation du buste.',
      'Le crochet reste court.',
      'La tête ne part pas en avant.',
      'Les appuis restent solides.',
    ],
  },
  {
    id: 'combo-006',
    name: 'Direct bras avant – direct bras arrière – crochet bras arrière',
    level: 1,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Crochet bras arrière seul' },
      { number: 3, title: 'Direct bras avant – direct bras arrière – crochet bras arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Le crochet bras arrière ne part pas trop large.',
      'La main avant reste haute pendant le crochet.',
      "L'enfant tourne le corps, pas seulement le bras.",
      'Les pieds restent stables.',
      'On termine en garde.',
    ],
  },
  {
    id: 'combo-007',
    name: 'Direct bras avant – crochet bras avant – direct bras arrière',
    level: 1,
    steps: [
      { number: 1, title: 'Direct bras avant' },
      { number: 2, title: 'Direct bras avant – crochet bras avant' },
      { number: 3, title: 'Direct bras avant – crochet bras avant – direct bras arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Le bras avant travaille deux fois, mais revient en garde entre les coups.',
      'Le crochet bras avant est court.',
      "Le direct bras arrière part quand l'équilibre est retrouvé.",
      'Les pieds ne se rapprochent pas trop.',
      'Le regard reste devant.',
    ],
  },
  {
    id: 'combo-008',
    name: 'Direct bras avant – direct bras arrière – garde immobile deux secondes',
    level: 1,
    steps: [
      { number: 1, title: 'Direct bras avant' },
      { number: 2, title: 'Direct bras arrière' },
      { number: 3, title: 'Retour en garde' },
      { number: 4, title: 'Maintien de la garde pendant deux secondes' },
    ],
    keyPoints: [
      "L'enfant apprend à ne pas baisser les mains après l'attaque.",
      'La garde doit être haute et stable.',
      'Les coudes restent proches du corps.',
      'Le menton reste rentré.',
      "L'enfant respire calmement après l'enchaînement.",
    ],
  },
  {
    id: 'combo-009',
    name: 'Direct bras avant – pas de côté – direct bras arrière',
    level: 1,
    steps: [
      { number: 1, title: 'Direct bras avant' },
      { number: 2, title: 'Petit pas de côté' },
      { number: 3, title: 'Direct bras arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Le pas de côté doit être petit et contrôlé.',
      "L'enfant ne croise pas les pieds.",
      'Les mains restent hautes pendant le déplacement.',
      "Le direct bras arrière part après la reprise d'appui.",
      "L'enfant ne se jette pas sur le coup.",
    ],
  },
  {
    id: 'combo-010',
    name: 'Direct bras avant – direct bras arrière – pivot',
    level: 1,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Pivot léger' },
      { number: 3, title: 'Retour en garde' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      "Le pivot sert à sortir de l'axe.",
      'Les mains restent hautes pendant le pivot.',
      "L'enfant tourne sur l'avant du pied.",
      'Le pivot ne doit pas être trop grand.',
      "L'enfant finit équilibré.",
    ],
  },

  // —————————————————————————————————————————————————————————————
  // 🟡 NIVEAU 2 — Poings + low kick
  // —————————————————————————————————————————————————————————————
  {
    id: 'combo-011',
    name: 'Direct bras avant – direct bras arrière – low kick jambe arrière',
    level: 2,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Low kick jambe arrière seul' },
      { number: 3, title: 'Direct bras arrière – low kick jambe arrière' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      'Le low kick jambe arrière part après le direct bras arrière.',
      "L'enfant tourne légèrement la hanche.",
      'La jambe revient rapidement au sol.',
      'Les mains restent hautes pendant le coup de pied.',
      "L'enfant ne tourne pas le dos.",
    ],
  },
  {
    id: 'combo-012',
    name: 'Direct bras avant – direct bras arrière – low kick jambe avant',
    level: 2,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Low kick jambe avant seul' },
      { number: 3, title: 'Direct bras arrière – low kick jambe avant' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      'Le low kick jambe avant est rapide et léger.',
      "L'enfant ne perd pas l'équilibre vers l'arrière.",
      'Les mains restent en garde.',
      'Le pied revient vite au sol.',
      'Le coup est contrôlé, surtout en binôme.',
    ],
  },
  {
    id: 'combo-013',
    name: 'Direct bras avant – crochet bras avant – low kick jambe arrière',
    level: 2,
    steps: [
      { number: 1, title: 'Direct bras avant' },
      { number: 2, title: 'Crochet bras avant' },
      { number: 3, title: 'Low kick jambe arrière' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      'Le crochet bras avant prépare la rotation du corps.',
      'Le low kick jambe arrière part après le crochet.',
      'Les mains ne descendent pas pendant le low kick.',
      'Le regard reste devant.',
      'Le retour en garde est immédiat.',
    ],
  },
  {
    id: 'combo-014',
    name: 'Direct bras avant – direct bras arrière – crochet bras avant – low kick jambe arrière',
    level: 2,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Direct bras avant – direct bras arrière – crochet bras avant' },
      { number: 3, title: 'Crochet bras avant – low kick jambe arrière' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      'Enchaînement très important pour les débutants.',
      'Les deux directs restent propres et droits.',
      'Le crochet bras avant est court.',
      'Le low kick jambe arrière est contrôlé.',
      "Après le low kick, l'enfant revient en garde sans se déséquilibrer.",
    ],
  },
  {
    id: 'combo-015',
    name: 'Direct bras avant – direct bras arrière – crochet bras arrière – low kick jambe avant',
    level: 2,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Crochet bras arrière' },
      { number: 3, title: 'Crochet bras arrière – low kick jambe avant' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      'Le crochet bras arrière reste court et précis.',
      'Le low kick jambe avant part vite après le crochet.',
      "L'enfant ne se penche pas en arrière.",
      'Les mains restent hautes.',
      "L'enchaînement est fluide, sans précipitation.",
    ],
  },
  {
    id: 'combo-016',
    name: 'Direct bras avant – crochet bras arrière – crochet bras avant – low kick jambe arrière',
    level: 2,
    steps: [
      { number: 1, title: 'Direct bras avant – crochet bras arrière' },
      { number: 2, title: 'Crochet bras arrière – crochet bras avant' },
      { number: 3, title: 'Crochet bras avant – low kick jambe arrière' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      'Les crochets restent courts.',
      "L'enfant tourne le corps à gauche puis à droite.",
      'La tête reste protégée par les mains.',
      "Le low kick jambe arrière termine l'enchaînement.",
      "L'enfant finit stable.",
    ],
  },
  {
    id: 'combo-017',
    name: 'Direct bras avant – direct bras arrière – low kick jambe arrière – pas arrière',
    level: 2,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Low kick jambe arrière' },
      { number: 3, title: 'Pas arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      "L'enfant apprend à attaquer puis sortir.",
      'Le pas arrière se fait après avoir reposé la jambe.',
      'Les mains restent en garde pendant toute la sortie.',
      'Le regard reste sur le partenaire.',
      "L'enfant ne recule pas en désordre.",
    ],
  },
  {
    id: 'combo-018',
    name: 'Direct bras avant – low kick jambe avant – direct bras arrière',
    level: 2,
    steps: [
      { number: 1, title: 'Direct bras avant' },
      { number: 2, title: 'Low kick jambe avant' },
      { number: 3, title: 'Direct bras arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Le low kick jambe avant est rapide.',
      'Le direct bras arrière part après que le pied soit reposé.',
      'Le buste reste droit.',
      'Les mains restent hautes.',
      "L'enchaînement ne doit pas être trop rapide au début.",
    ],
  },
  {
    id: 'combo-019',
    name: 'Low kick jambe avant – direct bras avant – direct bras arrière',
    level: 2,
    steps: [
      { number: 1, title: 'Low kick jambe avant seul' },
      { number: 2, title: 'Low kick jambe avant – direct bras avant' },
      { number: 3, title: 'Low kick jambe avant – direct bras avant – direct bras arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Cet enchaînement apprend à commencer avec la jambe.',
      'Le low kick jambe avant est léger et rapide.',
      "Les directs partent après reprise d'équilibre.",
      "L'enfant ne se penche pas.",
      'Les mains restent hautes avant, pendant et après le kick.',
    ],
  },
  {
    id: 'combo-020',
    name: 'Direct bras avant – direct bras arrière – low kick jambe avant – low kick jambe arrière',
    level: 2,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Low kick jambe avant' },
      { number: 3, title: 'Low kick jambe arrière' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      'Les deux coups de pied sont contrôlés.',
      "L'enfant reprend son équilibre entre les deux jambes.",
      'Les mains restent en garde.',
      'Il ne faut pas sauter ou tourner trop vite.',
      'La priorité est la stabilité.',
    ],
  },

  // —————————————————————————————————————————————————————————————
  // 🟠 NIVEAU 3 — Introduction des coups de pied milieu
  // —————————————————————————————————————————————————————————————
  {
    id: 'combo-021',
    name: 'Direct bras avant – direct bras arrière – middle kick jambe arrière',
    level: 3,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Middle kick jambe arrière seul' },
      { number: 3, title: 'Direct bras arrière – middle kick jambe arrière' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      'Le middle kick jambe arrière part après le direct bras arrière.',
      "L'enfant tourne la hanche.",
      'Le coup de pied reste contrôlé.',
      'Les mains restent hautes.',
      'La jambe revient au sol sans déséquilibre.',
    ],
  },
  {
    id: 'combo-022',
    name: 'Direct bras avant – direct bras arrière – crochet bras avant – middle kick jambe arrière',
    level: 3,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Crochet bras avant' },
      { number: 3, title: 'Crochet bras avant – middle kick jambe arrière' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      'Le crochet bras avant prépare la rotation.',
      'Le middle kick jambe arrière part sans précipitation.',
      'Les mains restent hautes pendant le coup de pied.',
      'Le regard reste vers la cible.',
      'Le retour en garde est obligatoire.',
    ],
  },
  {
    id: 'combo-023',
    name: 'Direct bras avant – crochet bras arrière – middle kick jambe arrière',
    level: 3,
    steps: [
      { number: 1, title: 'Direct bras avant' },
      { number: 2, title: 'Crochet bras arrière' },
      { number: 3, title: 'Middle kick jambe arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Le crochet bras arrière reste court.',
      'Le middle kick jambe arrière part après la rotation du corps.',
      "L'enfant ne tourne pas complètement le dos.",
      'Les mains restent en protection.',
      'Il faut finir stable.',
    ],
  },
  {
    id: 'combo-024',
    name: 'Direct bras avant – low kick jambe avant – middle kick jambe arrière',
    level: 3,
    steps: [
      { number: 1, title: 'Direct bras avant' },
      { number: 2, title: 'Low kick jambe avant' },
      { number: 3, title: 'Middle kick jambe arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Le low kick jambe avant est léger et rapide.',
      "L'enfant reprend ses appuis avant le middle kick.",
      'Le middle kick jambe arrière est propre, pas forcé.',
      'Les mains restent hautes.',
      "L'équilibre est plus important que la vitesse.",
    ],
  },
  {
    id: 'combo-025',
    name: 'Direct bras avant – direct bras arrière – low kick jambe avant – middle kick jambe arrière',
    level: 3,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Low kick jambe avant' },
      { number: 3, title: 'Low kick jambe avant – middle kick jambe arrière' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      'Les coups de poing préparent la distance.',
      'Le low kick jambe avant est contrôlé.',
      "Le middle kick jambe arrière termine l'action.",
      "L'enfant ne baisse pas les mains pendant les coups de pied.",
      'Le retour en garde est net.',
    ],
  },
  {
    id: 'combo-026',
    name: 'Direct bras avant – direct bras arrière – pas de côté – middle kick jambe arrière',
    level: 3,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Petit pas de côté' },
      { number: 3, title: 'Middle kick jambe arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Le pas de côté est court.',
      "L'enfant ne croise pas les pieds.",
      "Le middle kick part après la reprise d'appui.",
      'Les mains restent hautes.',
      "L'enfant apprend à frapper après un déplacement.",
    ],
  },
  {
    id: 'combo-027',
    name: 'Direct bras avant – middle kick jambe arrière',
    level: 3,
    steps: [
      { number: 1, title: 'Direct bras avant seul' },
      { number: 2, title: 'Middle kick jambe arrière seul' },
      { number: 3, title: 'Direct bras avant – middle kick jambe arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Enchaînement simple et très adapté aux enfants.',
      'Le direct bras avant sert à mesurer la distance.',
      'Le middle kick jambe arrière est contrôlé.',
      'Les mains restent hautes.',
      "L'enfant repose la jambe correctement.",
    ],
  },
  {
    id: 'combo-028',
    name: 'Direct bras avant – direct bras arrière – middle kick jambe arrière – pas arrière',
    level: 3,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Middle kick jambe arrière' },
      { number: 3, title: 'Pas arrière après avoir reposé la jambe' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      "L'enfant attaque puis sort de la distance.",
      'Le pas arrière ne se fait pas pendant le déséquilibre.',
      'Les mains restent hautes.',
      'Le regard reste sur le partenaire.',
      'Le retour en garde est prioritaire.',
    ],
  },
  {
    id: 'combo-029',
    name: 'Crochet bras avant – direct bras arrière – middle kick jambe arrière',
    level: 3,
    steps: [
      { number: 1, title: 'Crochet bras avant' },
      { number: 2, title: 'Direct bras arrière' },
      { number: 3, title: 'Middle kick jambe arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Le crochet bras avant reste court.',
      "Le direct bras arrière remet l'enfant dans l'axe.",
      'Le middle kick jambe arrière part avec une bonne rotation.',
      "L'enfant ne tombe pas sur le côté.",
      'Les mains restent hautes.',
    ],
  },
  {
    id: 'combo-030',
    name: 'Direct bras avant – crochet bras avant – direct bras arrière – middle kick jambe arrière',
    level: 3,
    steps: [
      { number: 1, title: 'Direct bras avant – crochet bras avant' },
      { number: 2, title: 'Crochet bras avant – direct bras arrière' },
      { number: 3, title: 'Direct bras arrière – middle kick jambe arrière' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      "L'enfant varie les trajectoires : direct, crochet, direct, coup de pied.",
      'Les bras reviennent en garde entre les frappes.',
      'Le middle kick est contrôlé.',
      "L'équilibre doit être conservé.",
      'Ne pas accélérer avant que la technique soit propre.',
    ],
  },

  // —————————————————————————————————————————————————————————————
  // 🔵 NIVEAU 4 — Introduction du genou et de l'uppercut
  // —————————————————————————————————————————————————————————————
  {
    id: 'combo-031',
    name: 'Direct bras avant – direct bras arrière – uppercut bras avant',
    level: 4,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Uppercut bras avant seul' },
      { number: 3, title: 'Direct bras arrière – uppercut bras avant' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      "L'uppercut bras avant est court.",
      "L'enfant ne descend pas trop bas.",
      'Le coude reste proche du corps.',
      "L'autre main reste au visage.",
      "L'enfant finit en garde.",
    ],
  },
  {
    id: 'combo-032',
    name: 'Direct bras avant – direct bras arrière – uppercut bras avant – crochet bras arrière',
    level: 4,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Uppercut bras avant' },
      { number: 3, title: 'Uppercut bras avant – crochet bras arrière' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      "L'uppercut bras avant prépare le crochet bras arrière.",
      'Les deux coups restent courts.',
      "L'enfant ne fait pas de grand mouvement avec le bras.",
      'Les pieds restent stables.',
      'La garde revient immédiatement.',
    ],
  },
  {
    id: 'combo-033',
    name: 'Direct bras avant – crochet bras arrière – uppercut bras avant',
    level: 4,
    steps: [
      { number: 1, title: 'Direct bras avant' },
      { number: 2, title: 'Crochet bras arrière' },
      { number: 3, title: 'Uppercut bras avant' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Le crochet bras arrière tourne le corps.',
      "L'uppercut bras avant reste compact.",
      "L'enfant ne lève pas le menton.",
      'La main qui ne frappe pas reste haute.',
      "L'équilibre est conservé.",
    ],
  },
  {
    id: 'combo-034',
    name: 'Direct bras avant – direct bras arrière – crochet bras avant – genou jambe arrière',
    level: 4,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Crochet bras avant' },
      { number: 3, title: 'Genou jambe arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Le genou jambe arrière est contrôlé.',
      "L'enfant ne saute pas vers l'avant.",
      'Les mains restent hautes ou en contrôle léger si travail sur pao.',
      'Le genou revient vite au sol.',
      "L'enfant termine équilibré.",
    ],
  },
  {
    id: 'combo-035',
    name: 'Direct bras avant – genou jambe arrière',
    level: 4,
    steps: [
      { number: 1, title: 'Direct bras avant' },
      { number: 2, title: 'Petit ajustement de distance' },
      { number: 3, title: 'Genou jambe arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Le direct bras avant prépare la distance.',
      'Le genou jambe arrière monte droit.',
      "L'enfant ne tombe pas vers l'avant.",
      'Les mains restent hautes.',
      'Le pied revient vite au sol.',
    ],
  },
  {
    id: 'combo-036',
    name: 'Direct bras avant – direct bras arrière – genou jambe arrière',
    level: 4,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Genou jambe arrière seul' },
      { number: 3, title: 'Direct bras arrière – genou jambe arrière' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      "L'enfant pose bien ses appuis avant le genou.",
      'Le genou est contrôlé, jamais lancé fort.',
      'Le corps reste droit.',
      'Les mains restent en garde.',
      'Le retour au sol est stable.',
    ],
  },
  {
    id: 'combo-037',
    name: 'Crochet bras avant – genou jambe arrière',
    level: 4,
    steps: [
      { number: 1, title: 'Crochet bras avant' },
      { number: 2, title: 'Genou jambe arrière' },
      { number: 3, title: 'Retour en garde' },
      { number: 4, title: 'Répétition lente' },
    ],
    keyPoints: [
      'Le crochet bras avant prépare la rotation.',
      "Le genou jambe arrière part après reprise d'équilibre.",
      "L'enfant ne se jette pas.",
      'Les mains restent hautes.',
      'Le contrôle est obligatoire.',
    ],
  },
  {
    id: 'combo-038',
    name: 'Direct bras avant – uppercut bras arrière – crochet bras avant',
    level: 4,
    steps: [
      { number: 1, title: 'Direct bras avant' },
      { number: 2, title: 'Uppercut bras arrière' },
      { number: 3, title: 'Crochet bras avant' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      "L'uppercut bras arrière est court.",
      'Le crochet bras avant suit naturellement la rotation.',
      'Les mains ne descendent pas.',
      'Les genoux restent légèrement fléchis.',
      "L'enchaînement reste fluide.",
    ],
  },
  {
    id: 'combo-039',
    name: 'Direct bras avant – direct bras arrière – uppercut bras avant – low kick jambe arrière',
    level: 4,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Uppercut bras avant' },
      { number: 3, title: 'Uppercut bras avant – low kick jambe arrière' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      "L'uppercut bras avant reste compact.",
      'Le low kick jambe arrière part après la rotation.',
      'Les mains restent hautes pendant le coup de pied.',
      'Le pied revient vite au sol.',
      'La fin est stable.',
    ],
  },
  {
    id: 'combo-040',
    name: 'Direct bras avant – crochet bras arrière – uppercut bras avant – middle kick jambe arrière',
    level: 4,
    steps: [
      { number: 1, title: 'Direct bras avant – crochet bras arrière' },
      { number: 2, title: 'Crochet bras arrière – uppercut bras avant' },
      { number: 3, title: 'Uppercut bras avant – middle kick jambe arrière' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      'Cet enchaînement est plus avancé.',
      'Le rythme reste lent au début.',
      'Les coups de bras sont courts et propres.',
      'Le middle kick jambe arrière est contrôlé.',
      "L'enfant revient en garde après le coup de pied.",
    ],
  },

  // —————————————————————————————————————————————————————————————
  // 🔴 NIVEAU 5 — Enchaînements avec défense
  // —————————————————————————————————————————————————————————————
  {
    id: 'combo-041',
    name: 'Parade direct – direct bras avant – direct bras arrière',
    level: 5,
    steps: [
      { number: 1, title: 'Parade direct lente' },
      { number: 2, title: 'Direct bras avant' },
      { number: 3, title: 'Direct bras avant – direct bras arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'La parade est petite, pas exagérée.',
      "L'enfant ne doit pas ouvrir toute sa garde.",
      'La riposte part juste après la parade.',
      'Les coups restent contrôlés.',
      'Le retour en garde est obligatoire.',
    ],
  },
  {
    id: 'combo-042',
    name: 'Parade direct – direct bras avant – direct bras arrière – low kick jambe arrière',
    level: 5,
    steps: [
      { number: 1, title: 'Parade direct' },
      { number: 2, title: 'Direct bras avant – direct bras arrière' },
      { number: 3, title: 'Low kick jambe arrière' },
      { number: 4, title: 'Enchaînement complet' },
    ],
    keyPoints: [
      "L'enfant défend avant d'attaquer.",
      'La parade reste courte.',
      'Les directs sont propres.',
      "Le low kick jambe arrière termine l'action.",
      "L'enfant finit en garde et équilibré.",
    ],
  },
  {
    id: 'combo-043',
    name: 'Esquive à droite – direct bras avant – direct bras arrière',
    level: 5,
    steps: [
      { number: 1, title: 'Esquive à droite' },
      { number: 2, title: 'Retour en position stable' },
      { number: 3, title: 'Direct bras avant – direct bras arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      "L'esquive est petite, pas trop basse.",
      'Les yeux restent sur le partenaire.',
      "Les mains restent hautes pendant l'esquive.",
      "Les directs partent après reprise d'équilibre.",
      "L'enfant ne se penche pas en avant.",
    ],
  },
  {
    id: 'combo-044',
    name: 'Esquive à gauche – crochet bras arrière – crochet bras avant',
    level: 5,
    steps: [
      { number: 1, title: 'Esquive à gauche' },
      { number: 2, title: 'Crochet bras arrière' },
      { number: 3, title: 'Crochet bras avant' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      "L'esquive est contrôlée.",
      'Les crochets restent courts.',
      "L'enfant ne tourne pas le dos.",
      'Les mains reviennent au visage après chaque coup.',
      "L'équilibre est prioritaire.",
    ],
  },
  {
    id: 'combo-045',
    name: 'Pas arrière – direct bras avant – direct bras arrière',
    level: 5,
    steps: [
      { number: 1, title: 'Pas arrière' },
      { number: 2, title: "Reprise d'appui" },
      { number: 3, title: 'Direct bras avant – direct bras arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      "Le pas arrière sert à éviter l'attaque.",
      "L'enfant ne recule pas trop loin.",
      'Les mains restent hautes pendant le déplacement.',
      "La riposte part après reprise d'équilibre.",
      'Les pieds ne se croisent pas.',
    ],
  },
  {
    id: 'combo-046',
    name: 'Pas arrière – direct bras arrière – low kick jambe arrière',
    level: 5,
    steps: [
      { number: 1, title: 'Pas arrière' },
      { number: 2, title: 'Direct bras arrière' },
      { number: 3, title: 'Low kick jambe arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Le direct bras arrière part après le pas arrière.',
      "L'enfant se replace avant de frapper.",
      'Le low kick jambe arrière reste contrôlé.',
      'Les mains restent hautes.',
      'La fin est stable.',
    ],
  },
  {
    id: 'combo-047',
    name: 'Check low kick – direct bras arrière – crochet bras avant',
    level: 5,
    steps: [
      { number: 1, title: 'Check low kick simplifié' },
      { number: 2, title: 'Reposer la jambe' },
      { number: 3, title: 'Direct bras arrière' },
      { number: 4, title: 'Crochet bras avant' },
    ],
    keyPoints: [
      'Le check est simple et équilibré.',
      "L'enfant repose le pied avant de riposter.",
      'Le direct bras arrière part droit.',
      'Le crochet bras avant reste court.',
      'Les mains restent hautes.',
    ],
  },
  {
    id: 'combo-048',
    name: 'Check low kick – direct bras arrière – crochet bras avant – low kick jambe arrière',
    level: 5,
    steps: [
      { number: 1, title: 'Check low kick' },
      { number: 2, title: 'Direct bras arrière' },
      { number: 3, title: 'Crochet bras avant' },
      { number: 4, title: 'Low kick jambe arrière' },
    ],
    keyPoints: [
      'Cet enchaînement est avancé pour des enfants débutants.',
      "Le check doit être maîtrisé avant d'ajouter la riposte.",
      'Le low kick jambe arrière reste léger.',
      "L'enfant garde la garde haute.",
      'Il faut travailler lentement au début.',
    ],
  },
  {
    id: 'combo-049',
    name: 'Esquive rotative – crochet bras avant – direct bras arrière',
    level: 5,
    steps: [
      { number: 1, title: 'Esquive rotative lente' },
      { number: 2, title: 'Crochet bras avant' },
      { number: 3, title: 'Direct bras arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      "L'esquive rotative reste petite.",
      "L'enfant ne descend pas trop bas.",
      "Le crochet bras avant part après l'esquive.",
      "Le direct bras arrière termine l'action.",
      "L'enfant finit stable.",
    ],
  },
  {
    id: 'combo-050',
    name: 'Parade direct – direct bras avant – direct bras arrière – middle kick jambe arrière',
    level: 5,
    steps: [
      { number: 1, title: 'Parade direct' },
      { number: 2, title: 'Direct bras avant' },
      { number: 3, title: 'Direct bras arrière' },
      { number: 4, title: 'Middle kick jambe arrière' },
    ],
    keyPoints: [
      'La parade est courte et propre.',
      'Les directs préparent le middle kick.',
      'Le middle kick jambe arrière est contrôlé.',
      'Les mains restent hautes.',
      "L'enfant revient en garde immédiatement.",
    ],
  },

  // —————————————————————————————————————————————————————————————
  // 🟣 NIVEAU 6 — Enchaînements complets avancés
  // —————————————————————————————————————————————————————————————
  {
    id: 'combo-051',
    name: 'Direct bras avant – direct bras arrière – crochet bras avant – low kick jambe arrière – pas arrière',
    level: 6,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Crochet bras avant' },
      { number: 3, title: 'Low kick jambe arrière' },
      { number: 4, title: 'Pas arrière' },
    ],
    keyPoints: [
      "C'est un excellent enchaînement complet.",
      "Les poings doivent être propres avant d'ajouter le low kick.",
      "Le pas arrière permet de sortir après l'attaque.",
      "Les mains restent hautes jusqu'à la fin.",
      "L'enfant finit équilibré.",
    ],
  },
  {
    id: 'combo-052',
    name: 'Direct bras avant – crochet bras arrière – crochet bras avant – middle kick jambe arrière',
    level: 6,
    steps: [
      { number: 1, title: 'Direct bras avant' },
      { number: 2, title: 'Crochet bras arrière' },
      { number: 3, title: 'Crochet bras avant' },
      { number: 4, title: 'Middle kick jambe arrière' },
    ],
    keyPoints: [
      'Les crochets restent courts.',
      "L'enfant utilise la rotation du corps.",
      'Le middle kick jambe arrière arrive après les bras.',
      'Les mains restent hautes.',
      'Le rythme est progressif.',
    ],
  },
  {
    id: 'combo-053',
    name: 'Direct bras avant – direct bras arrière – low kick jambe avant – direct bras arrière',
    level: 6,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Low kick jambe avant' },
      { number: 3, title: 'Direct bras arrière' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      'Le low kick jambe avant est rapide.',
      "Le direct bras arrière repart après reprise d'équilibre.",
      "L'enfant ne se penche pas.",
      'Les mains restent hautes.',
      "L'enchaînement travaille le changement de rythme.",
    ],
  },
  {
    id: 'combo-054',
    name: 'Direct bras avant – pas de côté – direct bras arrière – low kick jambe arrière',
    level: 6,
    steps: [
      { number: 1, title: 'Direct bras avant' },
      { number: 2, title: 'Pas de côté' },
      { number: 3, title: 'Direct bras arrière' },
      { number: 4, title: 'Low kick jambe arrière' },
    ],
    keyPoints: [
      'Le pas de côté est court et propre.',
      'Les pieds ne se croisent pas.',
      'Le direct bras arrière part après le déplacement.',
      "Le low kick jambe arrière termine l'action.",
      "L'enfant garde la garde pendant tout l'enchaînement.",
    ],
  },
  {
    id: 'combo-055',
    name: 'Direct bras avant – direct bras arrière – pivot – crochet bras avant',
    level: 6,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Pivot' },
      { number: 3, title: 'Crochet bras avant' },
      { number: 4, title: 'Retour en garde' },
    ],
    keyPoints: [
      "Le pivot permet de sortir de l'axe.",
      "L'enfant ne pivote pas trop loin.",
      'Le crochet bras avant part après le pivot.',
      'Les mains restent hautes.',
      "L'enfant finit face à son partenaire.",
    ],
  },
  {
    id: 'combo-056',
    name: 'Direct bras avant – crochet bras avant – low kick jambe arrière – direct bras arrière',
    level: 6,
    steps: [
      { number: 1, title: 'Direct bras avant' },
      { number: 2, title: 'Crochet bras avant' },
      { number: 3, title: 'Low kick jambe arrière' },
      { number: 4, title: 'Direct bras arrière' },
    ],
    keyPoints: [
      'Enchaînement à travailler lentement.',
      'Le low kick est reposé avant le direct bras arrière.',
      "L'enfant garde l'équilibre entre jambe et bras.",
      'Les mains restent hautes.',
      'Le dernier direct est propre et contrôlé.',
    ],
  },
  {
    id: 'combo-057',
    name: 'Direct bras avant – direct bras arrière – middle kick jambe arrière – direct bras avant',
    level: 6,
    steps: [
      { number: 1, title: 'Direct bras avant – direct bras arrière' },
      { number: 2, title: 'Middle kick jambe arrière' },
      { number: 3, title: 'Reposer la jambe' },
      { number: 4, title: 'Direct bras avant' },
    ],
    keyPoints: [
      "L'enfant apprend à continuer après un coup de pied.",
      'La jambe revient au sol avant le dernier direct.',
      'Le dernier direct bras avant remet la distance.',
      'Les mains restent hautes.',
      "L'équilibre est prioritaire.",
    ],
  },
  {
    id: 'combo-058',
    name: 'Direct bras avant – uppercut bras avant – crochet bras arrière – low kick jambe arrière',
    level: 6,
    steps: [
      { number: 1, title: 'Direct bras avant' },
      { number: 2, title: 'Uppercut bras avant' },
      { number: 3, title: 'Crochet bras arrière' },
      { number: 4, title: 'Low kick jambe arrière' },
    ],
    keyPoints: [
      "L'uppercut bras avant est court.",
      'Le crochet bras arrière reste compact.',
      "Le low kick jambe arrière termine l'action.",
      "L'enfant ne se précipite pas.",
      'Les mains reviennent en garde après chaque coup.',
    ],
  },
  {
    id: 'combo-059',
    name: 'Parade direct – direct bras avant – crochet bras arrière – low kick jambe arrière',
    level: 6,
    steps: [
      { number: 1, title: 'Parade direct' },
      { number: 2, title: 'Direct bras avant' },
      { number: 3, title: 'Crochet bras arrière' },
      { number: 4, title: 'Low kick jambe arrière' },
    ],
    keyPoints: [
      'La parade est simple et courte.',
      'Le direct bras avant part immédiatement après la défense.',
      'Le crochet bras arrière prépare la rotation.',
      'Le low kick jambe arrière reste contrôlé.',
      "L'enfant finit en garde.",
    ],
  },
  {
    id: 'combo-060',
    name: 'Esquive – direct bras arrière – crochet bras avant – middle kick jambe arrière',
    level: 6,
    steps: [
      { number: 1, title: 'Esquive simple' },
      { number: 2, title: 'Direct bras arrière' },
      { number: 3, title: 'Crochet bras avant' },
      { number: 4, title: 'Middle kick jambe arrière' },
    ],
    keyPoints: [
      "L'esquive est petite et équilibrée.",
      "Le direct bras arrière part après la reprise d'appui.",
      'Le crochet bras avant reste court.',
      'Le middle kick jambe arrière est contrôlé.',
      "L'enfant revient en garde après le coup de pied.",
    ],
  },
]

// ============================================================================
// HELPERS
// ============================================================================

export const COMBO_LEVEL_LABELS: Record<ComboLevel, string> = {
  1: 'N1 · Bases poings',
  2: 'N2 · Poings + low kick',
  3: 'N3 · Coups de pied milieu',
  4: 'N4 · Genou + uppercut',
  5: 'N5 · Avec défense',
  6: 'N6 · Avancé',
}

export const GAME_MOMENT_LABELS: Record<GameMoment, string> = {
  jeu1: "Jeu 1 · Entrée (5 min)",
  jeu2: 'Jeu 2 · Transition (5 min)',
  bonus: 'Bonus · Selon temps',
}

export function getCombosByLevel(level: ComboLevel): Combo[] {
  return COMBOS.filter((c) => c.level === level)
}

export function getGamesByMoment(moment: GameMoment): Game[] {
  return GAMES.filter((g) => g.moment === moment)
}

export function getComboById(id: string): Combo | undefined {
  return COMBOS.find((c) => c.id === id)
}

export function getGameById(id: string): Game | undefined {
  return GAMES.find((g) => g.id === id)
}

// ============================================================================
// STRUCTURE DE SÉANCE
// ============================================================================

export type Phase = {
  key: string
  name: string
  rounds: number
  workDur: number
  restDur: number
  kind: 'simple' | 'game' | 'combo' | 'tech'
  short: string
  dur: number
  timerState: 'active' | 'rest'
  timerLabel: string
}

export const PHASES: Phase[] = [
  {
    key: 'warmup',
    name: 'Échauffement',
    rounds: 1,
    workDur: 480,
    restDur: 0,
    kind: 'simple',
    short: '8:00',
    dur: 480,
    timerState: 'active',
    timerLabel: 'ÉCHAUFFEMENT',
  },
  {
    key: 'decomp1',
    name: 'Décomposition 1',
    rounds: 4,
    workDur: 120,
    restDur: 0,
    kind: 'combo',
    short: '4×2:00',
    dur: 480,
    timerState: 'active',
    timerLabel: 'TRAVAIL',
  },
  {
    key: 'game',
    name: 'Petit jeu',
    rounds: 1,
    workDur: 360,
    restDur: 0,
    kind: 'game',
    short: '6:00',
    dur: 360,
    timerState: 'active',
    timerLabel: 'JEU',
  },
  {
    key: 'decomp2',
    name: 'Décomposition 2',
    rounds: 4,
    workDur: 120,
    restDur: 0,
    kind: 'combo',
    short: '4×2:00',
    dur: 480,
    timerState: 'active',
    timerLabel: 'TRAVAIL',
  },
  {
    key: 'enchainement',
    name: 'Enchaînement complet',
    rounds: 4,
    workDur: 150,
    restDur: 0,
    kind: 'combo',
    short: '4×2:30',
    dur: 600,
    timerState: 'active',
    timerLabel: 'ENCHAÎNEMENT',
  },
  {
    key: 'assauts',
    name: 'Petits assauts',
    rounds: 4,
    workDur: 60,
    restDur: 30,
    kind: 'tech',
    short: '4×1:00/0:30',
    dur: 360,
    timerState: 'active',
    timerLabel: 'ASSAUT',
  },
  {
    key: 'cooldown',
    name: 'Retour au calme',
    rounds: 1,
    workDur: 240,
    restDur: 0,
    kind: 'simple',
    short: '4:00',
    timerState: 'rest',
    timerLabel: 'RETOUR AU CALME',
    dur: 240,
  },
]

// ============================================================================
// LEGACY — Types pour compatibilité (sessions, LevelChip, historique)
// ============================================================================

export type Level = 1 | 2 | 3 | 4 | 5

export const LEVEL_STYLES: Record<1|2|3|4|5|6, { bg: string; text: string; ring: string }> = {
  1: { bg: 'oklch(0.55 0.15 145 / 0.18)', text: 'oklch(0.85 0.18 145)', ring: 'oklch(0.55 0.15 145 / 0.40)' },
  2: { bg: 'oklch(0.65 0.18 225 / 0.18)', text: 'oklch(0.85 0.18 225)', ring: 'oklch(0.65 0.18 225 / 0.40)' },
  3: { bg: 'oklch(0.75 0.20 80 / 0.18)',  text: 'oklch(0.88 0.22 95)',  ring: 'oklch(0.75 0.20 80 / 0.40)'  },
  4: { bg: 'oklch(0.65 0.22 35 / 0.18)',  text: 'oklch(0.78 0.20 35)',  ring: 'oklch(0.65 0.22 35 / 0.40)'  },
  5: { bg: 'oklch(0.58 0.26 15 / 0.18)',  text: 'oklch(0.75 0.24 15)',  ring: 'oklch(0.58 0.26 15 / 0.40)'  },
  6: { bg: 'oklch(0.45 0.22 295 / 0.18)', text: 'oklch(0.78 0.20 295)', ring: 'oklch(0.45 0.22 295 / 0.40)' },
}

export type Session = {
  id: number
  isoDate: string
  date: string
  when: string
  combo: string
  lvl: Level
  dur: string
  durMin: number
  kids: number
  rounds: number
  note: string
}

export const HISTORY: Session[] = []
