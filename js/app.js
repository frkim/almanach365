/**
 * almanach365 - Calendrier annuel français
 * Application principale
 */

(function () {
  'use strict';

  const JOURS_SEMAINE = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const JOURS_SEMAINE_COURT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const JOURS_LETTRE = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  const MOIS_NOMS = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  /** Number of years before/after current year available in the selector */
  var YEAR_RANGE = 2;

  const ZONE_CITIES = {
    'Zone A': 'Besançon, Bordeaux, Clermont-Ferrand, Dijon, Grenoble, Limoges, Lyon, Poitiers',
    'Zone B': 'Aix-Marseille, Amiens, Caen, Lille, Nancy-Metz, Nantes, Nice, Orléans-Tours, Reims, Rennes, Rouen, Strasbourg',
    'Zone C': 'Créteil, Montpellier, Paris, Toulouse, Versailles'
  };

  let vacancesData = [];
  let zonesVisibles = loadZonesCookie();

  function loadZonesCookie() {
    var def = { 'Zone A': true, 'Zone B': true, 'Zone C': true };
    var match = document.cookie.match(/(?:^|;\s*)zones=([^;]*)/);
    if (!match) return def;
    try { var obj = JSON.parse(decodeURIComponent(match[1])); return obj; } catch (e) { return def; }
  }

  function saveZonesCookie() {
    document.cookie = 'zones=' + encodeURIComponent(JSON.stringify(zonesVisibles)) + ';path=/;max-age=31536000;SameSite=Lax';
  }
  let anneeAffichee = new Date().getFullYear();
  let datesSpeciales = {};

  /**
   * Initialisation de l'application
   */
  function init() {
    setupYearNav();
    setupZoneCards();
    chargerVacances().then(function () {
      genererCalendrier();
      demarrerHorloge();
      scrollToToday();
    });
  }

  /**
   * Configure les flèches de navigation année précédente/suivante
   */
  function setupYearNav() {
    var currentYear = new Date().getFullYear();
    var minYear = currentYear - YEAR_RANGE;
    var maxYear = currentYear + YEAR_RANGE;

    function updateYearLabels() {
      var prevLabel = document.getElementById('prev-year-label');
      var nextLabel = document.getElementById('next-year-label');
      var btnPrev = document.getElementById('btn-prev-year');
      var btnNext = document.getElementById('btn-next-year');
      if (prevLabel) prevLabel.textContent = anneeAffichee - 1;
      if (nextLabel) nextLabel.textContent = anneeAffichee + 1;
      if (btnPrev) btnPrev.disabled = (anneeAffichee <= minYear);
      if (btnNext) btnNext.disabled = (anneeAffichee >= maxYear);
    }

    var btnPrev = document.getElementById('btn-prev-year');
    var btnNext = document.getElementById('btn-next-year');

    if (btnPrev) {
      btnPrev.addEventListener('click', function () {
        if (anneeAffichee > minYear) {
          anneeAffichee--;
          genererCalendrier();
          updateYearLabels();
        }
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', function () {
        if (anneeAffichee < maxYear) {
          anneeAffichee++;
          genererCalendrier();
          updateYearLabels();
        }
      });
    }

    updateYearLabels();
  }

  /**
   * Configure les zone cards comme toggles cliquables
   */
  function setupZoneCards() {
    var cards = document.querySelectorAll('.zone-card[data-zone]');
    cards.forEach(function (card) {
      var zone = card.getAttribute('data-zone');
      // Restore saved state on card UI
      card.classList.toggle('zone-active', zonesVisibles[zone]);
      card.classList.toggle('zone-inactive', !zonesVisibles[zone]);
      card.setAttribute('aria-pressed', zonesVisibles[zone] ? 'true' : 'false');
      card.addEventListener('click', function () {
        zonesVisibles[zone] = !zonesVisibles[zone];
        card.classList.toggle('zone-active', zonesVisibles[zone]);
        card.classList.toggle('zone-inactive', !zonesVisibles[zone]);
        card.setAttribute('aria-pressed', zonesVisibles[zone] ? 'true' : 'false');
        saveZonesCookie();
        genererCalendrier();
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  /**
   * Charge les données de vacances depuis le fichier JSON
   */
  function chargerVacances() {
    return fetch('data/vacances.json')
      .then(function (response) { return response.json(); })
      .then(function (data) {
        vacancesData = data.results || [];
      })
      .catch(function (err) {
        console.warn('Impossible de charger les vacances:', err);
        vacancesData = [];
      });
  }

  /**
   * Vérifie si une date est en vacances pour une zone donnée
   */
  function getVacancesPourDate(date, zone) {
    // Format local date as YYYY-MM-DD without UTC conversion
    var y = date.getFullYear();
    var mo = date.getMonth() + 1;
    var d = date.getDate();
    var dateStr = y + '-' + (mo < 10 ? '0' : '') + mo + '-' + (d < 10 ? '0' : '') + d;
    for (var i = 0; i < vacancesData.length; i++) {
      var v = vacancesData[i];
      if (v.zones !== zone) continue;
      // start_date/end_date are UTC timestamps; extract date part directly
      var debutStr = v.start_date.slice(0, 10);
      var finStr = v.end_date.slice(0, 10);
      if (dateStr >= debutStr && dateStr <= finStr) {
        return v.description;
      }
    }
    return null;
  }

  /**
   * Calcule le numéro de semaine ISO
   */
  function getNumeroSemaine(date) {
    var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }

  function getZoneVacClass(zone) {
    return 'vac-' + zone.replace(' ', '').toLowerCase();
  }

  /** Return zone colors for border-left styling */
  var ZONE_COLORS = {
    'Zone A': '#00c000',
    'Zone B': '#ffff00',
    'Zone C': '#ff0000'
  };

  /**
   * Génère le calendrier complet pour l'année sélectionnée
   * Layout: 2 tableaux semestriels (6 mois en colonnes)
   */
  function genererCalendrier() {
    var container = document.getElementById('calendar-container');
    container.innerHTML = '';

    var titre = document.getElementById('calendar-title');
    titre.textContent = 'Calendrier ' + anneeAffichee;
    document.title = 'Almanach365 - Calendrier ' + anneeAffichee;

    datesSpeciales = getDatesSpeciales(anneeAffichee);

    // Semestre 1 : Janvier - Juin
    var sem1 = creerSemestre(0, 5);
    container.appendChild(sem1);

    // Semestre 2 : Juillet - Décembre
    container.appendChild(creerSemestre(6, 11));
  }

  /**
   * Crée un tableau semestriel (6 mois côte à côte, 31 lignes max)
   */
  function creerSemestre(moisDebut, moisFin) {
    var wrapper = document.createElement('div');
    wrapper.className = 'semester-wrapper';

    var table = document.createElement('table');
    table.className = 'semester-table';

    // Colgroup pour fixer les largeurs de colonnes
    var nbZones = Object.keys(zonesVisibles).filter(function (z) { return zonesVisibles[z]; }).length;
    var szBarWidth = Math.max(2, nbZones * 2);
    var colgroup = document.createElement('colgroup');
    for (var m = moisDebut; m <= moisFin; m++) {
      var colSz = document.createElement('col');
      colSz.style.width = (m > moisDebut) ? (szBarWidth + 2) + 'px' : szBarWidth + 'px';
      colgroup.appendChild(colSz);
      var colSn = document.createElement('col');
      colSn.style.width = '2ch';
      colgroup.appendChild(colSn);
      var colSl = document.createElement('col');
      colSl.style.width = '3ch';
      colgroup.appendChild(colSl);
      var colSs = document.createElement('col');
      colgroup.appendChild(colSs);
      var colSw = document.createElement('col');
      colSw.style.width = '16px';
      colgroup.appendChild(colSw);
    }
    table.appendChild(colgroup);

    // En-tête avec noms des mois
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    for (var m = moisDebut; m <= moisFin; m++) {
      var th = document.createElement('th');
      th.colSpan = 5;
      th.textContent = MOIS_NOMS[m].toUpperCase();
      th.className = 'sem-month-header';
      th.id = 'mois-' + (m + 1);
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Corps du tableau
    var tbody = document.createElement('tbody');

    for (var jour = 1; jour <= 31; jour++) {
      var tr = document.createElement('tr');

      for (var m = moisDebut; m <= moisFin; m++) {
        var nbJours = new Date(anneeAffichee, m + 1, 0).getDate();

        if (jour <= nbJours) {
          var date = new Date(anneeAffichee, m, jour);
          var jourSemaine = date.getDay();
          var numSemaine = getNumeroSemaine(date);
          var ferie = estJourFerie(date);
          var nomFerie = getNomJourFerie(date);
          var saint = getSaint(m + 1, jour);
          var today = new Date();
          var isToday = date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate();

          // Dates spéciales (Mardi-Gras, Rameaux, etc.)
          var cleSpeciale = (m + 1) + '-' + jour;
          var dateSpeciale = datesSpeciales[cleSpeciale];

          // Classes CSS
          var classes = [];
          if (jourSemaine === 0) classes.push('is-dimanche');
          if (jourSemaine === 6) classes.push('is-samedi');
          if (ferie) classes.push('is-ferie');
          if (isToday) classes.push('is-today');
          if (dateSpeciale) classes.push('is-special');

          // Vacances
          var zonesEnVacances = [];
          ['Zone A', 'Zone B', 'Zone C'].forEach(function (zone) {
            if (zonesVisibles[zone] && getVacancesPourDate(date, zone)) {
              zonesEnVacances.push(zone);
            }
          });

          var cellClass = classes.join(' ');
          var borderClass = (m > moisDebut) ? ' sem-bl' : '';

          // Zone indicator cell (vertical colored bars on the left)
          var tdZone = document.createElement('td');
          tdZone.className = 'sz' + borderClass;
          if (zonesEnVacances.length === 1) {
            tdZone.style.background = ZONE_COLORS[zonesEnVacances[0]];
          } else if (zonesEnVacances.length === 2) {
            tdZone.style.background = 'linear-gradient(to right, ' +
              ZONE_COLORS[zonesEnVacances[0]] + ' 50%, ' +
              ZONE_COLORS[zonesEnVacances[1]] + ' 50%)';
          } else if (zonesEnVacances.length === 3) {
            tdZone.style.background = 'linear-gradient(to right, ' +
              ZONE_COLORS[zonesEnVacances[0]] + ' 33.3%, ' +
              ZONE_COLORS[zonesEnVacances[1]] + ' 33.3%, ' +
              ZONE_COLORS[zonesEnVacances[1]] + ' 66.6%, ' +
              ZONE_COLORS[zonesEnVacances[2]] + ' 66.6%)';
          }
          tr.appendChild(tdZone);

          // Cellule numéro du jour
          var tdNum = document.createElement('td');
          tdNum.className = 'sn ' + cellClass;
          tdNum.textContent = jour;
          tr.appendChild(tdNum);

          // Cellule lettre du jour
          var tdLettre = document.createElement('td');
          tdLettre.className = 'sl ' + cellClass;
          tdLettre.textContent = JOURS_LETTRE[jourSemaine];
          tr.appendChild(tdLettre);

          // Cellule nom (saint / férié / spécial)
          var tdNom = document.createElement('td');
          tdNom.className = 'ss ' + cellClass;
          if (nomFerie) {
            tdNom.textContent = nomFerie;
          } else if (dateSpeciale) {
            tdNom.textContent = dateSpeciale;
          } else {
            tdNom.textContent = saint;
          }
          tr.appendChild(tdNom);

          // Cellule numéro de semaine (affiché le lundi)
          var tdWeek = document.createElement('td');
          tdWeek.className = 'sw ' + cellClass;
          if (jourSemaine === 1) {
            tdWeek.textContent = numSemaine;
          }
          tr.appendChild(tdWeek);

        } else {
          // Cellules vides pour les mois plus courts
          var tdE1 = document.createElement('td');
          tdE1.className = 'sem-empty' + ((m > moisDebut) ? ' sem-bl' : '');
          tr.appendChild(tdE1);
          for (var c = 0; c < 4; c++) {
            var tdE = document.createElement('td');
            tdE.className = 'sem-empty';
            tr.appendChild(tdE);
          }
        }
      }

      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    wrapper.appendChild(table);
    return wrapper;
  }

  /**
   * Échappe les caractères HTML
   */
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  /**
   * Démarre l'horloge en temps réel (heure française)
   */
  function demarrerHorloge() {
    function update() {
      var maintenant = new Date();
      var options = {
        timeZone: 'Europe/Paris',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      var dateStr = maintenant.toLocaleDateString('fr-FR', options);
      var el = document.getElementById('current-datetime');
      if (el) el.textContent = dateStr;
    }
    update();
    setInterval(update, 1000);
  }

  /**
   * Scroll vers la date du jour
   */
  function scrollToToday() {
    var today = document.querySelector('.is-today');
    if (today && anneeAffichee === new Date().getFullYear()) {
      setTimeout(function () {
        today.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }

  // Démarrage
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
