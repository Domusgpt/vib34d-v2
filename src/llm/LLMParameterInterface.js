/**
 * LLM Parameter Interface - Convert natural language to VIB34D parameters
 * Uses Gemini Flash 1.5 for intelligent parameter generation
 */

class LLMParameterInterface {
    constructor() {
        this.apiKey = null;
        this.isInitialized = false;
        this.systemPrompt = this.createSystemPrompt();
        this.autocompleteCache = new Map();
        this.lastRequestTime = 0;
        this.requestThrottle = 1000; // 1 second between requests
    }

    async initialize(apiKey) {
        if (!apiKey) {
            console.warn('🤖 No Gemini API key provided - LLM features disabled');
            return false;
        }
        
        this.apiKey = apiKey;
        
        try {
            // Test API connection
            const testResponse = await this.generateParameters('test connection');
            this.isInitialized = true;
            console.log('🤖 LLM Parameter Interface initialized successfully');
            return true;
        } catch (error) {
            console.error('🤖 LLM initialization failed:', error);
            return false;
        }
    }

    createSystemPrompt() {
        return `You are an AI assistant that converts natural language descriptions into VIB34D visualization parameters. 

VIB34D has 4 visualization systems:
- FACETED: Simple 2D geometric patterns
- QUANTUM: Complex 3D lattice with enhanced effects  
- HOLOGRAPHIC: Audio-reactive rich pink/magenta effects
- POLYCHORA: True 4D polytope mathematics

Parameter ranges:
{
  "geometry": 0-7,         // 0=Tetrahedron, 1=Cube, 2=Octahedron, 3=Icosahedron, 4=Dodecahedron, 5=Hypercube, 6=Hyperoctahedron, 7=Crystal
  "rot4dXW": -6.28 to 6.28, // 4D rotation X-W plane (radians)
  "rot4dYW": -6.28 to 6.28, // 4D rotation Y-W plane (radians) 
  "rot4dZW": -6.28 to 6.28, // 4D rotation Z-W plane (radians)
  "gridDensity": 5-100,     // Geometric detail level
  "morphFactor": 0-2,       // Shape transformation amount
  "chaos": 0-1,             // Randomization factor
  "speed": 0.1-3,           // Animation speed multiplier
  "hue": 0-360,             // Color hue in degrees
  "intensity": 0-1,         // Visual brightness level
  "saturation": 0-1         // Color saturation level
}

Convert user descriptions to JSON parameters. Examples:

User: "bright cyan holographic effect"
Response: {"hue": 180, "intensity": 0.9, "saturation": 1.0, "gridDensity": 50}

User: "slow red crystalline hypercube"  
Response: {"geometry": 5, "hue": 0, "speed": 0.3, "intensity": 0.8, "gridDensity": 75}

User: "chaotic fast rainbow tetrahedron"
Response: {"geometry": 0, "chaos": 0.9, "speed": 2.5, "hue": 270, "saturation": 1.0}

ALWAYS respond with valid JSON only. No explanations, just the parameter object.`;
    }

