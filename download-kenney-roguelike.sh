#!/bin/bash

# Script pour télécharger et installer le pack Roguelike/RPG de Kenney
# Le pack doit être téléchargé manuellement depuis itch.io

echo "📦 Installation du pack Roguelike/RPG de Kenney"
echo ""
echo "Le téléchargement automatique ne fonctionne pas car le site nécessite une interaction."
echo ""
echo "📥 Instructions manuelles :"
echo "   1. Allez sur : https://kenney.itch.io/roguelike-rpg-pack"
echo "   2. Cliquez sur 'Download' (gratuit)"
echo "   3. Téléchargez le fichier ZIP"
echo "   4. Extrayez-le"
echo "   5. Copiez les dossiers Base/, Dungeon/, Indoor/ dans assets/roguelike-rpg/"
echo ""
echo "Ou utilisez cette commande après avoir téléchargé le ZIP :"
echo "   unzip -q ~/Downloads/roguelike-rpg-pack.zip -d /tmp/kenney-extract"
echo "   cp -r /tmp/kenney-extract/*/Base assets/roguelike-rpg/ 2>/dev/null"
echo "   cp -r /tmp/kenney-extract/*/Dungeon assets/roguelike-rpg/ 2>/dev/null"
echo "   cp -r /tmp/kenney-extract/*/Indoor assets/roguelike-rpg/ 2>/dev/null"
echo ""

# Créer le dossier cible
mkdir -p assets/roguelike-rpg

# Vérifier si les dossiers existent déjà
if [ -d "assets/roguelike-rpg/Base" ] && [ -d "assets/roguelike-rpg/Dungeon" ] && [ -d "assets/roguelike-rpg/Indoor" ]; then
    echo "✅ Les dossiers Base/, Dungeon/, Indoor/ existent déjà !"
    echo "   Vérification des fichiers..."
    FILE_COUNT=$(find assets/roguelike-rpg -name "*.png" | wc -l)
    if [ "$FILE_COUNT" -gt 0 ]; then
        echo "✅ $FILE_COUNT fichiers PNG trouvés !"
        exit 0
    else
        echo "⚠️  Les dossiers existent mais sont vides"
    fi
else
    echo "❌ Les dossiers Base/, Dungeon/, Indoor/ n'existent pas"
    echo "   Veuillez suivre les instructions ci-dessus"
fi


