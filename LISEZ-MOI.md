# Ma Cotisation

Application de suivi des cotisations mensuelles du **Groupe Webe Grin**, construite d'après le cahier de conception *Ma Cotisation — System Design & UX/UI*.

Elle fonctionne sur téléphone Android (installable comme une application) et sur ordinateur, sans connexion Internet. Les données restent sur l'appareil.

## Installer

**Sur Android** (recommandé) : une fois le dossier publié sur un site (par exemple GitHub Pages), ouvrir le lien dans Chrome, puis menu ⋮ → **Ajouter à l'écran d'accueil** / **Installer l'application**. L'icône « Cotisation » apparaît avec les autres applications et fonctionne ensuite hors connexion.

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
- `manifest.webmanifest`, `sw.js`, `icones/` : installation sur Android et fonctionnement hors connexion
