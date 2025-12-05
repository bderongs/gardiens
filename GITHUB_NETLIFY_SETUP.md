# Guide : Connecter GitHub et Netlify

## ✅ Étape 1 : Créer le repository GitHub

1. Allez sur [github.com](https://github.com) et connectez-vous
2. Cliquez sur le bouton **"+"** en haut à droite → **"New repository"**
3. Remplissez :
   - **Repository name** : `gardiens` (ou un autre nom)
   - **Description** : "Gardiens des Cités Perdues - Jeu Phaser"
   - **Visibilité** : Public ou Private (votre choix)
   - **NE COCHEZ PAS** "Add a README file"
   - **NE COCHEZ PAS** "Add .gitignore"
   - **NE COCHEZ PAS** "Choose a license"
4. Cliquez sur **"Create repository"**

## ✅ Étape 2 : Connecter votre projet local à GitHub

Une fois le repository créé, GitHub vous affichera des instructions. Utilisez ces commandes dans votre terminal :

```bash
cd /Users/baptiste/Sites/gardiens

# Ajouter le remote GitHub (remplacez VOTRE-USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/VOTRE-USERNAME/gardiens.git

# Renommer la branche en main (si nécessaire)
git branch -M main

# Pousser le code vers GitHub
git push -u origin main
```

**Note** : Si vous utilisez SSH au lieu de HTTPS, utilisez :
```bash
git remote add origin git@github.com:VOTRE-USERNAME/gardiens.git
```

## ✅ Étape 3 : Connecter Netlify à GitHub

1. Allez sur [netlify.com](https://netlify.com) et connectez-vous
2. Cliquez sur **"Add new site"** → **"Import an existing project"**
3. Choisissez **"GitHub"** et autorisez Netlify à accéder à votre compte GitHub
4. Sélectionnez votre repository `gardiens`
5. **Settings de déploiement** :
   - **Branch to deploy** : `main`
   - **Build command** : (laissez vide - pas de build nécessaire)
   - **Publish directory** : `.` (point = racine du projet)
6. Cliquez sur **"Deploy site"**

## ✅ Étape 4 : Configuration Netlify (optionnel)

Une fois le déploiement terminé :

1. Allez dans **Site settings** → **Change site name**
2. Choisissez un nom unique (ex: `gardiens-cites-perdues`)
3. Votre URL sera : `https://gardiens-cites-perdues.netlify.app`

## 🎉 C'est fait !

Votre site est maintenant déployé et sera automatiquement mis à jour à chaque `git push` !

## 📝 Pour mettre à jour le site

```bash
git add .
git commit -m "Description de vos changements"
git push
```

Netlify déploiera automatiquement les changements en quelques secondes.


