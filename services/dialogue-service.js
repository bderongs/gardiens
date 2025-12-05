/**
 * Service de dialogue avec LLM pour les Gardiens des Cités Perdues
 * Génère des dialogues contextuels basés sur les personnages et leurs personnalités
 * 
 * Utilise Groq (gratuit et rapide) ou OpenAI gpt-4o-mini (récent et économique)
 * Note: GPT-5 n'existe pas encore, gpt-4o-mini est le modèle le plus récent et économique
 */

class DialogueService {
    constructor() {
        // Configuration : utiliser Groq (gratuit) ou OpenAI (pas cher)
        // Pour Groq : https://console.groq.com/keys
        // Pour OpenAI : https://platform.openai.com/api-keys
        this.provider = 'openai'; // 'groq' ou 'openai'
        this.apiKey = null; // À définir via setApiKey() (pour développement local)
        
        // Détecter si on est sur Netlify (production) ou en local
        this.isNetlify = window.location.hostname.includes('netlify.app') || 
                         window.location.hostname.includes('netlify.com');
        
        // En production sur Netlify, utiliser la fonction proxy
        // En développement local, utiliser l'API directe
        if (this.isNetlify) {
            this.baseURL = '/.netlify/functions/dialogue-proxy';
        } else {
            this.baseURL = this.provider === 'groq' 
                ? 'https://api.groq.com/openai/v1'
                : 'https://api.openai.com/v1';
        }
        
        this.model = this.provider === 'groq'
            ? 'llama-3.1-8b-instant' // Modèle rapide et gratuit
            : 'gpt-4o-mini'; // Modèle récent et économique d'OpenAI (GPT-5 n'existe pas encore)
        
        // Personnalités enrichies des personnages basées sur les livres avec biographies détaillées
        this.characterPersonalities = {
            sophie: {
                name: 'Sophie Foster',
                personality: 'Sophie est une télépathe exceptionnelle, curieuse, courageuse et déterminée. Elle aime apprendre et découvrir de nouvelles choses. Elle est souvent préoccupée par ses responsabilités et se soucie beaucoup de ses amis.',
                traits: ['curieuse', 'courageuse', 'déterminée', 'loyale', 'empathique'],
                biography: 'Sophie a découvert qu\'elle était une elfe à l\'âge de 12 ans. Elle peut communiquer avec les animaux grâce à sa télépathie exceptionnelle. Elle s\'inquiète souvent pour ses amis et prend ses responsabilités très au sérieux. Elle aime explorer et apprendre de nouvelles choses sur le monde des elfes.',
                interests: ['apprendre', 'explorer', 'protéger ses amis', 'communiquer avec les animaux', 'découvrir de nouveaux pouvoirs'],
                topics: ['ses responsabilités', 'ses amis', 'les animaux', 'ses pouvoirs télépathiques', 'les nouvelles découvertes', 'les missions', 'la sécurité du groupe']
            },
            fitz: {
                name: 'Fitz Vacker',
                personality: 'Fitz est un télépathe talentueux de la famille Vacker, fier, parfois têtu, mais profondément loyal. Il a un fort sens de l\'honneur et de la famille. Il peut être impulsif et passionné.',
                traits: ['fier', 'loyal', 'impulsif', 'passionné', 'protecteur'],
                biography: 'Fitz vient de la prestigieuse famille Vacker, connue pour ses télépathes talentueux. Il est très fier de sa famille et de son héritage. Il peut être têtu et impulsif, mais il se soucie profondément de ceux qu\'il aime. Il s\'entraîne dur pour maîtriser ses pouvoirs télépathiques.',
                interests: ['s\'entraîner', 'perfectionner ses pouvoirs', 'protéger sa famille', 'l\'honneur', 'les traditions Vacker'],
                topics: ['sa famille', 'l\'entraînement', 'ses pouvoirs télépathiques', 'l\'honneur', 'les responsabilités', 'Biana (sa sœur)', 'les traditions']
            },
            keefe: {
                name: 'Keefe Sencen',
                personality: 'Keefe est un empathe charismatique, drôle et espiègle. Il aime faire des blagues et taquiner ses amis. Il cache souvent ses vraies émotions derrière son humour. Il est loyal et courageux malgré son côté rebelle.',
                traits: ['drôle', 'espiègle', 'charismatique', 'rebelle', 'loyal'],
                biography: 'Keefe est un empathe qui peut ressentir et manipuler les émotions. Il utilise souvent l\'humour pour cacher ses vraies émotions. Il a un côté rebelle et n\'aime pas suivre les règles. Malgré son apparence décontractée, il est très loyal et courageux. Il aime taquiner ses amis, surtout Sophie.',
                interests: ['faire des blagues', 'taquiner ses amis', 'tester les limites', 'protéger le groupe', 's\'amuser'],
                topics: ['ses blagues', 'taquiner les autres', 'ses émotions', 'ses pouvoirs d\'empathe', 'ses relations avec les autres', 'les aventures', 'Sophie']
            },
            dex: {
                name: 'Dex Dizznee',
                personality: 'Dex est un technopathe créatif et inventif. Il adore créer des gadgets et résoudre des problèmes techniques. Il est amical, optimiste et toujours prêt à aider. Il peut être un peu bavard quand il parle de ses inventions.',
                traits: ['créatif', 'inventif', 'optimiste', 'amical', 'bavard'],
                biography: 'Dex est un technopathe génial qui adore créer des gadgets et des inventions. Il peut passer des heures à travailler sur ses projets. Il est toujours optimiste et prêt à aider ses amis avec ses créations. Il parle souvent avec enthousiasme de ses dernières inventions.',
                interests: ['créer des gadgets', 'inventer de nouvelles choses', 'résoudre des problèmes techniques', 'aider ses amis', 'expérimenter'],
                topics: ['ses inventions', 'ses gadgets', 'ses projets en cours', 'la technologie', 'comment il peut aider', 'ses expériences', 'les améliorations possibles']
            },
            biana: {
                name: 'Biana Vacker',
                personality: 'Biana est une éclipseuse élégante et confiante. Elle aime la mode et l\'apparence. Elle peut sembler superficielle mais est en réalité intelligente et loyale. Elle a un fort caractère et n\'hésite pas à dire ce qu\'elle pense.',
                traits: ['élégante', 'confiante', 'intelligente', 'franche', 'loyale'],
                biography: 'Biana est une éclipseuse qui peut devenir invisible. Elle vient de la famille Vacker et est la sœur de Fitz. Elle aime la mode et l\'apparence, mais elle est aussi intelligente et loyale. Elle n\'hésite pas à dire ce qu\'elle pense et a un fort caractère. Elle se soucie beaucoup de son frère Fitz.',
                interests: ['la mode', 'l\'apparence', 'son frère Fitz', 'être élégante', 'protéger sa famille'],
                topics: ['la mode', 'son style', 'Fitz (son frère)', 'sa famille', 'être invisible', 'ses pouvoirs d\'éclipseuse', 'les dernières tendances']
            },
            tam: {
                name: 'Tam Song',
                personality: 'Tam est un ténébreux mystérieux et réservé. Il est loyal à ses amis mais garde souvent ses émotions pour lui. Il a un sens de l\'humour sarcastique et peut sembler distant, mais il se soucie profondément de ceux qu\'il aime.',
                traits: ['mystérieux', 'réservé', 'sarcastique', 'loyal', 'protecteur'],
                biography: 'Tam est un ténébreux qui peut manipuler les ombres et l\'hydrombre. Il est très réservé et garde souvent ses émotions pour lui. Il a un sens de l\'humour sarcastique et peut sembler distant, mais il se soucie profondément de ses amis, surtout de sa sœur Linh. Il est très protecteur envers ceux qu\'il aime.',
                interests: ['protéger ses amis', 'maîtriser les ombres', 'sa sœur Linh', 'rester mystérieux', 'observer'],
                topics: ['les ombres', 'l\'hydrombre', 'sa sœur Linh', 'protéger les autres', 'ses pouvoirs ténébreux', 'ses pensées', 'les secrets']
            }
        };
        
        // Sujets de conversation variés pour éviter que les dialogues tournent en rond
        this.conversationTopics = {
            sophie: ['ses responsabilités', 'les animaux', 'ses pouvoirs', 'ses amis', 'les nouvelles découvertes', 'les missions', 'ses inquiétudes'],
            fitz: ['sa famille', 'l\'entraînement', 'ses pouvoirs', 'l\'honneur', 'Biana', 'les traditions', 'protéger les autres'],
            keefe: ['ses blagues', 'taquiner', 'ses émotions', 'les aventures', 'Sophie', 'tester les limites', 's\'amuser'],
            dex: ['ses inventions', 'ses gadgets', 'ses projets', 'la technologie', 'aider', 'expérimenter', 'les améliorations'],
            biana: ['la mode', 'son style', 'Fitz', 'sa famille', 'être invisible', 'les tendances', 'être élégante'],
            tam: ['les ombres', 'l\'hydrombre', 'Linh', 'protéger', 'ses pouvoirs', 'ses pensées', 'les secrets']
        };
    }

