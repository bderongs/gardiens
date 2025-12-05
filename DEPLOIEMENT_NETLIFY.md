# 🚀 Déploiement sur Netlify

## Méthode recommandée : Via GitHub (déploiement automatique)

Maintenant que votre code est sur GitHub, connectons Netlify pour un déploiement automatique à chaque `git push`.

### ✅ Étape 1 : Créer un compte Netlify

1. Allez sur [netlify.com](https://netlify.com)
2. Cliquez sur **"Sign up"** (gratuit)
3. Choisissez **"Sign up with GitHub"** pour faciliter la connexion

### ✅ Étape 2 : Connecter votre repository GitHub

1. Une fois connecté, cliquez sur **"Add new site"** → **"Import an existing project"**
2. Choisissez **"GitHub"** 
3. Si c'est la première fois, autorisez Netlify à accéder à votre compte GitHub
4. Sélectionnez votre repository `gardiens`

### ✅ Étape 3 : Configurer le déploiement

Netlify détectera automatiquement le fichier `netlify.toml`, mais vérifiez ces paramètres :

- **Branch to deploy** : `main`
- **Build command** : (laissez vide - pas de build nécessaire)
- **Publish directory** : `.` (point = racine du projet)

### ✅ Étape 4 : Déployer

Cliquez sur **"Deploy site"** et attendez quelques secondes. Votre site sera en ligne !

### ✅ Étape 5 : Personnaliser l'URL (optionnel)

1. Allez dans **Site settings** → **Change site name**
2. Choisissez un nom unique (ex: `gardiens-cites-perdues`)
3. Votre URL sera : `https://gardiens-cites-perdues.netlify.app`

## 🔐 Configuration de la clé API (IMPORTANT)

Pour que les dialogues fonctionnent sur Netlify, vous devez configurer la variable d'environnement `OPENAI_API_KEY` :

1. Allez dans **Site settings** → **Environment variables**
2. Cliquez sur **Add a variable**
3. Remplissez :
   - **Key** : `OPENAI_API_KEY`
   - **Value** : Votre clé API OpenAI
4. Redéployez le site

📖 **Guide détaillé** : Voir `CONFIGURATION_NETLIFY.md` pour plus d'informations.

## 🎉 C'est fait !

Votre site est maintenant en ligne et sera **automatiquement mis à jour** à chaque fois que vous ferez un `git push` !

## 📝 Mettre à jour le site

Pour mettre à jour le site, il suffit de pousser vos changements sur GitHub :

```bash
git add .
git commit -m "Description de vos changements"
git push
```

Netlify détectera automatiquement les changements et redéploiera le site en quelques secondes.

## 🔧 Configuration existante

Votre projet est déjà configuré avec :
- ✅ `netlify.toml` : Configuration Netlify (redirections SPA, cache des assets)
- ✅ `_redirects` : Redirections pour le routing SPA
- ✅ Tous les assets optimisés pour le web

## 🌐 Alternatives de déploiement

Si vous préférez d'autres plateformes :

- **Vercel** : Similaire à Netlify, très populaire pour Next.js
- **GitHub Pages** : Gratuit, intégré à GitHub
- **Cloudflare Pages** : Gratuit, très rapide

Pour GitHub Pages, vous pouvez utiliser le guide dans `DEPLOY_GITHUB_PAGES.md` (à créer si besoin).

