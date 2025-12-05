# 🔐 Configuration de la clé API sur Netlify

## Pourquoi une variable d'environnement ?

Pour sécuriser votre clé API OpenAI, elle ne doit **jamais** être exposée dans le code côté client. Sur Netlify, nous utilisons une **fonction proxy** qui garde la clé API secrète côté serveur.

## ✅ Configuration sur Netlify

### Étape 1 : Ajouter la variable d'environnement

1. Allez sur votre site Netlify : [app.netlify.com](https://app.netlify.com)
2. Sélectionnez votre site `gardiens`
3. Allez dans **Site settings** → **Environment variables**
4. Cliquez sur **Add a variable**
5. Remplissez :
   - **Key** : `OPENAI_API_KEY`
   - **Value** : Votre clé API OpenAI (commence par `sk-proj-` ou `sk-`)
   - **Scopes** : Cochez **Production**, **Deploy previews**, et **Branch deploys** selon vos besoins
6. Cliquez sur **Save**

### Étape 2 : Redéployer le site

Après avoir ajouté la variable d'environnement, vous devez redéployer :

1. Allez dans **Deploys**
2. Cliquez sur **Trigger deploy** → **Deploy site**
3. Ou faites un nouveau `git push` pour déclencher un déploiement automatique

## 🔧 Comment ça fonctionne ?

### En production (Netlify)

- Le code utilise la fonction Netlify `/netlify/functions/dialogue-proxy.js`
- Cette fonction récupère la clé API depuis `process.env.OPENAI_API_KEY`
- La clé API reste **secrète** et n'est jamais exposée au client
- Les appels API passent par le proxy Netlify

### En développement local

- Le code utilise directement l'API OpenAI
- La clé API est chargée depuis `localStorage` (via `config-api.js`)
- Vous devez avoir `config-api.js` avec votre clé API locale

## 📝 Vérification

Pour vérifier que tout fonctionne :

1. **En production** : Ouvrez la console du navigateur sur votre site Netlify
   - Vous devriez voir : `✅ Service de dialogue initialisé (mode production Netlify - clé API gérée par proxy)`
   - Les dialogues devraient fonctionner sans configuration côté client

2. **En développement local** : 
   - Assurez-vous d'avoir `config-api.js` avec votre clé API
   - Ou configurez via : `localStorage.setItem('llm_api_key', 'votre_cle')`

## 🔒 Sécurité

✅ **Sécurisé** : La clé API est stockée dans les variables d'environnement Netlify (côté serveur)

✅ **Protégé** : Le fichier `config-api.js` est dans `.gitignore` et ne sera jamais commité

❌ **À éviter** : Ne jamais mettre la clé API directement dans le code JavaScript

## 🆘 Dépannage

### Les dialogues ne fonctionnent pas en production

1. Vérifiez que la variable `OPENAI_API_KEY` est bien configurée sur Netlify
2. Vérifiez que vous avez redéployé après avoir ajouté la variable
3. Vérifiez les logs Netlify dans **Functions** → **dialogue-proxy** pour voir les erreurs

### Erreur "Clé API non configurée sur le serveur"

- La variable d'environnement `OPENAI_API_KEY` n'est pas définie sur Netlify
- Ajoutez-la dans **Site settings** → **Environment variables**

### Les dialogues fonctionnent en local mais pas sur Netlify

- C'est normal si vous n'avez pas configuré la variable d'environnement Netlify
- Suivez l'étape 1 ci-dessus pour configurer `OPENAI_API_KEY`

