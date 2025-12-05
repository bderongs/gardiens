# 📝 Résumé simplifié : Système de transitions

## 🎯 Concept

Au lieu de définir manuellement les coordonnées d'arrivée, le système utilise des **points d'entrée** définis dans chaque carte.

## 📋 Configuration dans Tiled

### Carte source (ex: `village.tmx`)

**Couche "Transitions"** :
- Rectangle sur la porte
- Propriétés :
  - `targetMap: "maison.tmx"`
  - `targetDoorId: "entree-principale"` (optionnel)

### Carte destination (ex: `maison.tmx`)

**Couche "Transitions"** (pour sortir) :
- Rectangle sur la sortie
- Propriétés :
  - `targetMap: "village.tmx"`

**C'est tout !** Le système trouve automatiquement cette porte quand vous entrez dans la maison.

## ✅ Avantages

- ✅ **Ultra simple** : Pas besoin de définir de couche "Entrees" séparée
- ✅ **Auto-détection intelligente** : Trouve automatiquement la porte de sortie qui mène vers la carte d'origine
- ✅ **Plus flexible** : Déplacez la porte dans Tiled, ça fonctionne automatiquement
- ✅ **Moins de configuration** : Juste définir les transitions dans chaque carte

## 🔄 Fonctionnement

1. Joueur entre dans une zone de transition → charge `targetMap`
2. Système cherche automatiquement la transition inverse dans la nouvelle carte
   - Exemple : Si on vient de `village.tmx`, cherche la transition vers `village.tmx` dans `maison.tmx`
3. Utilise cette porte de sortie comme point d'entrée
4. Positionne le joueur au centre de cette porte
5. Si pas de transition inverse trouvée, utilise la première porte d'entrée disponible (fallback)

## 💡 Exemple concret

**village.tmx** :
```
Transitions:
  - Rectangle sur porte maison → targetMap: "maison.tmx"
```

**maison.tmx** :
```
Transitions:
  - Rectangle sur sortie → targetMap: "village.tmx"
```

C'est tout ! Le système trouve automatiquement la porte de sortie vers `village.tmx` et l'utilise comme point d'entrée.

