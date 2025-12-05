/**
 * Service de synthèse vocale (Text-to-Speech) local
 * Utilise l'API Web Speech pour lire les dialogues à voix haute
 * Adapte la voix selon le genre du personnage
 */

class TTSService {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.isEnabled = true; // Activé par défaut
        this.voices = [];
        this.maleVoices = [];
        this.femaleVoices = [];
        
        // Mapping des personnages par genre
        this.characterGender = {
            sophie: 'female',
            biana: 'female',
            fitz: 'male',
            keefe: 'male',
            dex: 'male',
            tam: 'male'
        };
        
        // Charger les voix disponibles
        this.loadVoices();
        
        // Les voix peuvent être chargées de manière asynchrone
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = () => this.loadVoices();
        }
    }
    
    /**
     * Charge les voix disponibles et les catégorise par genre
     */
    loadVoices() {
        this.voices = this.synthesis.getVoices();
        
        // Filtrer les voix françaises et les catégoriser
        const frenchVoices = this.voices.filter(voice => 
            voice.lang.startsWith('fr') || voice.lang.includes('French')
        );
        
        // Catégoriser les voix (approximation basée sur le nom)
        this.maleVoices = frenchVoices.filter(voice => {
            const name = voice.name.toLowerCase();
            return name.includes('male') || 
                   name.includes('homme') || 
                   name.includes('thomas') ||
                   name.includes('nicolas') ||
                   name.includes('damien') ||
                   (name.includes('google') && name.includes('male')) ||
                   (name.includes('microsoft') && name.includes('male'));
        });
        
        this.femaleVoices = frenchVoices.filter(voice => {
            const name = voice.name.toLowerCase();
            return name.includes('female') || 
                   name.includes('femme') || 
                   name.includes('zira') ||
                   name.includes('hazel') ||
                   name.includes('catherine') ||
                   name.includes('thomas') === false ||
                   (name.includes('google') && name.includes('female')) ||
                   (name.includes('microsoft') && name.includes('female'));
        });
        
        // Si pas de voix françaises spécifiques, utiliser toutes les voix françaises
        if (this.maleVoices.length === 0 && this.femaleVoices.length === 0) {
            // Répartir les voix françaises (approximation)
            frenchVoices.forEach((voice, index) => {
                if (index % 2 === 0) {
                    this.maleVoices.push(voice);
                } else {
                    this.femaleVoices.push(voice);
                }
            });
        }
        
        // Fallback : utiliser toutes les voix disponibles si pas de voix françaises
        if (frenchVoices.length === 0) {
            console.warn('Aucune voix française trouvée, utilisation des voix par défaut');
            this.maleVoices = this.voices.filter(v => v.lang.startsWith('en') || v.lang.startsWith('fr'));
            this.femaleVoices = this.voices.filter(v => v.lang.startsWith('en') || v.lang.startsWith('fr'));
        }
    }
    
    /**
     * Obtient une voix adaptée au genre du personnage
     */
    getVoiceForCharacter(characterId) {
        const gender = this.characterGender[characterId] || 'male';
        const voices = gender === 'female' ? this.femaleVoices : this.maleVoices;
        
        if (voices.length > 0) {
            // Préférer les voix françaises
            const frenchVoice = voices.find(v => v.lang.startsWith('fr'));
            return frenchVoice || voices[0];
        }
        
        // Fallback : utiliser une voix par défaut
        const defaultVoices = this.voices.filter(v => v.lang.startsWith('fr') || v.lang.startsWith('en'));
        return defaultVoices[0] || this.voices[0];
    }
    
    /**
     * Lit un texte à voix haute avec la voix adaptée au personnage
     */
    speak(text, characterId = null, options = {}) {
        if (!this.isEnabled || !this.synthesis) {
            return;
        }
        
        // Arrêter toute lecture en cours
        this.stop();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Sélectionner la voix selon le personnage
        if (characterId) {
            const voice = this.getVoiceForCharacter(characterId);
            if (voice) {
                utterance.voice = voice;
            }
        }
        
        // Configuration de la voix
        utterance.lang = options.lang || 'fr-FR';
        utterance.rate = options.rate || 1.0; // Vitesse normale
        utterance.pitch = options.pitch || 1.0; // Ton normal
        utterance.volume = options.volume || 0.8; // Volume
        
        // Ajuster le pitch selon le genre (approximation)
        if (characterId) {
            const gender = this.characterGender[characterId];
            if (gender === 'female') {
                utterance.pitch = 1.2; // Plus aigu pour les voix féminines
            } else {
                utterance.pitch = 0.9; // Plus grave pour les voix masculines
            }
        }
        
        // Gestion des événements
        utterance.onend = () => {
            this.currentUtterance = null;
            if (options.onEnd) options.onEnd();
        };
        
        utterance.onerror = (error) => {
            console.error('Erreur TTS:', error);
            this.currentUtterance = null;
            if (options.onError) options.onError(error);
        };
        
        this.currentUtterance = utterance;
        this.synthesis.speak(utterance);
    }
    
    /**
     * Arrête la lecture en cours
     */
    stop() {
        if (this.synthesis && this.synthesis.speaking) {
            this.synthesis.cancel();
        }
        this.currentUtterance = null;
    }
    
    /**
     * Active ou désactive le TTS
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (!enabled) {
            this.stop();
        }
    }
    
    /**
     * Vérifie si le TTS est disponible
     */
    isAvailable() {
        return 'speechSynthesis' in window && this.synthesis !== null;
    }
}

// Export pour utilisation globale
window.TTSService = TTSService;

