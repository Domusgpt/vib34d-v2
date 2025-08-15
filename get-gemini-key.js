/**
 * Script to help get a Gemini API key for VIB34D
 */

console.log('🔑 VIB34D Gemini API Key Setup');
console.log('============================');
console.log();
console.log('1. Go to: https://aistudio.google.com/app/apikey');
console.log('2. Sign in with your Google account');
console.log('3. Click "Create API Key"');
console.log('4. Select "Create API key in new project" or use existing project');
console.log('5. Copy the generated key (starts with "AIza...")');
console.log();
console.log('Once you have the key, run:');
console.log('firebase functions:config:set gemini.api_key="YOUR_KEY_HERE"');
console.log();
console.log('Then deploy with:');
console.log('firebase deploy --only functions');
console.log();

// Alternative: Create a test key for immediate testing
const testDescription = 'bright cosmic enlightenment';
console.log('🧪 For immediate testing, I can create a mock response:');
console.log(`Description: "${testDescription}"`);
console.log('Expected parameters:');
console.log(JSON.stringify({
    geometry: 5, // Fractal for cosmic patterns
    hue: 280,    // Purple/magenta for enlightenment  
    intensity: 0.9, // Bright
    saturation: 0.8,
    speed: 1.2,  // Moderate-fast
    chaos: 0.4,  // Some cosmic chaos
    morphFactor: 1.6, // High transformation
    gridDensity: 60, // Complex details
    rot4dXW: 2.1,
    rot4dYW: -1.3, 
    rot4dZW: 0.8
}, null, 2));