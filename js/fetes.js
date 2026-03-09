/**
 * Données des fêtes et saints du calendrier français
 * Saints par jour pour chaque mois (index 0 = 1er du mois)
 */
const SAINTS = {
  1: [
    "Jour de l'An","Basile","Geneviève","Odilon","Édouard",
    "Melchior","Raymond","Lucien","Alix","Guillaume",
    "Paulin","Tatiana","Yvette","Nina","Rémi",
    "Marcel","Roseline","Prisca","Marius","Sébastien",
    "Agnès","Vincent","Barnard","Fr. de Sales","Conv. S. Paul",
    "Paule","Angèle","Thomas d'A.","Gildas","Martine",
    "Marcelle"
  ],
  2: [
    "Ella","Présentation","Blaise","Véronique","Agathe",
    "Gaston","Eugénie","Jacqueline","Apolline","Arnaud",
    "N-D. Lourdes","Félix","Béatrice","Valentin","Claude",
    "Julienne","Alexis","Bernadette","Gabin","Aimée",
    "P. Damien","Isabelle","Lazare","Modeste","Roméo",
    "Nestor","Honorine","Romain","Auguste"
  ],
  3: [
    "Aubin","Charles le B.","Guénolé","Casimir","Olive",
    "Colette","Félicité","Jean de Dieu","Françoise","Vivien",
    "Rosine","Justine","Rodrigue","Mathilde","Louise",
    "Bénédicte","Patrick","Cyrille","Joseph","Printemps",
    "Clémence","Léa","Victorien","Cath. de Suède","Humbert",
    "Larissa","Habib","Gontran","Gwladys","Amédée",
    "Benjamin"
  ],
  4: [
    "Hugues","Sandrine","Richard","Isidore","Irène",
    "Marcellin","J-B. de la S.","Julie","Gautier","Fulbert",
    "Stanislas","Jules","Ida","Maxime","Paterne",
    "Benoît-Joseph","Anicet","Parfait","Emma","Odette",
    "Anselme","Alexandre","Georges","Fidèle","Marc",
    "Alida","Zita","Valérie","Cath. de Sienne","Robert"
  ],
  5: [
    "Fête du Travail","Boris","Phil., Jacques","Sylvain","Judith",
    "Prudence","Gisèle","Victoire 1945","Pacôme","Solange",
    "Estelle","Achille","Rolande","Matthias","Denise",
    "Honoré","Pascal","Éric","Yves","Bernardin",
    "Constantin","Émile","Didier","Donatien","Sophie",
    "Bérengère","Augustin","Germain","Aymar","Ferdinand",
    "Visitation"
  ],
  6: [
    "Justin","Blandine","Kévin","Clotilde","Igor",
    "Norbert","Gilbert","Médard","Diane","Landry",
    "Barnabé","Guy","Antoine de P.","Élisée","Germaine",
    "J-F. Régis","Hervé","Léonce","Romuald","Silvère",
    "Été","Alban","Audrey","Jean-Baptiste","Prosper",
    "Anthelme","Fernand","Irénée","Pierre, Paul","Martial"
  ],
  7: [
    "Thierry","Martinien","Thomas","Florent","Antoine",
    "Mariette","Raoul","Thibaut","Amandine","Ulrich",
    "Benoît","Olivier","Henri, Joël","Fête Nationale","Donald",
    "N-D. Mt Carmel","Charlotte","Frédéric","Arsène","Marina",
    "Victor","Marie-Madeleine","Brigitte","Christine","Jacques",
    "Anne, Joachim","Nathalie","Samson","Marthe","Juliette",
    "Ignace de L."
  ],
  8: [
    "Alphonse","Julien Eymard","Lydie","J-M. Vianney","Abel",
    "Transfiguration","Gaëtan","Dominique","Amour","Laurent",
    "Claire","Clarisse","Hippolyte","Evrard","Assomption",
    "Armel","Hyacinthe","Hélène","Jean Eudes","Bernard",
    "Christophe","Fabrice","Rose de Lima","Barthélemy","Louis",
    "Natacha","Monique","Augustin","Sabine","Fiacre",
    "Aristide"
  ],
  9: [
    "Gilles","Ingrid","Grégoire","Rosalie","Raïssa",
    "Bertrand","Reine","Nativité","Alain","Inès",
    "Adelphe","Apollinaire","Aimé","La Ste Croix","Roland",
    "Edith","Renaud","Nadège","Émilie","Davy",
    "Matthieu","Maurice","Automne","Thècle","Hermann",
    "Côme, Damien","Vinc. de Paul","Venceslas","Michel","Jérôme"
  ],
  10: [
    "Thérèse de l'E-J","Léger","Gérard","Fr. d'Assise","Fleur",
    "Bruno","Serge","Pélagie","Denis","Ghislain",
    "Firmin","Wilfrid","Géraud","Juste","Thérèse d'A.",
    "Edwige","Baudouin","Luc","René","Adeline",
    "Céline","Élodie","Jean de C.","Florentin","Crépin",
    "Dimitri","Émeline","Simon, Jude","Narcisse","Bienvenu",
    "Quentin"
  ],
  11: [
    "Toussaint","Défunts","Hubert","Charles","Sylvie",
    "Bertille","Carine","Geoffroy","Théodore","Léon",
    "Armistice 1918","Christian","Brice","Sidoine","Albert",
    "Marguerite","Élisabeth","Aude","Tanguy","Edmond",
    "Prés. de Marie","Cécile","Clément","Flora","Catherine",
    "Delphine","Séverin","Jacq. de la M.","Saturnin","André"
  ],
  12: [
    "Florence","Viviane","François-Xavier","Barbara","Gérald",
    "Nicolas","Ambroise","Imm. Conception","Pierre Fourier","Romaric",
    "Daniel","Jeanne de C.","Lucie","Odile","Ninon",
    "Alice","Gaël","Gatien","Urbain","Abraham",
    "Hiver","Françoise-X.","Armand","Adèle","Noël",
    "Étienne","Jean","Innocents","David","Roger",
    "Sylvestre"
  ]
};

