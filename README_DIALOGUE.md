# Système de Dialogue avec LLM

Ce système permet aux personnages NPC de parler avec le joueur, comme dans les Sims. Les dialogues sont générés dynamiquement par un LLM (Language Model) basé sur la personnalité de chaque personnage et le contexte des livres "Les Gardiens des Cités Perdues".

## Fonctionnalités

- **Dialogues contextuels** : Les personnages parlent selon leur personnalité (Sophie, Fitz, Keefe, etc.)
- **Choix de réponses** : Le joueur peut choisir comment répondre (amicalement, avec humour, méchamment, etc.)
- **Génération dynamique** : Les dialogues sont générés en temps réel par un LLM
- **Détection de proximité** : Les conversations s'initient automatiquement quand le joueur s'approche d'un NPC

## Configuration

### Configuration automatique (Recommandé)

Le système est configuré pour utiliser **OpenAI avec gpt-4o-mini** (le modèle le plus récent et économique).

1. Éditez le fichier `config-api.js` et remplacez `OPENAI_API_KEY` par votre clé API
2. La clé sera automatiquement chargée au démarrage du jeu
3. **Note importante** : `config-api.js` est dans `.gitignore` pour protéger votre clé API

### Configuration manuelle (Alternative)

Si vous préférez configurer manuellement :

1. Dans la console du navigateur (F12), exécutez :
   ```javascript
   localStorage.setItem('llm_api_key', 'votre_cle_openai_ici');
   ```
2. Rechargez la page

### Option alternative : Groq (Gratuit)

1. Créez un compte sur [Groq Console](https://console.groq.com/)
2. Générez une clé API
3. Modifiez `services/dialogue-service.js` pour changer `this.provider = 'groq'` (ligne 13)
4. Configurez la clé via `config-api.js` ou `localStorage`

### Note sur GPT-5

**GPT-5 n'existe pas encore** (en 2024). Le système utilise **gpt-4o-mini** qui est :
- Le modèle le plus récent d'OpenAI
- Très économique (~$0.15 par million de tokens d'entrée)
- Rapide et performant pour les dialogues

## Utilisation

1. Approchez-vous d'un NPC (personnage non-joueur) dans le jeu
2. Le dialogue s'initie automatiquement quand vous êtes proche
3. Choisissez une réponse parmi les options proposées
4. Le NPC répond selon votre choix et sa personnalité
5. Vous pouvez continuer la conversation ou la terminer

## Personnalités des Personnages

Chaque personnage a une personnalité unique basée sur les livres :

- **Sophie Foster** : Curieuse, courageuse, déterminée, loyale
- **Fitz Vacker** : Fier, loyal, impulsif, passionné
- **Keefe Sencen** : Drôle, espiègle, charismatique, rebelle
- **Dex Dizznee** : Créatif, inventif, optimiste, amical
- **Biana Vacker** : Élégante, confiante, intelligente, franche
- **Tam Song** : Mystérieux, réservé, sarcastique, loyal

## Architecture

- `services/dialogue-service.js` : Service de dialogue avec LLM
- `script-phaser.js` : Intégration dans la scène Phaser (méthodes `checkNPCProximity()`, `startDialogue()`, etc.)
- `index-phaser.html` : Interface utilisateur du dialogue

## Coûts

- **Groq** : Gratuit jusqu'à un certain quota (généralement suffisant pour le développement)
- **OpenAI gpt-4o-mini** : ~$0.15 par million de tokens d'entrée, ~$0.60 par million de tokens de sortie (très économique)
  - Un dialogue typique utilise environ 200-500 tokens, soit ~$0.0001-0.0003 par dialogue

## Dépannage

Si les dialogues ne fonctionnent pas :

1. Vérifiez que la clé API est bien définie : `localStorage.getItem('llm_api_key')`
2. Ouvrez la console (F12) pour voir les erreurs
3. Vérifiez que le service de dialogue est chargé : `window.DialogueService` doit exister
4. Vérifiez que vous êtes proche d'un NPC (distance de 2 cases)

