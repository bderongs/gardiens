# Intégration des Sprites Universal LPC

## ✅ Ce qui a été fait

1. **Structure de dossiers créée** :
   - `sprites/body/` - Parties du corps
   - `sprites/hair/` - Styles de cheveux
   - `sprites/clothes/` - Vêtements
   - `sprites/accessories/` - Accessoires (optionnel)

2. **Système de chargement de sprites** (`sprite-loader.js`) :
   - Cache des images chargées
   - Chargement asynchrone
   - Gestion des erreurs

3. **Système de rendu avec calques** (`character-renderer.js`) :
   - Combinaison des sprites en calques
   - Ordre de rendu correct (corps → vêtements → tête → cheveux)
   - Fallback vers le rendu Canvas si les sprites ne sont pas disponibles

4. **Intégration dans le code principal** :
   - Les fonctions de rendu utilisent maintenant les sprites si disponibles
   - Fallback automatique vers le rendu Canvas si les sprites manquent

## 📥 Prochaines étapes : Télécharger les sprites

### Option 1 : Générateur en ligne (Le plus simple)

1. Aller sur : https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/
2. Créer quelques personnages avec différentes options
3. Télécharger les sprites générés
4. Les placer dans les dossiers appropriés

### Option 2 : GitHub (Pour les sprites individuels)

1. Aller sur : https://github.com/makrohn/Universal-LPC-spritesheet
2. Cliquer sur "Code" > "Download ZIP"
3. Extraire et explorer les dossiers
4. Copier les sprites nécessaires dans `sprites/`

### Option 3 : OpenGameArt.org

1. Aller sur : https://opengameart.org
2. Rechercher "Universal LPC" ou "Liberated Pixel Cup"
3. Télécharger les packs disponibles

## 📁 Organisation des fichiers

Une fois les sprites téléchargés, organisez-les ainsi :

```
sprites/
├── body/
│   ├── head_light.png
│   ├── head_medium.png
│   ├── torso.png
│   ├── legs.png
│   └── arms.png
├── hair/
│   ├── short_blonde.png
│   ├── medium_brunette.png
│   ├── long_blonde.png
│   └── ponytail_brunette.png
└── clothes/
    ├── tshirt_blue.png
    ├── shirt_white.png
    └── dress_blue.png
```

## ⚙️ Configuration

Une fois les sprites en place, mettez à jour `sprites/character-renderer.js` :

```javascript
this.spriteConfig = {
    body: {
        head: 'sprites/body/head_light.png',  // Votre fichier
        torso: 'sprites/body/torso.png',
        // ...
    },
    hair: {
        short: 'sprites/hair/short_blonde.png',
        // ...
    },
    clothes: {
        tshirt: 'sprites/clothes/tshirt_blue.png',
        // ...
    }
};
```

## 🧪 Tester

1. Ouvrir `index.html` dans le navigateur
2. Ouvrir la console (F12)
3. Vérifier s'il y a des erreurs de chargement
4. Si les sprites sont chargés, ils apparaîtront dans la prévisualisation
5. Sinon, le système utilisera automatiquement le rendu Canvas

## 📝 Notes

- **Licence** : Les sprites LPC sont sous CC-BY-SA 3.0 et GPLv3
- **Format** : PNG avec transparence
- **Taille** : Généralement 64x64 pixels par frame
- **Fallback** : Le jeu fonctionne même sans sprites (utilise le rendu Canvas)

## 🔗 Ressources

- Générateur : https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/
- GitHub : https://github.com/makrohn/Universal-LPC-spritesheet
- Documentation : Voir `sprites/GUIDE_INTEGRATION.md`


