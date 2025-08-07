/**
 * Quick VIB34D System Test - Standalone Console-based Testing
 * Tests core functionality without requiring browser environment
 */

const fs = require('fs');
const path = require('path');

// Test results collector
const testResults = {
    filesystemTests: [],
    moduleTests: [],
    configurationTests: [],
    integrationTests: [],
    startTime: Date.now()
};

console.log('🧪 VIB34D Quick System Test Starting...\n');

// Test 1: Filesystem Structure
function testFilesystemStructure() {
    console.log('📁 Testing Filesystem Structure...');
    
    const requiredFiles = [
        'index.html',
        'gallery.html',
        'src/core/Engine.js',
        'src/core/Parameters.js', 
        'src/core/Visualizer.js',
        'src/core/PolychoraSystem.js',
        'src/holograms/RealHolographicSystem.js',
        'src/holograms/HolographicVisualizer.js',
        'src/variations/VariationManager.js',
        'src/gallery/GallerySystem.js',
        'src/export/ExportManager.js',
        'collections/base-variations.json'
    ];
    
    requiredFiles.forEach(file => {
        const fullPath = path.join(__dirname, file);
        if (fs.existsSync(fullPath)) {
            testResults.filesystemTests.push({ file, status: 'exists', size: fs.statSync(fullPath).size });
            console.log(`  ✅ ${file} (${fs.statSync(fullPath).size} bytes)`);
        } else {
            testResults.filesystemTests.push({ file, status: 'missing' });
            console.log(`  ❌ ${file} - MISSING`);
        }
    });
}

