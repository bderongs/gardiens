# 🚀 Guide d'intégration : Système de transitions entre cartes

## 📋 Étapes d'intégration

### 1. Ajouter le script dans `index.html`

Ajoutez le fichier `map-transitions.js` **avant** `script-phaser.js` :

```html
<!-- Dans index.html, avant script-phaser.js -->
<script src="map-transitions.js"></script>
<script src="script-phaser.js"></script>
```

### 2. Modifier `script-phaser.js`

#### A. Dans le constructeur de `GameScene`, ajoutez :

```javascript
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        // ... code existant ...
        
        // Initialiser le système de transitions
        this.initTransitions();
    }
}
```

#### B. Appliquez le mixin à `GameScene` :

```javascript
// Après la définition de la classe GameScene, ajoutez :
Object.assign(GameScene.prototype, MapTransitionMixin);
```

#### C. Dans la méthode `create()`, chargez les transitions :

```javascript
async create() {
    // ... code existant ...
    
    // Charger les transitions après le chargement de la carte
    if (this.mapData?.tilemap) {
        this.transitions = await loadTransitionsFromTMX(this.mapData.tilemap);
        console.log('Transitions chargées:', this.transitions);
    }
}
```

#### D. Dans la méthode `update()`, ajoutez la vérification :

```javascript
update() {
    // ... code existant pour le mouvement ...
    
    // Vérifier les transitions après le mouvement
    this.checkTransitions();
}
```

### 3. Modifier `loadMapForPhaser()` pour stocker le chemin

Dans `script-phaser.js`, modifiez la fonction `loadMapForPhaser()` :

```javascript
async function loadMapForPhaser() {
    // ... code existant ...
    
    const mapLoader = new TopDownTilemap();
    const loaded = await mapLoader.loadFromTMX('village.tmx');
    
    // Ajouter cette ligne pour stocker le chemin
    mapLoader.tmxPath = 'village.tmx';
    
    // ... reste du code ...
}
```

---

## 🎨 Configuration dans Tiled

### Créer une couche de transitions

1. Ouvrez `village.tmx` dans Tiled
2. Cliquez sur **"Add Object Layer"** (ou **"Ajouter couche d'objets"**)
3. Nommez-la **"Transitions"** ou **"Portes"**
4. Sélectionnez l'outil **Rectangle** (R)
5. Dessinez un rectangle sur la porte d'entrée d'une maison
6. Sélectionnez le rectangle et ajoutez des **propriétés** :
   - `targetMap` : `"maison.tmx"`
   - `targetDoorId` : `"entree-principale"` (optionnel - si non défini, utilisera la première porte trouvée)

### Dans `maison.tmx`

Créez deux choses :

**1. Une couche "Entrees" (ou "Portes")** pour définir où le joueur arrive :
1. Créez une couche d'objets nommée **"Entrees"** ou **"Portes"**
2. Dessinez un rectangle sur la porte d'entrée
3. (Optionnel) Ajoutez la propriété `doorId: "entree-principale"` pour identifier cette porte

**2. Une zone de transition pour sortir** :
1. Créez une couche "Transitions"
2. Dessinez un rectangle à la sortie
3. Ajoutez les propriétés :
   - `targetMap` : `"village.tmx"`
   - `targetDoorId` : `"porte-maison1"` (optionnel - si vous avez défini un doorId dans village.tmx)

---

## ✅ Test

1. Lancez le jeu
2. Déplacez votre personnage vers une porte
3. Le personnage devrait automatiquement changer de carte
4. Pour sortir, retournez vers la zone de sortie

---

## 🔧 Personnalisation

### Désactiver le fondu

Dans `map-transitions.js`, modifiez `triggerTransition()` :

```javascript
// Commentez ou supprimez ces lignes :
// this.cameras.main.fadeOut(300, 0, 0, 0);
// await new Promise(resolve => setTimeout(resolve, 300));
// ...
// this.cameras.main.fadeIn(300, 0, 0, 0);
```

### Ajouter un message d'aide

Dans `checkTransitions()`, vous pouvez afficher un message quand le joueur approche :

```javascript
checkTransitions() {
    // ... code existant ...
    
    // Afficher un message si proche
    let nearTransition = null;
    for (const transition of this.transitions) {
        const distance = Phaser.Math.Distance.Between(
            this.player.x / this.tilePixelSize,
            this.player.y / this.tilePixelSize,
            transition.x + transition.width / 2,
            transition.y + transition.height / 2
        );
        
        if (distance < 2) {
            nearTransition = transition;
            break;
        }
    }
    
    if (nearTransition && !this.transitionHint) {
        this.transitionHint = this.add.text(
            this.player.x,
            this.player.y - 40,
            'Appuyez sur E pour entrer',
            { fontSize: '14px', fill: '#ffffff', backgroundColor: '#000000' }
        ).setOrigin(0.5, 0.5).setDepth(2000);
    } else if (!nearTransition && this.transitionHint) {
        this.transitionHint.destroy();
        this.transitionHint = null;
    }
}
```

### Portes verrouillées

Dans Tiled, ajoutez la propriété `locked: true` à une transition. Le système affichera automatiquement un message.

---

## 🐛 Dépannage

### Les transitions ne se déclenchent pas

- Vérifiez que la couche "Transitions" existe dans le TMX
- Vérifiez que les propriétés sont bien définies
- Ouvrez la console (F12) et vérifiez les messages
- Vérifiez que `checkTransitions()` est appelé dans `update()`

### Le joueur se retrouve au mauvais endroit

- Vérifiez les coordonnées `targetX` et `targetY` dans Tiled
- Les coordonnées sont en **tuiles**, pas en pixels
- La position 0,0 est en haut à gauche

### La carte ne se charge pas

- Vérifiez que le fichier TMX existe
- Vérifiez le chemin dans `targetMap` (doit être relatif à la racine)
- Vérifiez la console pour les erreurs

---

## 📝 Résumé

1. ✅ Ajouter `map-transitions.js` dans `index.html`
2. ✅ Appliquer le mixin à `GameScene`
3. ✅ Appeler `initTransitions()` dans le constructeur
4. ✅ Charger les transitions dans `create()`
5. ✅ Appeler `checkTransitions()` dans `update()`
6. ✅ Configurer les zones dans Tiled
7. ✅ Tester !

---

## 🎉 C'est tout !

Votre système de transitions est maintenant opérationnel. Vous pouvez créer autant de maisons et de transitions que vous voulez !

