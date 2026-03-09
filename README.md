# Almanach365

Calendrier annuel français complet — 100 % statique, sans framework, sans dépendance serveur.

## Fonctionnalités

- **Jours fériés** — tous les jours fériés français (fixes et mobiles, dont Pâques, Ascension, Pentecôte…)
- **Vacances scolaires** — zones A, B et C avec barres verticales colorées
- **Saints du jour** — affichés pour chaque date
- **Numéros de semaine** — colonne dédiée (ISO 8601)
- **Horloge temps réel** — date et heure française dans l'en-tête
- **Navigation par année** — boutons précédent / suivant
- **Filtrage des zones** — cliquer sur une zone pour l'afficher ou la masquer ; le choix est mémorisé dans un cookie
- **Scroll automatique** — la page défile vers la date du jour au chargement
- **Responsive** — mise en page adaptée aux écrans larges et mobiles
- **Impression** — feuille de styles dédiée pour l'impression

## Structure du projet

```
index.html          Page unique de l'application
css/style.css       Styles (variables CSS, responsive, print)
js/app.js           Logique principale (calendrier, horloge, zones, cookies)
js/fetes.js         Calcul des jours fériés et dates spéciales
data/vacances.json  Données des vacances scolaires (source : data.gouv.fr)
```

## Lancer en local

Tout serveur HTTP statique convient :

```bash
python -m http.server 8080
```

Puis ouvrir `http://localhost:8080`.

## Licence

Voir [LICENSE](LICENSE).