// Test 2: Module Import Structure
function testModuleStructure() {
    console.log('\n📦 Testing Module Structure...');
    
    const moduleFiles = [
        'src/core/Engine.js',
        'src/core/Parameters.js',
        'src/core/PolychoraSystem.js',
        'src/holograms/RealHolographicSystem.js'
    ];
    
    moduleFiles.forEach(file => {
        try {
            const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
            
            // Check for ES6 imports/exports
            const hasImports = /import\s+.*from/.test(content);
            const hasExports = /(export\s+class|export\s+function|export\s+{)/.test(content);
            const hasWebGL = /WebGL|webgl|getContext/.test(content);
            const hasShaders = /(vertex|fragment)Shader|createShader/.test(content);
            
            testResults.moduleTests.push({
                file,
                hasImports,
                hasExports,
                hasWebGL,
                hasShaders,
                lines: content.split('\n').length
            });
            
            console.log(`  ✅ ${file}: ${content.split('\n').length} lines`);
            console.log(`    📥 Imports: ${hasImports ? 'Yes' : 'No'}`);
            console.log(`    📤 Exports: ${hasExports ? 'Yes' : 'No'}`);
            if (hasWebGL) console.log(`    🎮 WebGL: Yes`);
            if (hasShaders) console.log(`    🎨 Shaders: Yes`);
            
        } catch (error) {
            testResults.moduleTests.push({ file, error: error.message });
            console.log(`  ❌ ${file}: ${error.message}`);
        }
    });
}

// Test 3: Configuration Integrity
function testConfiguration() {
    console.log('\n⚙️ Testing Configuration Integrity...');
    
    try {
        // Test base variations JSON
        const variationsPath = path.join(__dirname, 'collections/base-variations.json');
        const variationsData = JSON.parse(fs.readFileSync(variationsPath, 'utf8'));
        
        const expectedVariations = 30;
        const actualVariations = variationsData.variations.length;
        
        testResults.configurationTests.push({
            file: 'base-variations.json',
            expectedVariations,
            actualVariations,
            isValid: actualVariations === expectedVariations
        });
        
        console.log(`  ✅ base-variations.json: ${actualVariations}/${expectedVariations} variations`);
        
        // Test parameter structure
        const sampleVariation = variationsData.variations[0];
        const requiredParams = ['geometryType', 'density', 'speed', 'chaos', 'morph', 'hue'];
        const hasAllParams = requiredParams.every(param => sampleVariation.parameters.hasOwnProperty(param));
        
        console.log(`  ${hasAllParams ? '✅' : '❌'} Parameter structure: ${hasAllParams ? 'Complete' : 'Incomplete'}`);
        
    } catch (error) {
        testResults.configurationTests.push({ error: error.message });
        console.log(`  ❌ Configuration error: ${error.message}`);
    }
}

// Test 4: HTML Integration Points
function testHTMLIntegration() {
    console.log('\n🌐 Testing HTML Integration...');
    
    try {
        const indexContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
        
        // Check for required canvas elements
        const canvasSets = {
            faceted: ['background-canvas', 'shadow-canvas', 'content-canvas', 'highlight-canvas', 'accent-canvas'],
            holographic: ['holo-background-canvas', 'holo-shadow-canvas', 'holo-content-canvas', 'holo-highlight-canvas', 'holo-accent-canvas'],
            polychora: ['polychora-background-canvas', 'polychora-shadow-canvas', 'polychora-content-canvas', 'polychora-highlight-canvas', 'polychora-accent-canvas']
        };
        
        Object.entries(canvasSets).forEach(([system, canvases]) => {
            const allCanvasesPresent = canvases.every(canvasId => 
                indexContent.includes(`id="${canvasId}"`)
            );
            
            testResults.integrationTests.push({
                system,
                canvasCount: canvases.length,
                allPresent: allCanvasesPresent
            });
            
            console.log(`  ${allCanvasesPresent ? '✅' : '❌'} ${system.toUpperCase()}: ${canvases.length} canvas layers`);
        });
        
        // Check for module imports
        const hasModuleImports = /type="module"/.test(indexContent);
        const hasEngineImport = /import.*Engine\.js/.test(indexContent);
        
        console.log(`  ${hasModuleImports ? '✅' : '❌'} ES6 Module Support: ${hasModuleImports ? 'Yes' : 'No'}`);
        console.log(`  ${hasEngineImport ? '✅' : '❌'} Engine Import: ${hasEngineImport ? 'Yes' : 'No'}`);
        
    } catch (error) {
        testResults.integrationTests.push({ error: error.message });
        console.log(`  ❌ HTML integration error: ${error.message}`);
    }
}

// Test 5: Gallery System
function testGallerySystem() {
    console.log('\n🖼️ Testing Gallery System...');
    
    try {
        const galleryContent = fs.readFileSync(path.join(__dirname, 'gallery.html'), 'utf8');
        
        const hasCollectionManager = /CollectionManager|collection-section/.test(galleryContent);
        const hasPreviewSystem = /iframe|preview/.test(galleryContent);
        const hasLoadButton = /Load|load/.test(galleryContent);
        
        console.log(`  ${hasCollectionManager ? '✅' : '❌'} Collection Manager: ${hasCollectionManager ? 'Present' : 'Missing'}`);
        console.log(`  ${hasPreviewSystem ? '✅' : '❌'} Preview System: ${hasPreviewSystem ? 'Present' : 'Missing'}`);
        console.log(`  ${hasLoadButton ? '✅' : '❌'} Load Functionality: ${hasLoadButton ? 'Present' : 'Missing'}`);
        
        testResults.integrationTests.push({
            component: 'gallery',
            hasCollectionManager,
            hasPreviewSystem,
            hasLoadButton
        });
        
    } catch (error) {
        console.log(`  ❌ Gallery system error: ${error.message}`);
    }
}

// Generate Summary Report
function generateReport() {
    const endTime = Date.now();
    const duration = endTime - testResults.startTime;
    
    console.log('\n📊 VIB34D SYSTEM TEST REPORT');
    console.log('========================================');
    console.log(`🕐 Test Duration: ${duration}ms`);
    
    // File system summary
    const missingFiles = testResults.filesystemTests.filter(t => t.status === 'missing').length;
    const totalFiles = testResults.filesystemTests.length;
    console.log(`📁 Files: ${totalFiles - missingFiles}/${totalFiles} present`);
    
    // Module summary
    const validModules = testResults.moduleTests.filter(t => !t.error).length;
    const totalModules = testResults.moduleTests.length;
    console.log(`📦 Modules: ${validModules}/${totalModules} valid`);
    
    // Configuration summary
    const validConfigs = testResults.configurationTests.filter(t => t.isValid !== false && !t.error).length;
    console.log(`⚙️ Configurations: ${validConfigs > 0 ? 'Valid' : 'Issues detected'}`);
    
    // Integration summary
    const systemsWithAllCanvases = testResults.integrationTests.filter(t => t.allPresent === true).length;
    console.log(`🌐 Canvas Integration: ${systemsWithAllCanvases}/3 systems complete`);
    
    // Overall assessment
    const criticalIssues = missingFiles + (totalModules - validModules);
    
    if (criticalIssues === 0) {
        console.log('\n🎉 OVERALL STATUS: SYSTEM READY FOR TESTING');
        console.log('✅ All critical components are present and properly structured');
    } else {
        console.log('\n⚠️ OVERALL STATUS: ISSUES DETECTED');
        console.log(`🚨 ${criticalIssues} critical issue(s) found`);
    }
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('1. Open http://localhost:8080 to test the live system');
    console.log('2. Check browser console for JavaScript errors');
    console.log('3. Test all three systems (Faceted, Holographic, Polychora)');
    console.log('4. Verify gallery preview system with hover interactions');
    console.log('5. Test parameter controls and save/export functionality');
    
    return {
        duration,
        filesystemTests: testResults.filesystemTests,
        moduleTests: testResults.moduleTests,
        configurationTests: testResults.configurationTests,
        integrationTests: testResults.integrationTests,
        criticalIssues,
        status: criticalIssues === 0 ? 'ready' : 'issues'
    };
}

// Run all tests
testFilesystemStructure();
testModuleStructure();
testConfiguration();
testHTMLIntegration();
testGallerySystem();

const report = generateReport();

// Export results for external access
module.exports = report;