/**
 * Fonction Netlify pour proxy les appels à l'API OpenAI
 * Cette fonction garde la clé API secrète côté serveur
 */

exports.handler = async (event, context) => {
    // Gérer les requêtes OPTIONS pour le CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: ''
        };
    }

    // Vérifier que c'est une requête POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Récupérer la clé API depuis les variables d'environnement Netlify
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Clé API non configurée sur le serveur' })
        };
    }

    try {
        // Récupérer le corps de la requête
        const requestBody = JSON.parse(event.body);
        
        // Appeler l'API OpenAI avec la clé API du serveur
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: requestBody.model || 'gpt-4o-mini',
                messages: requestBody.messages || [],
                temperature: requestBody.temperature || 0.8,
                max_tokens: requestBody.max_tokens || 200
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: error.error?.message || JSON.stringify(error) })
            };
        }

        const data = await response.json();
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Permettre les requêtes depuis le site
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};

