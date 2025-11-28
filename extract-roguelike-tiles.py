#!/usr/bin/env python3
"""
Script pour extraire les tuiles individuelles de la spritesheet Roguelike/RPG
et les organiser dans les dossiers Base/, Dungeon/, Indoor/
"""

import os
from PIL import Image

SPRITESHEET_PATH = "/tmp/kenney-extract/Spritesheet/roguelikeSheet_transparent.png"
TARGET_DIR = "assets/roguelike-rpg"
TILE_SIZE = 16
SPACING = 1  # Espacement entre les tuiles dans la spritesheet

# Mapping approximatif des tuiles (basé sur la structure typique des spritesheets roguelike)
# Les tuiles sont organisées en lignes dans la spritesheet
# Ligne 0-2: Base (herbe, terre, pierre, etc.)
# Ligne 3-5: Indoor (sol, murs intérieurs, etc.)
# Ligne 6-8: Dungeon (murs de donjon, sol de donjon, etc.)

def extract_tiles():
    """Extrait toutes les tuiles de la spritesheet"""
    
    if not os.path.exists(SPRITESHEET_PATH):
        print(f"❌ Spritesheet non trouvée: {SPRITESHEET_PATH}")
        return False
    
    # Créer les dossiers
    for folder in ['Base', 'Dungeon', 'Indoor']:
        os.makedirs(f"{TARGET_DIR}/{folder}", exist_ok=True)
    
    # Charger la spritesheet
    img = Image.open(SPRITESHEET_PATH)
    width, height = img.size
    
    print(f"📦 Spritesheet: {width}x{height} pixels")
    print(f"📐 Taille des tuiles: {TILE_SIZE}x{TILE_SIZE}")
    
    # Calculer le nombre de tuiles par ligne et colonne
    tiles_per_row = (width + SPACING) // (TILE_SIZE + SPACING)
    tiles_per_col = (height + SPACING) // (TILE_SIZE + SPACING)
    
    print(f"📊 Tuiles: {tiles_per_row} x {tiles_per_col} = {tiles_per_row * tiles_per_col}")
    
    tile_count = 0
    
    # Extraire toutes les tuiles
    for row in range(tiles_per_col):
        for col in range(tiles_per_row):
            # Calculer la position dans la spritesheet
            x = col * (TILE_SIZE + SPACING)
            y = row * (TILE_SIZE + SPACING)
            
            # Extraire la tuile
            tile = img.crop((x, y, x + TILE_SIZE, y + TILE_SIZE))
            
            # Déterminer le dossier (approximation basée sur la position)
            if row < 3:
                folder = 'Base'
            elif row < 6:
                folder = 'Indoor'
            else:
                folder = 'Dungeon'
            
            # Nom du fichier (format: tile_XXXX.png)
            tile_num = row * tiles_per_row + col
            filename = f"tile_{tile_num:04d}.png"
            filepath = f"{TARGET_DIR}/{folder}/{filename}"
            
            # Sauvegarder
            tile.save(filepath)
            tile_count += 1
    
    print(f"✅ {tile_count} tuiles extraites dans {TARGET_DIR}/")
    return True

if __name__ == "__main__":
    extract_tiles()


