# Migration vers le système Top-Down

## Changements effectués

Le système a été refondu pour utiliser le pack **Roguelike/RPG** de Kenney au lieu du système isométrique.

### Nouveaux fichiers

1. **`sprites/topdown-renderer.js`** : Système de rendu top-down pour les tuiles 16x16
2. **`sprites/topdown-tilemap.js`** : Gestion de la tilemap top-down avec création de château et maison
3. **`assets/roguelike-rpg/README.md`** : Instructions pour télécharger le pack

### Fichiers modifiés

1. **`index.html`** : 
   - Remplacement des scripts isométriques par les scripts top-down
   - Mise à jour du texte d'aide

2. **`script.js`** :
   - Fonction `initializeGameCanvas()` complètement refondue pour le top-down
   - Utilisation de `topDownRenderer` et `topDownTilemap` au lieu des versions isométriques
   - Échelle d'affichage : 2x (tuiles 16x16 affichées en 32x32)

### Fonctionnalités

- **Carte 30x30** avec :
  - Un château au centre (10x10 tuiles)
  - Une maison en haut à gauche (6x6 tuiles)
  - Des arbres autour de la carte
  - Herbe comme sol de base

- **Détection de collision** : Les murs et bâtiments ne sont pas traversables

- **Portes** : Le château et la maison ont des portes (traversables)

## Prochaines étapes

1. **Télécharger le pack** depuis https://kenney.nl/assets/roguelike-rpg-pack
2. **Extraire** le contenu dans `assets/roguelike-rpg/`
3. **Tester** le jeu pour vérifier que les tuiles s'affichent correctement

## Notes

- Les tuiles du pack sont en 16x16 pixels
- Affichage à l'écran : 32x32 pixels (échelle 2x)
- Le personnage utilise toujours les sprites LPC (système de personnages inchangé)


