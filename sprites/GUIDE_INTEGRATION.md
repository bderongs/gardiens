# Guide d'intégration Universal LPC Spritesheet

## Étape 1 : Obtenir les sprites

### Option A : Utiliser le générateur en ligne (Recommandé pour commencer)

1. Aller sur : https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/
2. Personnaliser un personnage avec les options :
   - Couleur de peau
   - Style de cheveux
   - Couleur de cheveux
   - Vêtements
3. Cliquer sur "Download" pour télécharger le sprite complet
4. Sauvegarder l'image dans `sprites/` comme référence

### Option B : Télécharger depuis GitHub (Pour les sprites individuels)

1. Aller sur : https://github.com/makrohn/Universal-LPC-spritesheet
2. Cliquer sur "Code" > "Download ZIP"
3. Extraire le fichier ZIP
4. Naviguer dans les dossiers pour trouver les sprites individuels :
   - `Universal-LPC-spritesheet/spritesheets/` contient les spritesheets complets
   - Les sprites sont organisés par catégories

### Option C : Utiliser les sprites individuels

Le projet LPC propose des sprites séparés pour chaque partie :
- Corps (body parts)
- Cheveux (hair)
- Vêtements (clothes)
- Accessoires (accessories)

## Étape 2 : Organiser les sprites

### Structure recommandée

```
sprites/
├── body/
│   ├── head_light.png
│   ├── head_medium.png
│   ├── head_dark.png
│   ├── torso.png
│   ├── legs.png
│   └── arms.png
├── hair/
│   ├── short_blonde.png
│   ├── short_brunette.png
│   ├── medium_blonde.png
│   ├── long_blonde.png
│   ├── curly_brunette.png
│   ├── ponytail_blonde.png
│   └── bun_brunette.png
├── clothes/
│   ├── tshirt_blue.png
│   ├── tshirt_red.png
│   ├── shirt_white.png
│   ├── dress_blue.png
│   ├── jacket_black.png
│   └── hoodie_gray.png
└── accessories/
    └── (optionnel)
```

## Étape 3 : Extraire les sprites depuis une spritesheet

Si vous avez une spritesheet complète, vous pouvez :

1. Utiliser un outil en ligne comme :
   - https://www.leshylabs.com/apps/sstool/
   - https://ezgif.com/split

2. Ou utiliser un éditeur d'image comme GIMP ou Photoshop :
   - Ouvrir la spritesheet
   - Découper chaque sprite individuellement
   - Sauvegarder chaque partie dans le dossier approprié

## Étape 4 : Configurer les chemins dans le code

Une fois les sprites en place, mettre à jour `character-renderer.js` :

```javascript
this.spriteConfig = {
    body: {
        head: 'sprites/body/head_light.png',  // Adapter selon vos fichiers
        torso: 'sprites/body/torso.png',
        legs: 'sprites/body/legs.png',
        arms: 'sprites/body/arms.png'
    },
    hair: {
        short: 'sprites/hair/short_blonde.png',
        medium: 'sprites/hair/medium_blonde.png',
        // ... etc
    },
    clothes: {
        tshirt: 'sprites/clothes/tshirt_blue.png',
        // ... etc
    }
};
```

## Étape 5 : Tester

1. Ouvrir `index.html` dans le navigateur
2. Vérifier la console pour les erreurs de chargement
3. Les sprites devraient apparaître dans la prévisualisation

## Notes importantes

- **Licence** : CC-BY-SA 3.0 et GPLv3 - Penser à créditer les auteurs
- **Format** : Les sprites doivent être en PNG avec transparence
- **Taille** : Les sprites LPC font généralement 64x64 pixels par frame
- **Alignement** : S'assurer que les sprites sont alignés pour se superposer correctement

## Ressources utiles

- Générateur en ligne : https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/
- GitHub : https://github.com/makrohn/Universal-LPC-spritesheet
- Documentation : https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles


