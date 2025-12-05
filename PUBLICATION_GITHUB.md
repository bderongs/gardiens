# Guide rapide : Publier sur GitHub

## ✅ Étape 1 : Préparer le dépôt local

Tous les fichiers sont prêts. Il ne reste qu'à commit les changements :

```bash
cd /Users/baptiste/Sites/gardiens

# Ajouter tous les fichiers (config-api.js sera ignoré grâce au .gitignore)
git add .

# Créer un commit
git commit -m "Initial commit: Jeu Gardiens des Cités Perdues avec Phaser"
```

## ✅ Étape 2 : Créer le repository sur GitHub

1. Allez sur [github.com](https://github.com) et connectez-vous
2. Cliquez sur le bouton **"+"** en haut à droite → **"New repository"**
3. Remplissez :
   - **Repository name** : `gardiens` (ou un autre nom de votre choix)
   - **Description** : "Gardiens des Cités Perdues - Jeu interactif avec Phaser"
   - **Visibilité** : Public ou Private (votre choix)
   - **⚠️ IMPORTANT** : Ne cochez **AUCUNE** case (pas de README, pas de .gitignore, pas de license)
4. Cliquez sur **"Create repository"**

## ✅ Étape 3 : Connecter et pousser le code

Une fois le repository créé, GitHub affichera des instructions. Utilisez ces commandes :

```bash
# Remplacez VOTRE-USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/VOTRE-USERNAME/gardiens.git

# Vérifier que la branche est bien 'main'
git branch -M main

# Pousser le code vers GitHub
git push -u origin main
```

**Note** : Si vous utilisez SSH au lieu de HTTPS, utilisez :
```bash
git remote add origin git@github.com:VOTRE-USERNAME/gardiens.git
```

## 🔐 Sécurité

✅ Le fichier `config-api.js` est déjà dans `.gitignore` - votre clé API ne sera **jamais** publiée sur GitHub.

✅ Un fichier `config-api.js.example` est inclus pour que les autres puissent configurer leur propre clé.

## 🎉 C'est fait !

Votre code est maintenant sur GitHub ! 

Pour mettre à jour le dépôt à l'avenir :
```bash
git add .
git commit -m "Description de vos changements"
git push
```

## 📚 Déploiement sur Netlify

Si vous souhaitez aussi déployer le site sur Netlify, consultez `GITHUB_NETLIFY_SETUP.md` pour les instructions détaillées.

