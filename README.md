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
- **Sélection de période** — cliquer ou cliquer-glisser sur le calendrier pour sélectionner une plage de dates ; affiche le nombre total de jours et de jours ouvrés (hors week-ends et jours fériés). Cliquer en dehors du calendrier efface la sélection
- **Thème sombre** — basculer entre thème clair et sombre via le bouton dans l'en-tête ; le choix est mémorisé dans un cookie
- **Scroll automatique** — la page défile vers la date du jour au chargement
- **Responsive** — mise en page adaptée aux écrans larges et mobiles
- **Impression** — feuille de styles dédiée pour l'impression

## Structure du projet

```
index.html                       Page unique de l'application
css/style.css                    Styles (variables CSS, responsive, print)
js/app.js                        Logique principale (calendrier, horloge, zones, cookies)
js/fetes.js                      Calcul des jours fériés et dates spéciales
data/vacances.json               Données des vacances scolaires (source : data.gouv.fr)
infra/main.bicep                 IaC Azure — Storage Account + site statique
infra/main.parameters.json       Paramètres Bicep
.github/workflows/deploy.yml     CI/CD — déploiement automatique sur Azure
```

## Lancer en local

Tout serveur HTTP statique convient :

```bash
python -m http.server 8080
```

Puis ouvrir `http://localhost:8080`.

## Déploiement sur Azure

L'application est hébergée sur **Azure Storage Static Website** (coût quasi nul).

### Prérequis

1. Un abonnement Azure
2. Une [inscription d'application (Service Principal)](https://learn.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal) avec fédération OIDC pour GitHub Actions
3. Les secrets GitHub suivants configurés dans le dépôt :
   - `AZURE_CLIENT_ID`
   - `AZURE_TENANT_ID`
   - `AZURE_SUBSCRIPTION_ID`

### Déploiement manuel (CLI)

```bash
# Créer le groupe de ressources
az group create --name rg-almanach365 --location westeurope

# Déployer l'infrastructure
az deployment group create \
  --resource-group rg-almanach365 \
  --template-file infra/main.bicep \
  --parameters infra/main.parameters.json

# Activer le site statique
az storage blob service-properties update \
  --account-name almanach365 \
  --static-website \
  --index-document index.html

# Uploader les fichiers
az storage blob upload-batch \
  --account-name almanach365 \
  --destination '$web' \
  --source . \
  --overwrite
```

### Déploiement automatique (GitHub Actions)

Chaque `push` sur `main` déclenche le workflow `.github/workflows/deploy.yml` qui :
1. Provisionne l'infrastructure via Bicep
2. Uploade les fichiers statiques dans le conteneur `$web`

## Licence

Voir [LICENSE](LICENSE).
