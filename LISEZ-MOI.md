# Ma Cotisation

Application de suivi des cotisations mensuelles du **Groupe Webe Grin**, construite d'après le cahier de conception *Ma Cotisation — System Design & UX/UI*.

Elle fonctionne sur téléphone Android (installable comme une application) et sur ordinateur, sans connexion Internet. Les données restent sur l'appareil.

## Installer

**Sur Android (application APK)** : télécharger
https://github.com/Oden225/Caisse-Webe-Grin/releases/latest/download/Ma-Cotisation.apk
sur le téléphone, l'ouvrir, autoriser l'installation depuis cette source si Android le demande, puis **Installer**.
Ne pas désinstaller l'application sans avoir fait une copie de sauvegarde.

L'APK est fabriqué automatiquement par GitHub Actions (`.github/workflows/apk.yml`) à chaque mise à jour de la branche, avec Capacitor.

**Clé de signature.** Pour qu'une nouvelle version s'installe par-dessus l'ancienne (sans perdre les données), toutes les versions doivent être signées avec la même clé. Elle se range dans deux secrets du dépôt (Settings → Secrets and variables → Actions) : `ANDROID_KEYSTORE_BASE64` (le fichier .jks en base64, alias `macotisation`) et `ANDROID_KEYSTORE_PASSWORD`. Sans ces secrets, chaque APK est signé avec une clé temporaire : il s'installe, mais une mise à jour demandera de faire une copie de sauvegarde, désinstaller, réinstaller puis reprendre la copie.

**Sur ordinateur** : copier tout le dossier puis double-cliquer sur `index.html` (Chrome ou Edge).

## Les écrans

| Onglet | Rôle |
|---|---|
| **Accueil** | Situation du mois : qui a payé, argent reçu, reste à collecter, membres en retard, dernières opérations, gros bouton **Enregistrer un paiement** |
| **Membres** | Recherche, filtres Tous / À jour / En retard / Archivés, ajout d'un membre, fiche détaillée (total versé, mois réglés, mois dus, historique) |
| **Paiements** | Suivi mois par mois (consultation seulement) : payés, non payés, taux de recouvrement |
| **Rapports** | Rapport d'un mois ou d'une période, résumé ou détaillé, partagé en **PDF** ou **Word (.docx)** via le menu de partage (WhatsApp), message texte, impression |
| ⚙️ Paramètres | Association, montant, numéro de dépôt, début du suivi, sauvegarde/restauration, code PIN, historique des modifications, aide |

## Règles appliquées

- Cotisation de 1 000 FCFA par mois (modifiable ; un changement s'applique à partir du mois en cours).
- Un paiement couvre un ou plusieurs mois choisis explicitement ; les mois en retard sont proposés en premier. 3 000 F = 3 mois distincts liés au même versement.
- La date de réception de l'argent est enregistrée séparément des mois couverts.
- Impossible de payer deux fois le même mois pour le même membre.
- Une erreur se corrige en **annulant** le paiement avec un motif : il reste visible, barré, dans l'historique. Rien n'est effacé en silence.
- Un membre qui part est **archivé**, pas supprimé : son historique est conservé.
- Paiements partiels : non gérés dans cette version (une mensualité = le montant complet).
- Les montants affichés sont ceux des cotisations ; ce n'est pas le solde de la caisse.

## Sauvegarde

Paramètres → **Faire une copie** (une fois par mois). Sur Android, la copie peut être envoyée sur WhatsApp ou Google Drive. Pour la récupérer : **Reprendre une copie**. Sans copie, une désinstallation ou une panne fait perdre les données.

## Fichiers

- `index.html`, `css/app.css` : l'interface
- `js/donnees.js` : données et règles (membres, versements, affectations mensuelles, journal)
- `js/rapports.js` : rapports PDF / Word / message et partage
- `js/docx.js` : création des fichiers Word sans dépendance
- `js/app.js` : écrans et navigation
- `lib/` : jsPDF (création des PDF)
- `manifest.webmanifest`, `sw.js`, `icones/` : version web installable et hors connexion
- `package.json`, `capacitor.config.json`, `android-res/`, `.github/workflows/apk.yml` : fabrication de l'APK Android