/**
 * Jours fériés fixes en France (mois: [jours])
 */
const JOURS_FERIES_FIXES = {
  1: [1],   // Jour de l'an
  5: [1, 8], // Fête du travail, Victoire 1945
  7: [14],  // Fête nationale
  8: [15],  // Assomption
  11: [1, 11], // Toussaint, Armistice
  12: [25]  // Noël
};

/**
 * Calcule la date de Pâques pour une année donnée (algorithme de Meeus)
 */
function calculerPaques(annee) {
  const a = annee % 19;
  const b = Math.floor(annee / 100);
  const c = annee % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mois = Math.floor((h + l - 7 * m + 114) / 31);
  const jour = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(annee, mois - 1, jour);
}

/**
 * Retourne les jours fériés mobiles (basés sur Pâques) pour une année
 */
function getJoursFeriesMobiles(annee) {
  const paques = calculerPaques(annee);
  const paquesTime = paques.getTime();
  const jour = 24 * 60 * 60 * 1000;
  return [
    new Date(paquesTime),                    // Pâques
    new Date(paquesTime + 1 * jour),         // Lundi de Pâques
    new Date(paquesTime + 39 * jour),        // Ascension
    new Date(paquesTime + 49 * jour),        // Pentecôte
    new Date(paquesTime + 50 * jour)         // Lundi de Pentecôte
  ];
}

/**
 * Vérifie si une date est un jour férié
 */
function estJourFerie(date) {
  const mois = date.getMonth() + 1;
  const jour = date.getDate();
  
  // Jours fériés fixes
  if (JOURS_FERIES_FIXES[mois] && JOURS_FERIES_FIXES[mois].includes(jour)) {
    return true;
  }
  
  // Jours fériés mobiles
  const mobiles = getJoursFeriesMobiles(date.getFullYear());
  for (const mobile of mobiles) {
    if (mobile.getDate() === jour && mobile.getMonth() === date.getMonth()) {
      return true;
    }
  }
  
  return false;
}

/**
 * Retourne le nom du jour férié si applicable
 */
