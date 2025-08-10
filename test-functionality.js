#!/usr/bin/env node

/**
 * VIB34D Functionality Test Suite
 * Tests core functionality without browser dependency
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 VIB34D Functionality Test Suite');
console.log('=====================================');

// Test 1: File Structure
console.log('\n📁 Test 1: File Structure');
const requiredFiles = [
    'index.html',
    'gallery.html', 
    'src/core/Engine.js',
    'src/core/Parameters.js',
    'src/quantum/QuantumEngine.js',
    'src/holograms/RealHolographicSystem.js',
    'src/core/PolychoraSystem.js',
    'src/export/TradingCardGenerator.js'
];

let fileTests = 0;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} exists`);
        fileTests++;
    } else {
        console.log(`❌ ${file} MISSING`);
    }
});

console.log(`📊 File Structure: ${fileTests}/${requiredFiles.length} files present`);

// Test 2: HTML Structure Analysis
console.log('\n🌐 Test 2: HTML Structure');
try {
    const indexHtml = fs.readFileSync('index.html', 'utf8');
    
    // Check for canvas layers
    const canvasLayers = [
        'id="vib34dLayers"',
        'id="quantumLayers"', 
        'id="holographicLayers"',
        'id="polychoraLayers"'
    ];
    
    let canvasTests = 0;
    canvasLayers.forEach(layer => {
        if (indexHtml.includes(layer)) {
            console.log(`✅ Canvas layer ${layer} found`);
            canvasTests++;
        } else {
            console.log(`❌ Canvas layer ${layer} MISSING`);
        }
    });
    
    // Check for system switching function
    if (indexHtml.includes('window.switchSystem')) {
        console.log('✅ System switching function found');
    } else {
        console.log('❌ System switching function MISSING');
    }
    
    // Check for parameter routing fix
    if (indexHtml.includes('window.currentSystem || \'faceted\'')) {
        console.log('✅ Parameter routing fix applied');
    } else {
        console.log('❌ Parameter routing fix MISSING');
    }
    
    // Check for canvas management
    if (indexHtml.includes('CanvasLayerManager')) {
        console.log('✅ Canvas management system found');
    } else {
        console.log('❌ Canvas management system MISSING');
    }
    
    console.log(`📊 HTML Structure: ${canvasTests}/4 canvas layers + system functions`);
    
} catch (error) {
    console.log(`❌ HTML Analysis failed: ${error.message}`);
}

// Test 3: Gallery Structure Analysis
console.log('\n🖼️ Test 3: Gallery Structure');
try {
    const galleryHtml = fs.readFileSync('gallery.html', 'utf8');
    
    // Check for holographic effects
    const holographicFeatures = [
        'Canvas-only bending with 2x expansion',
        'Host card counter-bend effect',
        'scale(2.0)',
        'rotateY(calc((var(--mouse-x) - 50) * 0.4deg))',
        'postMessage'
    ];
    
    let holographicTests = 0;
    holographicFeatures.forEach(feature => {
        if (galleryHtml.includes(feature)) {
            console.log(`✅ ${feature} found`);
            holographicTests++;
        } else {
            console.log(`❌ ${feature} MISSING`);
        }
    });
    
    console.log(`📊 Gallery Features: ${holographicTests}/${holographicFeatures.length} holographic features`);
    
} catch (error) {
    console.log(`❌ Gallery Analysis failed: ${error.message}`);
}

// Test 4: Engine Files Analysis
console.log('\n⚙️ Test 4: Engine Files');
const engines = [
    { file: 'src/core/Engine.js', class: 'VIB34DIntegratedEngine' },
    { file: 'src/quantum/QuantumEngine.js', class: 'QuantumEngine' },
    { file: 'src/holograms/RealHolographicSystem.js', class: 'RealHolographicSystem' }
];

engines.forEach(engine => {
    try {
        if (fs.existsSync(engine.file)) {
            const content = fs.readFileSync(engine.file, 'utf8');
            if (content.includes(engine.class)) {
                console.log(`✅ ${engine.class} found in ${engine.file}`);
            } else {
                console.log(`❌ ${engine.class} MISSING from ${engine.file}`);
            }
        } else {
            console.log(`❌ ${engine.file} does not exist`);
        }
    } catch (error) {
        console.log(`❌ Engine analysis failed for ${engine.file}: ${error.message}`);
    }
});

// Test 5: Configuration Check
console.log('\n🔧 Test 5: System Configuration');
try {
    const indexHtml = fs.readFileSync('index.html', 'utf8');
    
    // Check for all systems in configuration
    const systemConfigs = ['faceted', 'quantum', 'holographic', 'polychora'];
    systemConfigs.forEach(system => {
        if (indexHtml.includes(`'${system}'`)) {
            console.log(`✅ ${system} system configured`);
        } else {
            console.log(`❌ ${system} system configuration MISSING`);
        }
    });
    
} catch (error) {
    console.log(`❌ Configuration check failed: ${error.message}`);
}

console.log('\n🎯 Test Summary');
console.log('================');
console.log('Run this script to verify core file structure and implementations.');
console.log('For full functionality testing, open http://localhost:8144 in browser.');
console.log('Expected: All 4 systems switchable, parameters working, gallery previews correct.');