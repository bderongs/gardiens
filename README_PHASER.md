# Version Phaser - Expérimentation

## 🎯 Objectif

Cette branche (`phaser-experiment`) permet d'expérimenter avec Phaser 3 sans risquer de casser la version fonctionnelle actuelle.

## 📁 Fichiers

- **`index-phaser.html`** : Version HTML avec Phaser (au lieu de `index.html`)
- **`script-phaser.js`** : Script principal pour la version Phaser
- **`README_PHASER.md`** : Ce fichier

## 🚀 Utilisation

1. Ouvrir `index-phaser.html` dans votre navigateur
2. Ou utiliser un serveur local :
   ```bash
   python -m http.server 8000
   ```
   Puis ouvrir `http://localhost:8000/index-phaser.html`

## 🔄 Retour à la version originale

Pour revenir à la version vanilla JavaScript :
- Ouvrir `index.html` (au lieu de `index-phaser.html`)
- Ou changer de branche : `git checkout main`

## 📝 État actuel

Version minimale fonctionnelle :
- ✅ Phaser 3 chargé et initialisé
- ✅ Structure de base avec scènes
- ⏳ À faire : Migration des fonctionnalités existantes

## 🎮 Fonctionnalités à migrer

- [ ] Chargement de la carte TMX
- [ ] Rendu des tuiles
- [ ] Personnage principal avec animations
- [ ] NPCs avec déplacement
- [ ] Système de pouvoirs
- [ ] Personnalisation des personnages
- [ ] Gestion des collisions

## 💡 Notes

- Les assets existants (`sprites/`, `assets/`) sont réutilisés
- Le système de personnalisation peut être réutilisé tel quel
- Phaser gérera le rendu et les animations de manière plus optimisée


