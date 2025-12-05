# Guide : Gestion des transitions entre cartes (Village ↔ Maisons)

## 🎯 Concept général

Pour gérer les transitions entre différentes cartes (village, maisons, etc.), vous devez :

1. **Définir des zones de transition** dans vos cartes TMX (portes d'entrée)
2. **Détecter quand le joueur arrive sur une zone de transition**
3. **Charger la nouvelle carte** et positionner le joueur
4. **Gérer le retour** (sortir pour revenir à la carte précédente)

---

## 📋 Étape 1 : Définir les zones de transition dans Tiled

### Dans votre carte `village.tmx` :

1. Créez une **nouvelle couche d'objets** (Object Layer) nommée `"Transitions"` ou `"Portes"`
2. Placez des **rectangles** aux emplacements des portes d'entrée des maisons
3. Pour chaque rectangle, ajoutez des **propriétés personnalisées** :
   - `targetMap` : Le nom du fichier TMX de destination (ex: `"maison.tmx"`)
   - `targetDoorId` : (Optionnel) ID de la porte d'entrée dans la carte de destination. Si non défini, utilisera la première porte trouvée

### Exemple dans Tiled :

```
Couche "Transitions" (Object Layer)
  └─ Rectangle "Porte Maison 1"
      ├─ Position: (10, 15) - (12, 15)  (3 tuiles de large)
      └─ Propriétés:
          ├─ targetMap: "maison.tmx"
          └─ targetDoorId: "entree-principale"  (optionnel)
```

### Dans votre carte `maison.tmx` :

Créez simplement une zone de transition pour **sortir** :

```
Couche "Transitions" (Object Layer)
  └─ Rectangle "Sortie"
      ├─ Position: (15, 18) - (17, 18)  (sur la porte de sortie)
      └─ Propriétés:
          └─ targetMap: "village.tmx"
```

**C'est tout !** Le système trouvera automatiquement cette porte de sortie quand vous entrez dans la maison depuis le village. Pas besoin de définir une couche "Entrees" séparée.

> **Note** : Si vous avez plusieurs portes dans la maison, le système utilisera automatiquement celle qui mène vers la carte d'origine (village.tmx dans cet exemple).

---

## 💻 Étape 2 : Modifier le code pour charger les zones de transition

### A. Ajouter une fonction pour charger les transitions depuis le TMX

```javascript
// Dans script-phaser.js, ajoutez cette fonction
async function loadTransitionsFromTMX(tilemap) {
    const transitions = [];
    
    // Parcourir les couches d'objets du TMX
    if (tilemap.tmxData && tilemap.tmxData.objectgroup) {
        const objectGroups = Array.isArray(tilemap.tmxData.objectgroup) 
            ? tilemap.tmxData.objectgroup 
            : [tilemap.tmxData.objectgroup];
        
        for (const group of objectGroups) {
            // Chercher la couche "Transitions" ou "Portes"
            if (group.name === 'Transitions' || group.name === 'Portes') {
                const objects = Array.isArray(group.object) 
                    ? group.object 
                    : [group.object];
                
                for (const obj of objects) {
                    if (obj.properties) {
                        const props = {};
                        // Convertir les propriétés en objet simple
                        const propArray = Array.isArray(obj.properties.property)
                            ? obj.properties.property
                            : [obj.properties.property];
                        
                        propArray.forEach(prop => {
                            props[prop.name] = prop.value;
                        });
                        
                        // Calculer la zone en coordonnées de grille
                        const x = Math.floor(obj.x / 32); // 32 = tileSize
                        const y = Math.floor(obj.y / 32);
                        const width = Math.floor(obj.width / 32);
                        const height = Math.floor(obj.height / 32);
                        
                        transitions.push({
                            id: props.transitionId || `transition-${transitions.length}`,
                            x: x,
                            y: y,
                            width: width,
                            height: height,
                            targetMap: props.targetMap,
                            targetX: parseInt(props.targetX) || x,
                            targetY: parseInt(props.targetY) || y
                        });
                    }
                }
            }
        }
    }
    
    return transitions;
}
```

### B. Stocker les transitions dans GameScene

```javascript
// Dans la classe GameScene, ajoutez :
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        // ... code existant ...
        this.transitions = []; // Zones de transition
        this.currentMap = 'village.tmx'; // Carte actuelle
        this.mapHistory = []; // Historique pour le retour
    }
    
    async create() {
        // ... code existant ...
        
        // Charger les transitions après le chargement de la carte
        if (this.mapData?.tilemap) {
            this.transitions = await loadTransitionsFromTMX(this.mapData.tilemap);
            console.log('Transitions chargées:', this.transitions);
        }
    }
}
```

### C. Détecter quand le joueur entre dans une zone de transition

```javascript
// Dans la méthode update() de GameScene, ajoutez :
update() {
    // ... code existant pour le mouvement ...
    
    // Vérifier les transitions après le mouvement
    this.checkTransitions();
}

checkTransitions() {
    const tileSize = this.tilePixelSize;
    const playerGridX = Math.floor(this.player.x / tileSize);
    const playerGridY = Math.floor(this.player.y / tileSize);
    
    // Vérifier si le joueur est sur une zone de transition
    for (const transition of this.transitions) {
        if (playerGridX >= transition.x && 
            playerGridX < transition.x + transition.width &&
            playerGridY >= transition.y && 
            playerGridY < transition.y + transition.height) {
            
            // Transition détectée !
            this.triggerTransition(transition);
            return;
        }
    }
}
```

### D. Implémenter la transition vers une nouvelle carte

```javascript
// Dans GameScene, ajoutez cette méthode :
async triggerTransition(transition) {
    console.log('Transition vers:', transition.targetMap);
    
    // Empêcher les transitions multiples rapides
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    
    // Sauvegarder la position actuelle pour le retour
    this.mapHistory.push({
        map: this.currentMap,
        x: Math.floor(this.player.x / this.tilePixelSize),
        y: Math.floor(this.player.y / this.tilePixelSize)
    });
    
    // Effet de fondu (optionnel)
    this.cameras.main.fadeOut(300, 0, 0, 0);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Charger la nouvelle carte
    await this.loadMap(transition.targetMap);
    
    // Positionner le joueur à l'arrivée
    const targetPixelX = transition.targetX * this.tilePixelSize + this.tilePixelSize / 2;
    const targetPixelY = transition.targetY * this.tilePixelSize + this.tilePixelSize / 2;
    this.player.x = targetPixelX;
    this.player.y = targetPixelY;
    this.playerCharacter.container.x = targetPixelX;
    this.playerCharacter.container.y = targetPixelY;
    
    // Recharger les transitions pour la nouvelle carte
    if (this.mapData?.tilemap) {
        this.transitions = await loadTransitionsFromTMX(this.mapData.tilemap);
    }
    
    // Effet de fondu (optionnel)
    this.cameras.main.fadeIn(300, 0, 0, 0);
    
    this.isTransitioning = false;
    this.currentMap = transition.targetMap;
}

async loadMap(mapFileName) {
    console.log('Chargement de la carte:', mapFileName);
    
    // Détruire l'ancienne carte
    if (this.mapImage) {
        this.mapImage.destroy();
    }
    if (this.mapTexture && this.textures.exists('mapTexture')) {
        this.textures.remove('mapTexture');
    }
    
    // Charger la nouvelle carte
    const mapLoader = new TopDownTilemap();
    const loaded = await mapLoader.loadFromTMX(mapFileName);
    
    if (!loaded) {
        console.error('Impossible de charger la carte:', mapFileName);
        return;
    }
    
    // Pré-rendre la nouvelle carte
    await mapLoader.prerender(1);
    
    // Mettre à jour mapData
    this.mapData = {
        width: mapLoader.width,
        height: mapLoader.height,
        tileSize: mapLoader.tmxTileWidth || 32,
        tilemap: mapLoader,
        prerenderCanvas: mapLoader.offscreenCanvas
    };
    
    // Recréer la visualisation de la carte
    this.createMapVisualization(
        this.mapData.width, 
        this.mapData.height, 
        this.mapData.tileSize
    );
    
    // Ajuster la caméra à la nouvelle carte
    this.cameras.main.setBounds(
        0, 
        0, 
        this.mapData.width * this.mapData.tileSize, 
        this.mapData.height * this.mapData.tileSize
    );
}
```

---

## 🔄 Étape 3 : Gérer le retour (sortir d'une maison)

### Option A : Transition automatique (recommandé)

Quand vous créez la zone de sortie dans `maison.tmx`, utilisez les mêmes coordonnées que l'entrée dans `village.tmx` :

```javascript
// Dans maison.tmx, zone de sortie :
targetMap: "village.tmx"
targetX: 10  // Même position que l'entrée dans village.tmx
targetY: 15
```

Le système fonctionnera automatiquement dans les deux sens !

### Option B : Bouton de retour

Ajoutez un bouton pour revenir à la carte précédente :

```javascript
// Dans GameScene
goBackToPreviousMap() {
    if (this.mapHistory.length === 0) return;
    
    const previous = this.mapHistory.pop();
    const transition = {
        targetMap: previous.map,
        targetX: previous.x,
        targetY: previous.y
    };
    
    this.triggerTransition(transition);
}
```

---

## 🎨 Étape 4 : Améliorations visuelles (optionnel)

### A. Afficher un indicateur visuel sur les portes

```javascript
// Dans create(), après avoir chargé les transitions
createTransitionIndicators() {
    this.transitionIndicators = [];
    
    for (const transition of this.transitions) {
        const x = (transition.x + transition.width / 2) * this.tilePixelSize;
        const y = transition.y * this.tilePixelSize;
        
        // Créer un sprite d'indicateur (ex: flèche, icône de porte)
        const indicator = this.add.sprite(x, y, 'transition-indicator')
            .setOrigin(0.5, 0.5)
            .setDepth(1000)
            .setAlpha(0.7)
            .setScale(0.5);
        
        // Animation de pulsation
        this.tweens.add({
            targets: indicator,
            alpha: { from: 0.5, to: 1 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        this.transitionIndicators.push(indicator);
    }
}
```

### B. Message d'aide

```javascript
// Afficher un message quand le joueur approche d'une porte
checkTransitions() {
    // ... code existant ...
    
    // Afficher un message si proche d'une transition
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

---

## 📝 Résumé des modifications à faire

1. **Dans Tiled** : Créer des couches d'objets "Transitions" avec des rectangles et propriétés
2. **Dans `script-phaser.js`** :
   - Ajouter `loadTransitionsFromTMX()`
   - Ajouter `transitions`, `currentMap`, `mapHistory` dans `GameScene`
   - Ajouter `checkTransitions()` dans `update()`
   - Ajouter `triggerTransition()` et `loadMap()`
3. **Tester** : Vérifier que les transitions fonctionnent dans les deux sens

---

## 🐛 Dépannage

### Les transitions ne se déclenchent pas
- Vérifiez que la couche "Transitions" existe dans le TMX
- Vérifiez que les propriétés sont bien définies dans Tiled
- Ajoutez des `console.log()` pour déboguer

### Le joueur se retrouve au mauvais endroit
- Vérifiez les coordonnées `targetX` et `targetY` dans Tiled
- Les coordonnées sont en **tuiles**, pas en pixels

### La carte ne se charge pas
- Vérifiez que le fichier TMX existe dans le bon dossier
- Vérifiez les chemins dans `loadFromTMX()`

---

## 🚀 Prochaines étapes

Une fois que les transitions de base fonctionnent, vous pouvez :
- Ajouter des animations de transition (fondu, effet de porte)
- Gérer plusieurs maisons avec des identifiants uniques
- Ajouter des conditions (porte verrouillée, besoin d'une clé)
- Sauvegarder la position du joueur entre les cartes

