#!/bin/bash
# Script pour démarrer un serveur HTTP local simple
# Résout les problèmes CORS avec file://

echo "🚀 Démarrage du serveur local..."
echo "📂 Le jeu sera accessible sur http://localhost:8000"
echo "🛑 Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Vérifier si Python 3 est disponible
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8000
else
    echo "❌ Python n'est pas installé. Installez Python pour utiliser ce script."
    echo ""
    echo "Alternative : Utilisez un autre serveur HTTP local comme :"
    echo "  - npx http-server (si Node.js est installé)"
    echo "  - php -S localhost:8000 (si PHP est installé)"
    exit 1
fi