    async generateParameters(description) {
        if (!this.isInitialized) {
            throw new Error('LLM interface not initialized');
        }

        // Throttle requests
        const now = Date.now();
        if (now - this.lastRequestTime < this.requestThrottle) {
            await new Promise(resolve => setTimeout(resolve, this.requestThrottle - (now - this.lastRequestTime)));
        }
        this.lastRequestTime = Date.now();

        const prompt = `${this.systemPrompt}\n\nUser: "${description}"\nResponse:`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.1,
                        topK: 1,
                        topP: 0.1,
                        maxOutputTokens: 200,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const generatedText = data.candidates[0].content.parts[0].text.trim();
            
            // Parse JSON response
            let parameters;
            try {
                // Clean up response (remove code blocks if present)
                const cleanText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
                parameters = JSON.parse(cleanText);
            } catch (parseError) {
                console.warn('🤖 Failed to parse LLM response as JSON:', generatedText);
                throw new Error('Invalid JSON response from LLM');
            }

            // Validate parameter ranges
            parameters = this.validateAndClampParameters(parameters);
            
            console.log(`🤖 Generated parameters for "${description}":`, parameters);
            return parameters;

        } catch (error) {
            console.error('🤖 LLM parameter generation failed:', error);
            throw error;
        }
    }

    validateAndClampParameters(params) {
        const validated = {};
        
        const ranges = {
            geometry: { min: 0, max: 7, integer: true },
            rot4dXW: { min: -6.28, max: 6.28 },
            rot4dYW: { min: -6.28, max: 6.28 },
            rot4dZW: { min: -6.28, max: 6.28 },
            gridDensity: { min: 5, max: 100, integer: true },
            morphFactor: { min: 0, max: 2 },
            chaos: { min: 0, max: 1 },
            speed: { min: 0.1, max: 3 },
            hue: { min: 0, max: 360, integer: true },
            intensity: { min: 0, max: 1 },
            saturation: { min: 0, max: 1 }
        };

        for (const [param, value] of Object.entries(params)) {
            if (ranges[param] && typeof value === 'number') {
                const range = ranges[param];
                let clampedValue = Math.max(range.min, Math.min(range.max, value));
                
                if (range.integer) {
                    clampedValue = Math.round(clampedValue);
                }
                
                validated[param] = clampedValue;
            }
        }

        return validated;
    }

    generateAutocompleteOptions(partialInput) {
        const suggestions = [
            // Color suggestions
            'bright cyan holographic effect',
            'warm orange crystalline patterns',
            'deep purple chaotic swirls',
            'rainbow hyperdimensional geometry',
            'cool blue minimalist design',
            'fiery red intense visualization',
            'electric green quantum lattice',
            'golden ratio sacred geometry',
            
            // Style suggestions  
            'slow flowing organic shapes',
            'fast chaotic fractal patterns',
            'geometric precision high density',
            'smooth morphing transformations',
            'angular crystalline structures',
            'fluid holographic effects',
            'minimal clean geometry',
            'complex layered visuals',
            
            // System-specific suggestions
            'tetrahedron spinning slowly',
            'hypercube 4D rotation effects',
            'icosahedron golden ratio',
            'crystal lattice high intensity',
            'dodecahedron sacred geometry',
            'octahedron symmetrical balance',
            'cube simple clean lines',
            'hyperoctahedron 4D mathematics',
            
            // Effect combinations
            'chaotic rainbow tetrahedron fast',
            'calm blue hypercube rotation',
            'intense red crystalline chaos',
            'subtle green organic morphing',
            'vibrant holographic dance',
            'zen minimalist meditation',
            'explosive colorful energy',
            'ethereal ghostly transparency'
        ];

        if (!partialInput || partialInput.length < 2) {
            return suggestions.slice(0, 8); // Show top 8 suggestions
        }

        const filtered = suggestions.filter(suggestion => 
            suggestion.toLowerCase().includes(partialInput.toLowerCase())
        );

        return filtered.slice(0, 6); // Show top 6 matches
    }

    async applyParameters(parameters, smoothTransition = true) {
        if (!window.updateParameter) {
            console.error('🤖 updateParameter function not available');
            return false;
        }

        try {
            if (smoothTransition) {
                // Apply parameters with smooth transitions
                const paramKeys = Object.keys(parameters);
                
                for (let i = 0; i < paramKeys.length; i++) {
                    const param = paramKeys[i];
                    const value = parameters[param];
                    
                    setTimeout(() => {
                        console.log(`🤖 Applying ${param} = ${value}`);
                        window.updateParameter(param, value);
                        
                        // Update UI slider if it exists
                        const slider = document.getElementById(param);
                        if (slider) {
                            slider.value = value;
                        }
                    }, i * 50); // 50ms delay between each parameter
                }
            } else {
                // Apply all parameters immediately
                for (const [param, value] of Object.entries(parameters)) {
                    window.updateParameter(param, value);
                    
                    const slider = document.getElementById(param);
                    if (slider) {
                        slider.value = value;
                    }
                }
            }

            return true;
        } catch (error) {
            console.error('🤖 Failed to apply parameters:', error);
            return false;
        }
    }
}

// Global instance
window.llmInterface = new LLMParameterInterface();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LLMParameterInterface;
}