function getNomJourFerie(date) {
  const mois = date.getMonth() + 1;
  const jour = date.getDate();
  const annee = date.getFullYear();
  
  // Fixes
  const fixes = {
    '1-1': "Jour de l'An",
    '5-1': 'Fête du Travail',
    '5-8': 'Victoire 1945',
    '7-14': 'Fête Nationale',
    '8-15': 'Assomption',
    '11-1': 'Toussaint',
    '11-11': 'Armistice 1918',
    '12-25': 'Noël'
  };
  
  const cle = mois + '-' + jour;
  if (fixes[cle]) return fixes[cle];
  
  // Mobiles
  const paques = calculerPaques(annee);
  const paquesTime = paques.getTime();
  const jourMs = 24 * 60 * 60 * 1000;
  const dateTime = new Date(annee, date.getMonth(), jour).getTime();
  
  const mobiles = [
    { offset: 0, nom: 'Pâques' },
    { offset: 1, nom: 'Lundi de Pâques' },
    { offset: 39, nom: 'Ascension' },
    { offset: 49, nom: 'Pentecôte' },
    { offset: 50, nom: 'Lundi de Pentecôte' }
  ];
  
  for (const m of mobiles) {
    const d = new Date(paquesTime + m.offset * jourMs);
    if (d.getDate() === jour && d.getMonth() === date.getMonth()) {
      return m.nom;
    }
  }
  
  return null;
}

/**
 * Retourne le saint du jour
 */
function getSaint(mois, jour) {
  const saints = SAINTS[mois];
  if (saints && jour >= 1 && jour <= saints.length) {
    return saints[jour - 1];
  }
  return '';
}

/**
 * Retourne les dates spéciales (non fériées) pour une année donnée
 * Mardi-Gras, Cendres, Rameaux, Fête des Mères, Fête des Pères
 * @returns {Object} clé "mois-jour" → nom
 */
function getDatesSpeciales(annee) {
  var result = {};
  var paques = calculerPaques(annee);
  var paquesTime = paques.getTime();
  var jourMs = 24 * 60 * 60 * 1000;

  // Mardi-Gras (47 jours avant Pâques)
  var mardiGras = new Date(paquesTime - 47 * jourMs);
  result[(mardiGras.getMonth() + 1) + '-' + mardiGras.getDate()] = 'Mardi-Gras';

  // Cendres (46 jours avant Pâques)
  var cendres = new Date(paquesTime - 46 * jourMs);
  result[(cendres.getMonth() + 1) + '-' + cendres.getDate()] = 'Cendres';

  // Rameaux (7 jours avant Pâques)
  var rameaux = new Date(paquesTime - 7 * jourMs);
  result[(rameaux.getMonth() + 1) + '-' + rameaux.getDate()] = 'Rameaux';

  // Pentecôte Sunday
  var pentecote = new Date(paquesTime + 49 * jourMs);

  // Fête des Mères: dernier dimanche de mai, sauf si Pentecôte
  var lastSundayMay = new Date(annee, 4, 31);
  while (lastSundayMay.getDay() !== 0) {
    lastSundayMay.setDate(lastSundayMay.getDate() - 1);
  }
  if (lastSundayMay.getDate() === pentecote.getDate() && lastSundayMay.getMonth() === pentecote.getMonth()) {
    var feteDesMeres = new Date(annee, 5, 1);
    while (feteDesMeres.getDay() !== 0) {
      feteDesMeres.setDate(feteDesMeres.getDate() + 1);
    }
    result[(feteDesMeres.getMonth() + 1) + '-' + feteDesMeres.getDate()] = 'F. des Mères';
  } else {
    result[(lastSundayMay.getMonth() + 1) + '-' + lastSundayMay.getDate()] = 'F. des Mères';
  }

  // Fête des Pères: 3e dimanche de juin
  var firstSundayJune = new Date(annee, 5, 1);
  while (firstSundayJune.getDay() !== 0) {
    firstSundayJune.setDate(firstSundayJune.getDate() + 1);
  }
  var feteDesPeres = new Date(firstSundayJune);
  feteDesPeres.setDate(feteDesPeres.getDate() + 14);
  result[(feteDesPeres.getMonth() + 1) + '-' + feteDesPeres.getDate()] = 'F. des Pères';

  return result;
}
