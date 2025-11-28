# Comment lancer le jeu

## Problème CORS

Si vous ouvrez `index.html` directement dans le navigateur (avec `file://`), vous aurez des erreurs CORS car les navigateurs bloquent les requêtes fetch vers des fichiers locaux.

## Solution : Utiliser un serveur HTTP local

### Option 1 : Script automatique (Recommandé)

```bash
./start-server.sh
```

Puis ouvrez http://localhost:8000 dans votre navigateur.

### Option 2 : Python

```bash
python3 -m http.server 8000
```

Ou avec Python 2 :
```bash
python -m SimpleHTTPServer 8000
```

### Option 3 : Node.js (si installé)

```bash
npx http-server -p 8000
```

### Option 4 : PHP (si installé)

```bash
php -S localhost:8000
```

## Après avoir démarré le serveur

1. Ouvrez votre navigateur
2. Allez sur http://localhost:8000
3. Cliquez sur `index.html`
4. Le jeu devrait fonctionner sans erreurs CORS !

## Note

Les configurations des personnages sont maintenant intégrées directement dans le JavaScript pour éviter les problèmes CORS, mais utiliser un serveur local reste recommandé pour un fonctionnement optimal.


