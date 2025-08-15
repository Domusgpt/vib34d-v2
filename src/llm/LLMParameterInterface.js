/**
 * LLM Parameter Interface for VIB34D
 * Converts natural language descriptions to VIB34D parameters using Gemini Flash 1.5
 */

export class LLMParameterInterface {
    constructor() {
        this.apiKey = null;
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        this.parameterCallback = null;
        
        // Comprehensive system prompt with emotional/visual understanding
        this.systemPrompt = `You are a parameter generator for the VIB34D holographic visualization engine.
        
Your task is to convert natural language descriptions into JSON parameters that control visual effects.

PARAMETER UNDERSTANDING AND EMOTIONAL MAPPINGS:

1. geometry (0-7): Visual structure and feeling
   - 0 (Tetrahedron): Sharp, crystalline, focused energy
   - 1 (Hypercube): Complex, multidimensional, mind-expanding
   - 2 (Sphere): Soft, harmonious, peaceful
   - 3 (Torus): Flowing, cyclical, meditative
   - 4 (Klein Bottle): Paradoxical, surreal, mysterious
   - 5 (Fractal): Intricate, infinite, mathematical beauty
   - 6 (Wave): Fluid, dynamic, oceanic
   - 7 (Crystal): Structured, precise, gem-like

2. hue (0-360): Color emotion
   - 0-60: Red (passionate, energetic, warm)
   - 60-120: Yellow/Green (natural, growth, balance)
   - 120-240: Blue/Cyan (calm, technological, cool)
   - 240-300: Purple/Magenta (mystical, creative, ethereal)
   - 300-360: Pink/Red (romantic, soft, dreamlike)

3. intensity (0-1): Visual brightness and energy level
   - 0-0.3: Subtle, ambient, relaxing
   - 0.3-0.7: Balanced, moderate, focused
   - 0.7-1.0: Intense, vibrant, energetic

4. saturation (0-1): Color richness
   - 0-0.3: Muted, pastel, gentle
   - 0.3-0.7: Natural, balanced
   - 0.7-1.0: Vivid, rich, bold

5. speed (0.1-3): Animation tempo and mood
   - 0.1-0.5: Slow, meditative, contemplative
   - 0.5-1.5: Normal, rhythmic, balanced
   - 1.5-3.0: Fast, energetic, dynamic

6. chaos (0-1): Randomness and unpredictability
   - 0-0.3: Ordered, predictable, calm
   - 0.3-0.7: Organic, natural variation
   - 0.7-1.0: Wild, unpredictable, exciting

7. morphFactor (0-2): Shape transformation intensity
   - 0-0.5: Stable, minimal morphing
   - 0.5-1.5: Fluid transformations
   - 1.5-2.0: Dramatic shape-shifting

8. gridDensity (5-100): Detail and complexity
   - 5-20: Minimal, clean, spacious
   - 20-50: Balanced detail
   - 50-100: Dense, intricate, complex

9. rot4dXW, rot4dYW, rot4dZW (-6.28 to 6.28): 4D rotation angles
   - Use for "spinning", "rotating", "dimensional" effects
   - Small values (±1) for subtle rotation
   - Large values (±6) for dramatic dimensional shifts

INTERPRETATION GUIDELINES:
- "bright" → high intensity (0.8-1.0)
- "dark/dim" → low intensity (0.1-0.3)
- "colorful/rainbow" → high saturation (0.8-1.0), varying hue
- "monochrome/subtle" → low saturation (0.1-0.3)
- "calm/peaceful" → low speed (0.1-0.5), low chaos (0-0.3)
- "energetic/wild" → high speed (1.5-3), high chaos (0.7-1)
- "holographic" → high intensity, medium-high saturation, cyan/magenta hues
- "crystalline" → geometry 7, low chaos, high intensity
- "organic/natural" → geometry 2-3, medium chaos (0.4-0.6)
- "technological/cyber" → geometry 1, cyan hues (180-200)
- "mystical/magical" → geometry 4-5, purple hues (240-280)

Return ONLY valid JSON with these exact parameter names. Scale values appropriately to their ranges.`;
    }
    
    /**
     * Initialize with API key from localStorage or prompt user
     */
    async initialize() {
        // Check localStorage for existing API key
        const storedKey = localStorage.getItem('vib34d-gemini-api-key');
        if (storedKey) {
            this.apiKey = storedKey;
            console.log('🔑 Gemini API key loaded from storage');
            return true;
        }
        
        // If no key, will be prompted when first used
        console.log('📝 Gemini API key will be requested on first use');
        return false;
    }
    
    /**
     * Set API key and store it
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('vib34d-gemini-api-key', apiKey);
        console.log('🔑 Gemini API key saved');
    }
    
    /**
     * Set callback for parameter updates
     */
    setParameterCallback(callback) {
        this.parameterCallback = callback;
    }
    
    /**
     * Generate parameters from natural language description
     */
    async generateParameters(description) {
        if (!this.apiKey) {
            throw new Error('API key not set. Please configure your Gemini API key.');
        }
        
        try {
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${this.systemPrompt}\n\nUser description: "${description}"\n\nGenerate JSON parameters:`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                        topP: 0.8,
                        topK: 40
                    }
                })
            });
            
            if (!response.ok) {
                const error = await response.text();
                throw new Error(`API request failed: ${response.status} - ${error}`);
            }
            
            const data = await response.json();
            const generatedText = data.candidates[0].content.parts[0].text;
            
            // Extract JSON from response
            const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No valid JSON found in response');
            }
            
            const parameters = JSON.parse(jsonMatch[0]);
            
            // Validate and clamp parameters
            const validated = this.validateParameters(parameters);
            
            console.log('🤖 Generated parameters:', validated);
            
            // Call the callback if set
            if (this.parameterCallback) {
                this.parameterCallback(validated);
            }
            
            return validated;
            
        } catch (error) {
            console.error('❌ LLM generation error:', error);
            throw error;
        }
    }
    
    /**
     * Validate and clamp parameters to valid ranges
     */
    validateParameters(params) {
        const validated = {};
        
        // Define parameter ranges
        const ranges = {
            geometry: { min: 0, max: 7, type: 'int' },
            hue: { min: 0, max: 360, type: 'int' },
            intensity: { min: 0, max: 1, type: 'float' },
            saturation: { min: 0, max: 1, type: 'float' },
            speed: { min: 0.1, max: 3, type: 'float' },
            chaos: { min: 0, max: 1, type: 'float' },
            morphFactor: { min: 0, max: 2, type: 'float' },
            gridDensity: { min: 5, max: 100, type: 'int' },
            rot4dXW: { min: -6.28, max: 6.28, type: 'float' },
            rot4dYW: { min: -6.28, max: 6.28, type: 'float' },
            rot4dZW: { min: -6.28, max: 6.28, type: 'float' }
        };
        
        // Validate each parameter
        Object.entries(ranges).forEach(([param, range]) => {
            if (params.hasOwnProperty(param)) {
                let value = parseFloat(params[param]);
                
                // Clamp to range
                value = Math.max(range.min, Math.min(range.max, value));
                
                // Convert to int if needed
                if (range.type === 'int') {
                    value = Math.round(value);
                }
                
                validated[param] = value;
            }
        });
        
        return validated;
    }
}