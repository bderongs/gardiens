# Pack Roguelike/RPG de Kenney

## Téléchargement

Le pack Roguelike/RPG de Kenney doit être téléchargé depuis :
https://kenney.nl/assets/roguelike-rpg-pack

## Installation

1. Téléchargez le pack depuis le site de Kenney
2. Extrayez le contenu dans ce dossier (`assets/roguelike-rpg/`)
3. La structure attendue est :
   ```
   assets/roguelike-rpg/
     ├── Base/
     │   ├── tile_0000.png (herbe)
     │   ├── tile_0001.png (terre)
     │   └── ...
     ├── Dungeon/
     │   ├── tile_0000.png (mur de château)
     │   ├── tile_0001.png (sol de château)
     │   └── ...
     └── Indoor/
         ├── tile_0000.png (sol de maison)
         ├── tile_0045.png (mur de maison)
         └── ...
   ```

## Utilisation

Le système utilise automatiquement les tuiles du pack pour créer :
- Un château au centre de la carte
- Une maison en haut à gauche
- Des arbres autour de la carte

Les tuiles sont affichées à une échelle de 2x (16x16 pixels -> 32x32 pixels à l'écran).


