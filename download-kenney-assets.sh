#!/bin/bash
# Script pour télécharger les Isometric Prototypes Tiles de Kenney

echo "📦 Téléchargement des Isometric Prototypes Tiles de Kenney..."
echo ""

# Créer le dossier de destination
mkdir -p assets/isometric/tiles
cd assets/isometric

# URL du pack (itch.io nécessite une interaction, donc on essaie OpenGameArt)
echo "Tentative de téléchargement depuis OpenGameArt..."

# Essayer de télécharger depuis OpenGameArt si disponible
# Note: Les assets Kenney sont généralement sur itch.io et nécessitent un téléchargement manuel

echo ""
echo "⚠️  Téléchargement automatique non disponible"
echo ""
echo "📥 Instructions pour télécharger manuellement :"
echo ""
echo "1. Allez sur : https://kenney-assets.itch.io/isometric-prototypes-tiles"
echo "2. Cliquez sur 'Download Now' (vous pouvez mettre 0€ pour gratuit)"
echo "3. Extrayez le fichier ZIP"
echo "4. Copiez les fichiers PNG des tuiles dans : assets/isometric/tiles/"
echo ""
echo "Structure attendue :"
echo "  assets/isometric/tiles/"
echo "    ├── floor_*.png"
echo "    ├── wall_*.png"
echo "    └── door_*.png"
echo ""
echo "Une fois les fichiers en place, le jeu les chargera automatiquement !"


