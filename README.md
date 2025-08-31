# PMD+ Userscript

**PMD+** est un userscript qui ajoute de nouvelles fonctionnalités au site [pmdapp.fr](https://pmdapp.fr).

---

## ✨ Fonctionnalités

- **⏱️ Timer**
  - Indique le temps restant avant d’arriver à la prochaine station pour respecter les timings.
  - Affiche la distance avant la prochaine station.

- **🤖 Bouton Auto**
  - Permet de lancer le train en mode automatique : ouverture/fermeture des portes et gestion accélération/freinage.

- **🗺️ Plan dynamique**
  - Affichage d’un plan de ligne dynamique et stylisé.

---

## 📂 Structure du projet

Le dépôt est composé de 3 dossiers principaux :  

- **`dev/`** : le plus important → c’est ici que sont codés les fichiers sources du userscript.  
- **`prod/`** : contient le fichier userscript final en production (`pmd-plus.user.js`).  
- **`build/`** : contient l’application Node.js qui assemble les fichiers du dossier `dev/` pour générer le fichier final dans `prod/`.  

---

## ⚠️ Avertissement

Le code n’est **pas encore très clair ni bien documenté**, car à l’origine il s’agissait d’un **projet personnel**.  
À l’avenir, il sera mieux documenté et structuré pour faciliter la lecture et les contributions.  

---

## 🛠️ Conseils pour le développement

1. **Créer une nouvelle branche** pour chaque nouvelle fonctionnalité que vous voulez ajouter.  
2. **Cloner le repo** sur votre ordinateur.  
   *Vous allez exclusivement modifier les fichiers dans **`/dev`**.*
3. Pour tester en local, créez un nouveau userscript dans **Tampermonkey** avec ce header :  

   ```js
   // ==UserScript==
   // @name         PMD+ [DEV]
   // @version      0.4.6
   // @description  Extension qui ajoute des fonctionnalités (timer, pilote automatique et plan dynamique) dans le jeu PMD.
   // @author       PieroLB
   // @match        https://pmdapp.fr/*
   // @match        https://www.pmdapp.fr/*
   // @license      MIT
   // @grant        none
   // @require      http://127.0.0.1:5500/dev/auto.js
   // @require      http://127.0.0.1:5500/dev/main.js
   // @require      http://127.0.0.1:5500/dev/plan.js
   // @require      http://127.0.0.1:5500/dev/settings.js
   // @require      http://127.0.0.1:5500/dev/timer.js
   // @require      http://127.0.0.1:5500/dev/ui.js
   // ==/UserScript==
   ```
➡️ Pour chaque fichier dans `dev/`, n’oubliez pas de l’ajouter dans le header avec `@require`.

4. Utilisez l’extension **Live Server** sur VS Code pour lancer un serveur local (port **5500** par défaut).  
5. Après modification d’un fichier, allez dans **Tampermonkey → Externals → Actualiser** le fichier, puis rechargez [pmdapp.fr](https://pmdapp.fr).  
6. Faites un commit lorsqu'une modification est terminée

Lorsque vous voulez publiez vos modifications, **faites une pull request**.  Si elle est acceptée, ces modifications seront accessibles à tous.  

---

## 📜 Licence

[MIT](./LICENSE)
