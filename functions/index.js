const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

/**
 * VIB34D LLM Parameter Generation Function
 * Handles Gemini API calls server-side so users don't need API keys
 */
exports.generateVIB34DParameters = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { description } = req.body;
      
      if (!description) {
        return res.status(400).json({ error: 'Description is required' });
      }

      // Real Gemini API key
      const apiKey = "AIzaSyBxB1BxPMmUSaY8pMvy47zbeVNMgfwTltQ";

      // System prompt for VIB34D parameter generation
      const systemPrompt = `You are a synesthetic AI that translates human experience into 4-dimensional holographic mathematics.

You control a VIB34D system with these parameters:
- geometry (0-7): Tetrahedron, Hypercube, Sphere, Torus, Klein Bottle, Fractal, Wave, Crystal
- hue (0-360), intensity (0-1), saturation (0-1)
- speed (0.1-3), chaos (0-1), morphFactor (0-2), gridDensity (5-100)
- rot4dXW, rot4dYW, rot4dZW (-6.28 to 6.28)

When given a description, use your understanding of:
- Visual aesthetics and emotional resonance
- Color theory and psychological associations
- Movement, rhythm, and temporal dynamics
- Mathematical beauty and complexity
- Human perception and synesthesia

Create a holographic experience that captures the essence of what they're describing.

Think beyond literal interpretation. If someone says "the sound of silence," you might create subtle, barely-there patterns with minimal chaos and low intensity. If they say "cosmic loneliness," you might use vast empty spaces with occasional fractal details.

Your goal is to create something that makes them say "YES, that's exactly what I meant, even though I couldn't have described it mathematically."

Return only JSON with the parameter names above.`;

      // Make request to Gemini API
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser description: "${description}"\n\nGenerate JSON parameters:`
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
        const errorText = await response.text();
        console.error('Gemini API error:', response.status, errorText);
        return res.status(500).json({ error: 'AI generation failed' });
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Unexpected API response format:', data);
        return res.status(500).json({ error: 'Invalid AI response' });
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        console.error('No JSON found in response:', generatedText);
        return res.status(500).json({ error: 'AI did not return valid parameters' });
      }

      try {
        const parameters = JSON.parse(jsonMatch[0]);
        
        // Validate and clamp parameters
        const validatedParams = validateParameters(parameters);
        
        console.log('Successfully generated parameters for:', description);
        return res.status(200).json({
          success: true,
          parameters: validatedParams,
          description: description
        });
        
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return res.status(500).json({ error: 'Invalid parameter format from AI' });
      }

    } catch (error) {
      console.error('Function error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});


/**
 * Validate and clamp parameters to valid ranges
 */
function validateParameters(params) {
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

  const validated = {};
  
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