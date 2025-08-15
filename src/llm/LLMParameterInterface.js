/**
 * LLM Parameter Interface for VIB34D
 * Converts natural language descriptions to VIB34D parameters using Gemini Flash 1.5
 */

export class LLMParameterInterface {
    constructor() {
        // Check localStorage for API key, fallback to simulation
        this.apiKey = localStorage.getItem('vib34d-gemini-api-key') || null;
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
        // Check if we have a valid API key
        const hasValidKey = this.apiKey && this.apiKey.startsWith('AIza') && this.apiKey.length > 30;
        
        if (hasValidKey) {
            // Try real API first
            try {
                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': this.apiKey
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
                
                if (response.ok) {
                    const data = await response.json();
                    const generatedText = data.candidates[0].content.parts[0].text;
                    
                    // Extract JSON from response
                    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const parameters = JSON.parse(jsonMatch[0]);
                        const validated = this.validateParameters(parameters);
                        
                        console.log('🤖 Generated parameters via Gemini API:', validated);
                        
                        if (this.parameterCallback) {
                            this.parameterCallback(validated);
                        }
                        
                        return validated;
                    }
                }
            } catch (error) {
                console.warn('API request failed, falling back to intelligent simulation:', error);
            }
        }
        
        // Fallback: Generate intelligent parameters based on description analysis
        console.log('🧠 Using intelligent parameter simulation for:', description);
        const parameters = this.generateIntelligentParameters(description);
        
        console.log('🤖 Generated parameters via simulation:', parameters);
        
        if (this.parameterCallback) {
            this.parameterCallback(parameters);
        }
        
        return parameters;
    }
    
    /**
     * Generate intelligent parameters based on description analysis
     */
    generateIntelligentParameters(description) {
        const desc = description.toLowerCase();
        
        // Base parameters
        let params = {
            geometry: 0,
            hue: 200,
            intensity: 0.5,
            saturation: 0.8,
            speed: 1.0,
            chaos: 0.2,
            morphFactor: 1.0,
            gridDensity: 25,
            rot4dXW: 0,
            rot4dYW: 0,
            rot4dZW: 0
        };
        
        // Analyze description for emotional/visual cues
        
        // Brightness/Intensity
        if (desc.includes('bright') || desc.includes('intense') || desc.includes('vivid')) {
            params.intensity = 0.8 + Math.random() * 0.2;
        }
        if (desc.includes('dim') || desc.includes('soft') || desc.includes('gentle')) {
            params.intensity = 0.2 + Math.random() * 0.3;
        }
        
        // Colors
        if (desc.includes('cyan') || desc.includes('turquoise')) {
            params.hue = 180 + Math.random() * 20;
        } else if (desc.includes('blue')) {
            params.hue = 240 + Math.random() * 30;
        } else if (desc.includes('purple') || desc.includes('violet')) {
            params.hue = 270 + Math.random() * 30;
        } else if (desc.includes('magenta') || desc.includes('pink')) {
            params.hue = 320 + Math.random() * 40;
        } else if (desc.includes('red')) {
            params.hue = 0 + Math.random() * 30;
        } else if (desc.includes('orange')) {
            params.hue = 30 + Math.random() * 30;
        } else if (desc.includes('yellow')) {
            params.hue = 60 + Math.random() * 30;
        } else if (desc.includes('green')) {
            params.hue = 120 + Math.random() * 30;
        }
        
        // Speed/Animation
        if (desc.includes('fast') || desc.includes('rapid') || desc.includes('quick')) {
            params.speed = 2.0 + Math.random() * 1.0;
        } else if (desc.includes('slow') || desc.includes('calm') || desc.includes('peaceful')) {
            params.speed = 0.2 + Math.random() * 0.4;
        }
        
        // Chaos/Randomness
        if (desc.includes('wild') || desc.includes('chaotic') || desc.includes('crazy')) {
            params.chaos = 0.7 + Math.random() * 0.3;
        } else if (desc.includes('ordered') || desc.includes('structured') || desc.includes('calm')) {
            params.chaos = 0.0 + Math.random() * 0.3;
        }
        
        // Geometry
        if (desc.includes('crystal') || desc.includes('crystalline')) {
            params.geometry = 7; // Crystal
        } else if (desc.includes('sphere') || desc.includes('ball') || desc.includes('orb')) {
            params.geometry = 2; // Sphere
        } else if (desc.includes('cube') || desc.includes('box') || desc.includes('hypercube')) {
            params.geometry = 1; // Hypercube
        } else if (desc.includes('fractal') || desc.includes('recursive')) {
            params.geometry = 5; // Fractal
        } else if (desc.includes('wave') || desc.includes('ocean') || desc.includes('water')) {
            params.geometry = 6; // Wave
        } else if (desc.includes('torus') || desc.includes('donut')) {
            params.geometry = 3; // Torus
        }
        
        // Complexity
        if (desc.includes('complex') || desc.includes('detailed') || desc.includes('intricate')) {
            params.gridDensity = 60 + Math.random() * 40;
            params.morphFactor = 1.5 + Math.random() * 0.5;
        } else if (desc.includes('simple') || desc.includes('minimal') || desc.includes('clean')) {
            params.gridDensity = 10 + Math.random() * 15;
            params.morphFactor = 0.3 + Math.random() * 0.4;
        }
        
        // 4D Rotation for effects
        if (desc.includes('rotating') || desc.includes('spinning') || desc.includes('dimensional')) {
            params.rot4dXW = (Math.random() - 0.5) * 6.28;
            params.rot4dYW = (Math.random() - 0.5) * 6.28;
            params.rot4dZW = (Math.random() - 0.5) * 6.28;
        }
        
        // Holographic effects
        if (desc.includes('holographic') || desc.includes('hologram')) {
            params.intensity = Math.max(0.7, params.intensity);
            params.morphFactor = Math.max(1.2, params.morphFactor);
            params.chaos = Math.max(0.4, params.chaos);
        }
        
        return this.validateParameters(params);
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