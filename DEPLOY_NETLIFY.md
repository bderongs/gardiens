# Guide de déploiement sur Netlify

## Méthode 1 : Drag & Drop (La plus simple) ⭐

1. **Allez sur [netlify.com](https://netlify.com)** et créez un compte (gratuit)

2. **Une fois connecté**, cliquez sur **"Add new site"** → **"Deploy manually"**

3. **Glissez-déposez** votre dossier `gardiens` dans la zone de déploiement

4. **C'est tout !** Votre site sera déployé en quelques secondes

5. Netlify vous donnera une URL du type : `https://random-name-123.netlify.app`

6. **Optionnel** : Vous pouvez changer le nom du site dans **Site settings** → **Change site name**

---

## Méthode 2 : Via Git (Recommandé pour les mises à jour)

### Étape 1 : Créer un repo GitHub

1. Allez sur [github.com](https://github.com) et créez un compte si nécessaire

2. Créez un nouveau repository (bouton "+" en haut à droite)

3. Nommez-le `gardiens` (ou autre nom)

4. **Ne cochez PAS** "Initialize with README"

5. Cliquez sur **"Create repository"**

### Étape 2 : Pousser votre code

Dans votre terminal, dans le dossier du projet :

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - Gardiens des Cités Perdues"

# Ajouter le remote GitHub (remplacez VOTRE-USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/VOTRE-USERNAME/gardiens.git

# Pousser le code
git branch -M main
git push -u origin main
```

### Étape 3 : Connecter à Netlify

1. Sur Netlify, cliquez sur **"Add new site"** → **"Import an existing project"**

2. Choisissez **"GitHub"** et autorisez Netlify

3. Sélectionnez votre repository `gardiens`

4. **Settings de déploiement** :
   - **Build command** : (laissez vide, pas de build nécessaire)
   - **Publish directory** : `.` (point = racine)

5. Cliquez sur **"Deploy site"**

6. **C'est fait !** Votre site sera déployé automatiquement à chaque `git push`

---

## Configuration automatique

Les fichiers suivants ont été créés pour vous :

- `netlify.toml` : Configuration Netlify (redirections, headers)
- `_redirects` : Redirections pour le SPA
- `.gitignore` : Fichiers à ignorer par Git

---

## Personnaliser votre URL

1. Allez dans **Site settings** → **Change site name**
2. Choisissez un nom unique (ex: `gardiens-cites-perdues`)
3. Votre URL sera : `https://gardiens-cites-perdues.netlify.app`

---

## Mettre à jour le site

### Si vous avez utilisé la méthode Drag & Drop :
- Glissez-déposez à nouveau le dossier mis à jour

### Si vous avez utilisé Git :
```bash
git add .
git commit -m "Description de vos changements"
git push
```
Netlify déploiera automatiquement les changements !

---

## Support

Si vous avez des problèmes :
- Documentation Netlify : https://docs.netlify.com
- Support Netlify : https://www.netlify.com/support/