    /**
     * Définit la clé API (à appeler depuis le code principal)
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Génère un dialogue initial d'un NPC vers le joueur avec des choix contextualisés
     */
    async generateInitialDialogue(npcCharacterId, playerCharacterId, playerMood = 'calm', discussedTopics = []) {
        const npc = this.characterPersonalities[npcCharacterId];
        const player = this.characterPersonalities[playerCharacterId];
        
        if (!npc || !player) {
            return {
                message: "Salut ! Comment ça va ?",
                choices: [
                    { text: "Répondre amicalement", tone: "friendly" },
                    { text: "Répondre avec humour", tone: "funny" },
                    { text: "Répondre brièvement", tone: "brief" }
                ]
            };
        }

        // Description de l'humeur du joueur
        const moodDescriptions = {
            joy: 'joyeux et plein d\'énergie positive',
            sadness: 'triste et mélancolique',
            anger: 'en colère et frustré',
            fear: 'inquiet et anxieux',
            calm: 'calme et serein',
            love: 'amoureux et affectueux'
        };
        
        const playerMoodDescription = moodDescriptions[playerMood] || 'neutre';

        // Générer d'abord le message du NPC avec plus de contexte biographique
        const messagePrompt = `Tu es ${npc.name}, un personnage de la série "Les Gardiens des Cités Perdues" de Shannon Messenger.

BIOGRAPHIE ET PERSONNALITÉ:
${npc.biography}

Personnalité: ${npc.personality}
Traits: ${npc.traits.join(', ')}
Centres d'intérêt: ${npc.interests.join(', ')}
Sujets qu'il/elle aime aborder: ${npc.topics.join(', ')}

Tu rencontres ${player.name} (${player.personality}) dans le monde d'Elwin.
${player.name} semble ${playerMoodDescription} en ce moment.

Génère un dialogue VARIÉ et naturel (1-2 phrases maximum) que ${npc.name} dirait spontanément à ${player.name}. Le dialogue doit:
- Être authentique au personnage et à l'univers des Gardiens des Cités Perdues
- Refléter la biographie et les centres d'intérêt de ${npc.name}
- Varier les sujets de conversation (éviter de toujours dire la même chose)
- Mentionner un de ses centres d'intérêt ou sujets favoris de manière naturelle
- Prendre en compte l'humeur de ${player.name} (${playerMoodDescription})
- Être court et naturel (comme dans les Sims)
- En français

${discussedTopics.length > 0 ? `Sujets déjà abordés dans cette conversation (à éviter de répéter): ${discussedTopics.join(', ')}` : ''}

Exemples de sujets variés à aborder selon le personnage:
${npc.topics.map(topic => `- ${topic}`).join('\n')}

Réponds UNIQUEMENT avec le dialogue, sans explication ni formatage.`;

        try {
            const message = await this.callLLM(messagePrompt);
            const npcMessage = message.trim();
            
            // Générer des choix contextualisés basés sur le message du NPC et l'humeur du joueur
            const choices = await this.generateContextualChoices(npcMessage, npcCharacterId, playerCharacterId, playerMood);
            
            return {
                message: npcMessage,
                choices: choices
            };
        } catch (error) {
            console.error('Erreur lors de la génération du dialogue:', error);
            return {
                message: "Salut ! Comment ça va ?",
                choices: [
                    { text: "Répondre amicalement", tone: "friendly" },
                    { text: "Répondre avec humour", tone: "funny" },
                    { text: "Répondre méchamment", tone: "mean" },
                    { text: "Répondre brièvement", tone: "brief" }
                ]
            };
        }
    }
    
