#!/usr/bin/env python3
"""
Script pour télécharger le pack Roguelike/RPG de Kenney
"""

import os
import sys
import zipfile
import urllib.request
import shutil

# URL du pack (itch.io)
# Note: Le téléchargement direct nécessite souvent une interaction utilisateur
# Ce script va essayer de télécharger depuis un lien direct si disponible

DOWNLOAD_URL = "https://kenney.itch.io/roguelike-rpg-pack"
TARGET_DIR = "assets/roguelike-rpg"
TEMP_ZIP = "/tmp/roguelike-rpg-pack.zip"

print("📦 Téléchargement du pack Roguelike/RPG de Kenney...")
print("⚠️  Note: Le téléchargement automatique peut ne pas fonctionner.")
print("   Si c'est le cas, téléchargez manuellement depuis:")
print("   https://kenney.nl/assets/roguelike-rpg-pack")
print("   Puis extrayez dans:", TARGET_DIR)
print()

# Créer le dossier cible
os.makedirs(TARGET_DIR, exist_ok=True)

# Essayer de télécharger (peut ne pas fonctionner sans interaction)
try:
    print("Tentative de téléchargement...")
    urllib.request.urlretrieve(DOWNLOAD_URL, TEMP_ZIP)
    print("✅ Téléchargement réussi")
    
    # Extraire
    if os.path.exists(TEMP_ZIP):
        print("Extraction en cours...")
        with zipfile.ZipFile(TEMP_ZIP, 'r') as zip_ref:
            zip_ref.extractall("/tmp/roguelike-extracted")
        
        # Trouver les dossiers Base, Dungeon, Indoor
        extracted_dir = "/tmp/roguelike-extracted"
        for root, dirs, files in os.walk(extracted_dir):
            if 'Base' in dirs or 'Dungeon' in dirs or 'Indoor' in dirs:
                # Copier les dossiers
                for folder in ['Base', 'Dungeon', 'Indoor']:
                    src = os.path.join(root, folder)
                    if os.path.exists(src):
                        dst = os.path.join(TARGET_DIR, folder)
                        if os.path.exists(dst):
                            shutil.rmtree(dst)
                        shutil.copytree(src, dst)
                        print(f"✅ Dossier {folder} copié")
                break
        
        print("✅ Pack installé dans", TARGET_DIR)
        os.remove(TEMP_ZIP)
        shutil.rmtree("/tmp/roguelike-extracted", ignore_errors=True)
    else:
        print("❌ Fichier ZIP non trouvé")
        sys.exit(1)
        
except Exception as e:
    print(f"❌ Erreur: {e}")
    print("\n📥 Téléchargement manuel requis:")
    print("   1. Allez sur https://kenney.nl/assets/roguelike-rpg-pack")
    print("   2. Cliquez sur 'Download'")
    print("   3. Extrayez le ZIP")
    print(f"   4. Copiez les dossiers Base/, Dungeon/, Indoor/ dans {TARGET_DIR}/")
    sys.exit(1)


