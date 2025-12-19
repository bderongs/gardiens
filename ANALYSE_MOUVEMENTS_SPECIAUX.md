# Analyse : Mouvements Spéciaux pour les Personnages

## 📋 État Actuel du Système

### Animations Disponibles
Le système utilise actuellement les sprites LPC (Liberated Pixel Cup) avec les animations suivantes :

- **Idle (Repos)** : Lignes 0-3 (spellcast) - 4 directions (north, west, south, east)
- **Walk (Marche)** : Lignes 8-11 (walkcycle) - 4 directions

### Contrôles Actuels
- **Flèches directionnelles** : Déplacement
- **Espace** : Activer les pouvoirs
- **E** : Interagir avec les NPCs

## 🎮 Mouvements Demandés

### 1. Saut (Jump)
**Faisabilité** : ⚠️ **Partiellement faisable**

**Explication** :
- Les sprites LPC standards ne contiennent pas toujours une animation de saut dédiée
- **Solution possible** : 
  - Utiliser l'animation "spellcast" (idle) vers le haut pour simuler un saut
  - Ou utiliser les frames de "hurt" (si disponibles) pour un effet de "rebond"
  - **Alternative** : Si les sprites contiennent une animation de saut (ligne 12-15 ou autre), l'utiliser

**Implémentation suggérée** :
- Touche **Z** ou **J** pour sauter
- Animation vers le haut (direction "north") avec un effet de mouvement vertical
- Durée : ~0.5 seconde
- Peut traverser certaines obstacles temporairement

### 2. Sprint (Course rapide)
**Faisabilité** : ✅ **Très faisable**

**Explication** :
- Pas besoin d'animation dédiée ! 
- Utiliser l'animation "walk" existante mais à une vitesse plus rapide
- Augmenter la vitesse de déplacement et la vitesse d'animation

**Implémentation suggérée** :
- Maintenir **SHIFT** pendant le déplacement
- Vitesse de déplacement : 2.0 → 4.0 pixels/frame (double)
- Frame rate d'animation : 10 → 15 fps (plus rapide)
- Consommation d'endurance (optionnel pour plus tard)

### 3. Mouvement de Joie ("Joy Move")
**Faisability** : ⚠️ **Faisable avec adaptation**

**Explication** :
- Les sprites LPC standards n'ont pas d'animation "joie" dédiée
- **Solutions possibles** :
  1. Utiliser l'animation "spellcast" (idle) dans une direction avec répétition rapide
  2. Utiliser l'animation "slash" (si disponible) pour un geste de victoire
  3. Créer une animation simple avec les frames existantes (saut + rotation)

**Implémentation suggérée** :
- Touche **C** ou **V** pour le mouvement de joie
- Animation : Séquence rapide de frames idle avec un léger saut/bond
- Durée : ~1 seconde
- Ne bloque pas le mouvement pendant l'animation

## 🔧 Structure des Sprites LPC

Les sprites LPC sont organisés en **spritesheet de 832×1344 pixels** :
- **13 colonnes** × **21 lignes** de frames
- Chaque frame fait **64×64 pixels**

### Layout Standard LPC (à vérifier dans vos sprites) :
```
Row 0-3:   spellcast (idle) - 4 directions
Row 4-7:   (variable selon les sprites)
Row 8-11:  walkcycle (walk) - 4 directions  ✅ Utilisé
Row 12-15: (variable : slash, thrust, shoot, hurt)
Row 16-19: (variable)
Row 20:    (variable)
```

## 📝 Plan d'Implémentation

### Phase 1 : Sprint (Plus simple)
1. ✅ Détecter la touche SHIFT maintenue
2. ✅ Modifier la vitesse de déplacement
3. ✅ Modifier la vitesse d'animation
4. ✅ Mettre à jour `updateCharacterAnimation` pour gérer le sprint

### Phase 2 : Saut
1. ✅ Ajouter la touche Z ou J
2. ✅ Créer l'état "jumping"
3. ✅ Animation vers le haut avec mouvement vertical
4. ✅ Timer pour la durée du saut
5. ⚠️ Vérifier si animation jump existe dans les sprites

### Phase 3 : Mouvement de Joie
1. ✅ Ajouter la touche C ou V
2. ✅ Créer l'animation "joy" (adapter selon sprites disponibles)
3. ✅ Timer pour la durée
4. ✅ Ne pas bloquer le mouvement

## 🎯 Recommandation

**Commencez par le Sprint** car :
- ✅ Pas besoin de nouvelles animations
- ✅ Facile à implémenter
- ✅ Améliore immédiatement l'expérience de jeu

Ensuite, testez **le saut** pour voir si les sprites contiennent une animation appropriée. Si non, on peut utiliser une simulation simple.

Pour **le mouvement de joie**, on peut créer une séquence d'animation créative avec les frames existantes.

---

## ✅ IMPLÉMENTATION TERMINÉE

### Contrôles Ajoutés :
- **SHIFT** (maintenir) : Sprint - double la vitesse de déplacement
- **Z** : Saut - animation de saut avec mouvement vertical
- **C** : Mouvement de joie - animation expressive

### Détails Techniques :

1. **Sprint** :
   - Double la vitesse de base (2.0 → 4.0 pixels/frame)
   - Animation walk plus rapide (10 → 18 fps)
   - Active uniquement en se déplaçant
   - Se désactive automatiquement pendant saut ou joie

2. **Saut** :
   - Durée : 500ms
   - Hauteur : 20 pixels (visuel uniquement, n'affecte pas les collisions)
   - Animation : utilise les frames idle vers le haut
   - Peut être combiné avec le mouvement horizontal
   - Le déplacement horizontal continue pendant le saut

3. **Mouvement de Joie** :
   - Durée : 1000ms
   - Animation : séquence rapide des 3 premières frames idle avec effet yoyo
   - Répète 3 fois pour un effet visible
   - Ne bloque pas le mouvement (animation non-bloquante)

### Priorité des Animations :
1. Joie (priorité maximale)
2. Saut
3. Sprint
4. Marche
5. Idle (par défaut)

### Notes Techniques :
- Les animations utilisent les sprites LPC existants
- Le saut est purement visuel (ne modifie pas la grille de collision)
- Le sprint peut être utilisé avec toutes les directions
- Toutes les animations sont gérées par le système Phaser
- Les états sont mutuellement exclusifs (sprint se désactive pendant saut/joie)

### Améliorations Possibles (futures) :
- Système d'endurance pour le sprint
- Saut avec capacité à traverser certains obstacles bas
- Plusieurs types de mouvements expressifs (joie, tristesse, colère, etc.)
- Combinaison de mouvements (saut + sprint = saut long)

