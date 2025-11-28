# Système de Sprites Universal LPC - Configuration Finale

## ✅ Ce qui a été fait

1. **Repository téléchargé** : Le repository Universal LPC a été cloné dans `lpc-sprites-temp/`

2. **Sprites copiés** : Les sprites de base ont été copiés dans `sprites/` :
   - Corps (body) : female_light.png, male_light.png, male_tanned.png, male_dark.png
   - Cheveux (hair) : plusieurs styles et couleurs
   - Vêtements (clothes) : shirt et dress de base

3. **Configuration des personnages** : `sprites/characters-config.json` contient les configurations prédéfinies pour :
   - Sophie Foster
   - Fitz Vacker
   - Keefe Sencen
   - Dex Dizznee
   - Biana Vacker
   - Tam Song

4. **Système mis à jour** : Le `character-renderer.js` utilise maintenant :
   - La configuration prédéfinie si un characterId est fourni
   - Les sprites LPC au lieu du rendu Canvas
   - Un système permettant de changer les sprites

## 📁 Structure des fichiers

```
sprites/
├── body/
│   ├── female_light.png
│   ├── male_light.png
│   ├── male_tanned.png
│   └── male_dark.png
├── hair/
│   ├── female_long_blonde.png
│   ├── female_long_brunette.png
│   ├── male_short_blonde.png
│   ├── male_short_brunette.png
│   ├── male_short_redhead.png
│   └── male_messy_blonde.png
├── clothes/
│   ├── female_dress.png
│   └── male_shirt_white.png
├── characters-config.json  (configurations prédéfinies)
└── available-sprites.json  (liste des sprites disponibles)
```

## 🎮 Utilisation

### Personnages prédéfinis

Quand vous sélectionnez un personnage (Sophie, Fitz, etc.), le système utilise automatiquement les sprites configurés dans `characters-config.json`.

### Changer les sprites

Pour changer les sprites d'un personnage, vous pouvez :

1. **Modifier `characters-config.json`** directement :
```json
{
  "sophie": {
    "sprites": {
      "body": "sprites/body/female_light.png",
      "hair": "sprites/hair/female_long_blonde.png",
      "clothes": "sprites/clothes/female_dress.png"
    }
  }
}
```

2. **Ajouter de nouveaux sprites** :
   - Copier des sprites depuis `lpc-sprites-temp/` vers `sprites/`
   - Mettre à jour la configuration

3. **Utiliser le code JavaScript** :
```javascript
characterRenderer.updateCharacterSprites('sophie', {
    hair: 'sprites/hair/female_long_brunette.png'
});
```

## 📦 Ajouter plus de sprites

Le repository complet est dans `lpc-sprites-temp/`. Pour ajouter plus de sprites :

1. Explorer `lpc-sprites-temp/hair/` pour les cheveux
2. Explorer `lpc-sprites-temp/torso/` pour les vêtements
3. Explorer `lpc-sprites-temp/body/` pour les corps
4. Copier les sprites souhaités dans `sprites/`
5. Mettre à jour `characters-config.json` ou `available-sprites.json`

## 🔧 Format des sprites LPC

Les sprites LPC sont des **spritesheets** de 832x1344 pixels contenant :
- 13 colonnes × 21 lignes de frames
- Chaque frame fait 64×64 pixels
- Différentes animations (idle, walk, attack, etc.)

Le système extrait automatiquement la première frame (idle) pour l'affichage.

## 📝 Notes

- Les sprites sont chargés de manière asynchrone avec cache
- Si un sprite n'est pas trouvé, le système utilise le rendu Canvas de secours
- Les configurations peuvent être modifiées à tout moment

## 🗑️ Nettoyage (optionnel)

Une fois que vous avez copié tous les sprites nécessaires, vous pouvez supprimer le repository temporaire :
```bash
rm -rf lpc-sprites-temp/
```

Cela libère ~70 MB d'espace disque.


