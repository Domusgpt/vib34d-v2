/**
 * API Configuration Manager
 * Handles secure API key management for external services
 */

class ApiConfig {
    constructor() {
        this.geminiApiKey = null;
        this.isConfigured = false;
        this.storageKey = 'vib34d_api_config';
        
        // Load saved configuration
        this.loadFromStorage();
    }

    // Set Gemini API key
    setGeminiApiKey(apiKey) {
        if (!apiKey || typeof apiKey !== 'string') {
            console.warn('🔑 Invalid API key provided');
            return false;
        }

        // Basic validation for Gemini API key format
        if (!apiKey.startsWith('AIza') || apiKey.length < 30) {
            console.warn('🔑 API key format appears invalid (should start with "AIza" and be 30+ characters)');
            return false;
        }

        this.geminiApiKey = apiKey;
        this.isConfigured = true;
        
        // Save to localStorage (encrypted with basic obfuscation)
        this.saveToStorage();
        
        // Initialize LLM interface if available
        if (window.llmInterface) {
            window.llmInterface.initialize(apiKey).then(success => {
                if (success) {
                    console.log('🤖 LLM interface initialized with new API key');
                } else {
                    console.error('🤖 Failed to initialize LLM interface');
                }
            });
        }

        console.log('🔑 Gemini API key configured successfully');
        return true;
    }

    // Get current API key status
    getApiKeyStatus() {
        return {
            isConfigured: this.isConfigured,
            hasKey: !!this.geminiApiKey,
            keyPreview: this.geminiApiKey ? 
                `${this.geminiApiKey.substring(0, 8)}...${this.geminiApiKey.slice(-4)}` : 
                null
        };
    }

    // Auto-detect API key from environment
    async autoDetectApiKey() {
        // Check for environment variables (if running in Node.js or with env access)
        if (typeof process !== 'undefined' && process.env) {
            const envKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
            if (envKey) {
                console.log('🔑 Found API key in environment variables');
                return this.setGeminiApiKey(envKey);
            }
        }

        // Check for global window variables (set by user)
        if (window.GEMINI_API_KEY) {
            console.log('🔑 Found API key in window.GEMINI_API_KEY');
            return this.setGeminiApiKey(window.GEMINI_API_KEY);
        }

        // Try to load from .env file (if available via fetch)
        try {
            const response = await fetch('./.env');
            if (response.ok) {
                const envText = await response.text();
                const keyMatch = envText.match(/GEMINI_API_KEY=(.+)/);
                if (keyMatch) {
                    console.log('🔑 Found API key in .env file');
                    return this.setGeminiApiKey(keyMatch[1].trim());
                }
            }
        } catch (error) {
            // .env file not accessible, continue
        }

        console.log('🔑 No API key auto-detected');
        return false;
    }

    // Save configuration to localStorage
    saveToStorage() {
        try {
            const config = {
                geminiApiKey: this.obfuscateKey(this.geminiApiKey),
                timestamp: Date.now()
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(config));
        } catch (error) {
            console.warn('🔑 Failed to save API configuration:', error);
        }
    }

    // Load configuration from localStorage
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const config = JSON.parse(stored);
                
                // Check if stored config is recent (within 30 days)
                const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
                if (config.timestamp > thirtyDaysAgo) {
                    const deobfuscatedKey = this.deobfuscateKey(config.geminiApiKey);
                    if (deobfuscatedKey) {
                        this.setGeminiApiKey(deobfuscatedKey);
                        console.log('🔑 Loaded API configuration from storage');
                        return true;
                    }
                } else {
                    // Clear old configuration
                    localStorage.removeItem(this.storageKey);
                }
            }
        } catch (error) {
            console.warn('🔑 Failed to load API configuration:', error);
        }
        return false;
    }

    // Clear stored configuration
    clearConfiguration() {
        this.geminiApiKey = null;
        this.isConfigured = false;
        
        try {
            localStorage.removeItem(this.storageKey);
            console.log('🔑 API configuration cleared');
        } catch (error) {
            console.warn('🔑 Failed to clear configuration:', error);
        }
    }

    // Basic obfuscation for storage (not cryptographically secure)
    obfuscateKey(key) {
        if (!key) return null;
        
        // Simple base64 encoding with character shifts
        const encoded = btoa(key);
        const shifted = encoded.split('').map(char => 
            String.fromCharCode(char.charCodeAt(0) + 3)
        ).join('');
        
        return shifted;
    }

    // Deobfuscate stored key
    deobfuscateKey(obfuscated) {
        if (!obfuscated) return null;
        
        try {
            // Reverse character shifts
            const unshifted = obfuscated.split('').map(char => 
                String.fromCharCode(char.charCodeAt(0) - 3)
            ).join('');
            
            // Decode base64
            return atob(unshifted);
        } catch (error) {
            console.warn('🔑 Failed to deobfuscate API key');
            return null;
        }
    }

    // Prompt user for API key
    promptForApiKey() {
        const apiKey = prompt(`
🔑 Gemini API Key Required

To use AI parameter generation, please enter your Google Gemini API key.

Get your free key at: https://makersuite.google.com/app/apikey

Enter API key:`);

        if (apiKey) {
            return this.setGeminiApiKey(apiKey.trim());
        }
        
        return false;
    }

    // Show API key setup instructions
    showSetupInstructions() {
        const instructions = `
🔑 VIB34D AI Parameter Setup

To enable AI-powered parameter generation:

1. Get a free Gemini API key:
   → Visit: https://makersuite.google.com/app/apikey
   → Sign in with Google account
   → Click "Create API Key"
   → Copy the key

2. Set your API key:
   → Option A: window.apiConfig.setGeminiApiKey('YOUR_KEY')
   → Option B: Set window.GEMINI_API_KEY = 'YOUR_KEY'
   → Option C: Click the 🤖 button and enter when prompted

3. Start using AI parameters:
   → Click 🤖 button in VIB34D interface
   → Type descriptions like "bright cyan holographic effect"
   → Watch parameters generate automatically!

Your API key is stored locally and never shared.
        `;

        console.log(instructions);
        
        // Show in UI if possible
        if (window.llmUI) {
            alert(instructions);
        }
    }
}

// Global instance
window.apiConfig = new ApiConfig();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiConfig;
}