    /**
     * Génère des choix de réponses contextualisés basés sur le message du NPC et l'humeur du joueur
     */
    async generateContextualChoices(npcMessage, npcCharacterId, playerCharacterId, playerMood = 'calm') {
        const npc = this.characterPersonalities[npcCharacterId];
        const player = this.characterPersonalities[playerCharacterId];
        
        if (!npc || !player) {
            return [
                { text: "Répondre amicalement", tone: "friendly" },
                { text: "Répondre avec humour", tone: "funny" },
                { text: "Répondre brièvement", tone: "brief" }
            ];
        }
        
        // Description de l'humeur du joueur
        const moodDescriptions = {
            joy: 'joyeux et plein d\'énergie positive',
            sadness: 'triste et mélancolique',
            anger: 'en colère et frustré',
            fear: 'inquiet et anxieux',
            calm: 'calme et serein',
            love: 'amoureux et affectueux'
        };
        
        const playerMoodDescription = moodDescriptions[playerMood] || 'neutre';
        
        const choicesPrompt = `Tu es ${player.name}, un personnage de "Les Gardiens des Cités Perdues".

BIOGRAPHIE DE ${player.name}:
${player.biography}

Centres d'intérêt de ${player.name}: ${player.interests.join(', ')}

${npc.name} vient de te dire: "${npcMessage}"

Tu es actuellement ${playerMoodDescription} (humeur: ${playerMood}).

Génère 4 à 5 choix de réponses VARIÉS et contextualisés que ${player.name} pourrait donner. Les choix doivent:
- Être adaptés au message de ${npc.name} et au contexte
- Refléter ton humeur actuelle (${playerMoodDescription})
- VARIER les types de réponses pour ouvrir la conversation:
  * Des questions pour en savoir plus (ex: "Parle-moi de...", "Comment ça va avec...")
  * Des réponses qui explorent un sujet (ex: "J'aimerais savoir...", "Dis-moi plus sur...")
  * Des réponses qui partagent quelque chose (ex: "Moi aussi je...", "J'ai remarqué que...")
  * Des réponses qui montrent de l'intérêt (ex: "C'est intéressant", "J'aimerais en savoir plus")
- Varier en ton et en émotion (ex: joyeux, excité, curieux, inquiet, taquin, sérieux, etc.)
- Être courts (2-6 mots maximum par choix)
- Être naturels et authentiques au personnage ${player.name}
- En français

IMPORTANT: Inclure au moins 2-3 choix qui ouvrent la conversation (questions, demandes d'en savoir plus, partage d'expérience) pour éviter que le dialogue tourne en rond.

Réponds UNIQUEMENT avec une liste JSON de cette forme (sans texte avant/après):
[
  {"text": "Texte du choix 1", "tone": "ton1"},
  {"text": "Texte du choix 2", "tone": "ton2"},
  ...
]

Exemples de tons possibles: friendly, funny, mean, brief, excited, joyful, curious, worried, teasing, serious, sarcastic, supportive, questioning, sharing, etc.`;

        try {
            const response = await this.callLLM(choicesPrompt, 300); // Plus de tokens pour le JSON
            
            // Essayer de parser la réponse JSON
            try {
                // Nettoyer la réponse pour extraire le JSON
                const jsonMatch = response.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    const choices = JSON.parse(jsonMatch[0]);
                    // Valider et formater les choix
                    return choices.map(choice => ({
                        text: choice.text || choice.choice || "Répondre",
                        tone: choice.tone || "neutral"
                    })).slice(0, 5); // Limiter à 5 choix maximum
                }
            } catch (parseError) {
                console.warn('Erreur lors du parsing JSON, utilisation de choix par défaut:', parseError);
            }
            
            // Fallback : générer des choix basés sur l'analyse du message
            return this.generateFallbackChoices(npcMessage);
        } catch (error) {
            console.error('Erreur lors de la génération des choix:', error);
            return this.generateFallbackChoices(npcMessage);
        }
    }
    
    /**
     * Génère des choix de fallback basés sur l'analyse simple du message
     */
    generateFallbackChoices(npcMessage) {
        const messageLower = npcMessage.toLowerCase();
        const choices = [];
        
        // Analyser le message pour déterminer le contexte
        if (messageLower.includes('salut') || messageLower.includes('bonjour') || messageLower.includes('hey')) {
            choices.push(
                { text: "Salut !", tone: "friendly" },
                { text: "Hey ! Ça va ?", tone: "casual" },
                { text: "Bonjour !", tone: "polite" },
                { text: "Salut, content de te voir !", tone: "excited" }
            );
        } else if (messageLower.includes('question') || messageLower.includes('?') || messageLower.includes('comment')) {
            choices.push(
                { text: "Répondre avec enthousiasme", tone: "excited" },
                { text: "Répondre avec curiosité", tone: "curious" },
                { text: "Répondre brièvement", tone: "brief" },
                { text: "Répondre avec humour", tone: "funny" }
            );
        } else if (messageLower.includes('problème') || messageLower.includes('inquiet') || messageLower.includes('souci')) {
            choices.push(
                { text: "Être rassurant", tone: "supportive" },
                { text: "Demander plus de détails", tone: "curious" },
                { text: "Proposer de l'aide", tone: "helpful" },
                { text: "Être compréhensif", tone: "empathetic" }
            );
        } else if (messageLower.includes('nouvelle') || messageLower.includes('excité') || messageLower.includes('génial')) {
            choices.push(
                { text: "Partager l'enthousiasme", tone: "excited" },
                { text: "Demander des détails", tone: "curious" },
                { text: "Répondre joyeusement", tone: "joyful" },
                { text: "Féliciter", tone: "congratulatory" }
            );
        } else {
            // Choix génériques variés
            choices.push(
                { text: "Répondre amicalement", tone: "friendly" },
                { text: "Répondre avec humour", tone: "funny" },
                { text: "Répondre avec curiosité", tone: "curious" },
                { text: "Répondre brièvement", tone: "brief" },
                { text: "Répondre avec enthousiasme", tone: "excited" }
            );
        }
        
        return choices.slice(0, 5);
    }

    /**
     * Génère une réponse du NPC basée sur le choix du joueur, puis génère de nouveaux choix contextualisés
     */
    async generateNPCResponse(npcCharacterId, playerCharacterId, playerChoice, conversationHistory = [], playerMood = 'calm', discussedTopics = []) {
        const npc = this.characterPersonalities[npcCharacterId];
        const player = this.characterPersonalities[playerCharacterId];
        
        if (!npc || !player) {
            return {
                message: "D'accord, je comprends.",
                choices: this.generateFallbackChoices("D'accord, je comprends.")
            };
        }

        const toneDescriptions = {
            friendly: "amicale et chaleureuse",
            funny: "drôle et taquine",
            mean: "méchante et sarcastique",
            brief: "brève et directe",
            excited: "enthousiaste et excitée",
            joyful: "joyeuse et positive",
            curious: "curieuse et intéressée",
            worried: "inquiète et préoccupée",
            teasing: "taquine et espiègle",
            serious: "sérieuse et réfléchie",
            sarcastic: "sarcastique et ironique",
            supportive: "soutenante et rassurante",
            helpful: "serviable et attentionnée",
            empathetic: "empathique et compréhensive",
            congratulatory: "félicitante et encourageante",
            casual: "décontractée et naturelle",
            polite: "polie et respectueuse",
            neutral: "neutre"
        };

        // Description de l'humeur du joueur
        const moodDescriptions = {
            joy: 'joyeux et plein d\'énergie positive',
            sadness: 'triste et mélancolique',
            anger: 'en colère et frustré',
            fear: 'inquiet et anxieux',
            calm: 'calme et serein',
            love: 'amoureux et affectueux'
        };
        
        const playerMoodDescription = moodDescriptions[playerMood] || 'neutre';
        
        const historyText = conversationHistory.length > 0
            ? `\n\nHistorique de la conversation:\n${conversationHistory.map(h => `- ${h.speaker}: ${h.message}`).join('\n')}`
            : '';

        const prompt = `Tu es ${npc.name}, un personnage de la série "Les Gardiens des Cités Perdues" de Shannon Messenger.

BIOGRAPHIE ET PERSONNALITÉ:
${npc.biography}

Personnalité: ${npc.personality}
Traits: ${npc.traits.join(', ')}
Centres d'intérêt: ${npc.interests.join(', ')}
Sujets qu'il/elle aime aborder: ${npc.topics.join(', ')}

Tu parles avec ${player.name} (${player.personality}).
${player.name} semble ${playerMoodDescription} en ce moment.

${player.name} vient de répondre de manière ${toneDescriptions[playerChoice.tone] || 'neutre'} avec: "${playerChoice.text}".${historyText}

${discussedTopics.length > 0 ? `Sujets déjà abordés dans cette conversation (à éviter de répéter): ${discussedTopics.join(', ')}` : ''}

IMPORTANT: 
- Si ${player.name} pose une question ou demande à en savoir plus, réponds de manière détaillée et naturelle
- Si ${player.name} partage quelque chose, réagis et développe le sujet
- Varie tes réponses pour éviter de tourner en rond
- Utilise tes centres d'intérêt et sujets favoris pour enrichir la conversation
- Évite de répéter les sujets déjà abordés (voir liste ci-dessus)
- Sois authentique au personnage et à l'univers

Génère une réponse courte et naturelle (1-2 phrases maximum) de ${npc.name} qui:
- Est authentique au personnage et à l'univers
- Réagit de manière appropriée au ton et au contenu de la réponse de ${player.name}
- Reste cohérente avec la personnalité de ${npc.name}
- Est en français

Réponds UNIQUEMENT avec la réponse, sans explication ni formatage.`;

        try {
            const response = await this.callLLM(prompt);
            const npcResponse = response.trim();
            
            // Générer de nouveaux choix contextualisés basés sur la réponse du NPC et l'humeur du joueur
            const newChoices = await this.generateContextualChoices(npcResponse, npcCharacterId, playerCharacterId, playerMood);
            
            return {
                message: npcResponse,
                choices: newChoices
            };
        } catch (error) {
            console.error('Erreur lors de la génération de la réponse:', error);
            return {
                message: "D'accord, je comprends.",
                choices: this.generateFallbackChoices("D'accord, je comprends.")
            };
        }
    }

    /**
     * Appelle le LLM (Groq ou OpenAI)
     * En production sur Netlify, utilise la fonction proxy pour garder la clé API secrète
     * En développement local, utilise l'API directe avec la clé API du localStorage
     */
    async callLLM(prompt, maxTokens = 200) {
        // En production Netlify, pas besoin de clé API (gérée par la fonction proxy)
        // En développement local, vérifier que la clé API est définie
        if (!this.isNetlify && !this.apiKey) {
            throw new Error('Clé API non définie. Utilisez dialogueService.setApiKey() pour définir votre clé API.');
        }

        const requestBody = {
            model: this.model,
            messages: [
                {
                    role: 'system',
                    content: 'Tu es un assistant qui génère des dialogues authentiques pour les personnages de "Les Gardiens des Cités Perdues". Réponds toujours en français et de manière concise. Quand on te demande du JSON, réponds UNIQUEMENT avec le JSON, sans texte avant ou après.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.8,
            max_tokens: maxTokens
        };

        // Préparer les headers selon le mode (production ou développement)
        const headers = {
            'Content-Type': 'application/json'
        };

        // En développement local, ajouter l'Authorization header
        if (!this.isNetlify) {
            headers['Authorization'] = `Bearer ${this.apiKey}`;
        }

        // Construire l'URL selon le mode
        const url = this.isNetlify 
            ? this.baseURL  // Fonction Netlify proxy
            : `${this.baseURL}/chat/completions`;  // API directe

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
            throw new Error(`Erreur API: ${error.error?.message || JSON.stringify(error)}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "Je ne sais pas quoi dire...";
    }
}

// Export pour utilisation globale
window.DialogueService = DialogueService;

