/**
 * VIB34D System Testing Script
 * Comprehensive testing of all three systems: Faceted, Holographic, Polychora
 */

// Test configuration
const TEST_DURATION = 3000; // 3 seconds per system
const PARAMETER_TESTS = 5; // Number of parameter changes to test

// Test results storage
let testResults = {
    faceted: { status: 'pending', errors: [], warnings: [] },
    holographic: { status: 'pending', errors: [], warnings: [] },
    polychora: { status: 'pending', errors: [], warnings: [] },
    gallery: { status: 'pending', errors: [], warnings: [] },
    overall: { status: 'pending', startTime: Date.now() }
};

// Console override to capture errors and warnings
const originalConsole = {
    error: console.error,
    warn: console.warn,
    log: console.log
};

console.error = function(...args) {
    testResults.currentSystem && testResults[testResults.currentSystem].errors.push(args.join(' '));
    originalConsole.error(...args);
};

console.warn = function(...args) {
    testResults.currentSystem && testResults[testResults.currentSystem].warnings.push(args.join(' '));
    originalConsole.warn(...args);
};

// Main test execution
async function runComprehensiveTest() {
    console.log('🧪 Starting VIB34D System Comprehensive Test...');
    
    try {
        // Wait for page to fully load
        await waitForPageLoad();
        
        // Test each system
        await testFacetedSystem();
        await testHolographicSystem();
        await testPolychoraSystem();
        
        // Test gallery integration
        await testGallerySystem();
        
        // Generate report
        generateTestReport();
        
    } catch (error) {
        console.error('🚨 Test execution failed:', error);
        testResults.overall.status = 'failed';
        testResults.overall.error = error.message;
    }
}

async function waitForPageLoad() {
    console.log('⏳ Waiting for page initialization...');
    
    return new Promise((resolve) => {
        if (document.readyState === 'complete') {
            setTimeout(resolve, 1000); // Wait 1 second after DOM ready
        } else {
            window.addEventListener('load', () => {
                setTimeout(resolve, 1000);
            });
        }
    });
}

async function testFacetedSystem() {
    console.log('🔺 Testing Faceted System...');
    testResults.currentSystem = 'faceted';
    
    try {
        // Switch to faceted system
        await switchToSystem('faceted');
        
        // Test canvas initialization
        const facetedCanvases = ['background', 'shadow', 'content', 'highlight', 'accent']
            .map(id => document.getElementById(`${id}-canvas`));
        
        if (facetedCanvases.some(canvas => !canvas)) {
            throw new Error('Missing faceted canvas elements');
        }
        
        // Test WebGL contexts
        const webglContexts = facetedCanvases.map(canvas => 
            canvas.getContext('webgl2') || canvas.getContext('webgl')
        );
        
        if (webglContexts.some(ctx => !ctx)) {
            console.warn('Some WebGL contexts failed to initialize');
        }
        
        // Test geometry buttons
        const geometryButtons = document.querySelectorAll('.geometry-btn');
        if (geometryButtons.length === 0) {
            throw new Error('No geometry buttons found');
        }
        
        // Test parameter controls
        await testParameterControls();
        
        // Test randomization
        await testRandomization();
        
        testResults.faceted.status = 'passed';
        console.log('✅ Faceted System test passed');
        
    } catch (error) {
        testResults.faceted.status = 'failed';
        testResults.faceted.errors.push(error.message);
        console.error('❌ Faceted System test failed:', error);
    }
}

async function testHolographicSystem() {
    console.log('🌀 Testing Holographic System...');
    testResults.currentSystem = 'holographic';
    
    try {
        // Switch to holographic system
        await switchToSystem('holographic');
        
        // Test holographic canvas initialization
        const holoCanvases = ['holo-background', 'holo-shadow', 'holo-content', 'holo-highlight', 'holo-accent']
            .map(id => document.getElementById(`${id}-canvas`));
        
        if (holoCanvases.some(canvas => !canvas)) {
            throw new Error('Missing holographic canvas elements');
        }
        
        // Test parameter controls work with holographic system
        await testParameterControls();
        
        testResults.holographic.status = 'passed';
        console.log('✅ Holographic System test passed');
        
    } catch (error) {
        testResults.holographic.status = 'failed';
        testResults.holographic.errors.push(error.message);
        console.error('❌ Holographic System test failed:', error);
    }
}

async function testPolychoraSystem() {
    console.log('🔷 Testing Polychora System...');
    testResults.currentSystem = 'polychora';
    
    try {
        // Switch to polychora system
        await switchToSystem('polychora');
        
        // Test polychora canvas initialization
        const polychoraCanvases = ['polychora-background', 'polychora-shadow', 'polychora-content', 'polychora-highlight', 'polychora-accent']
            .map(id => document.getElementById(`${id}-canvas`));
        
        if (polychoraCanvases.some(canvas => !canvas)) {
            throw new Error('Missing polychora canvas elements');
        }
        
        // Test polytope selection
        const polytopeButtons = document.querySelectorAll('.geometry-btn');
        if (polytopeButtons.length > 0) {
            // Click first polytope button
            polytopeButtons[0].click();
            await sleep(500);
        }
        
        // Test 4D rotation controls
        await test4DRotationControls();
        
        testResults.polychora.status = 'passed';
        console.log('✅ Polychora System test passed');
        
    } catch (error) {
        testResults.polychora.status = 'failed';
        testResults.polychora.errors.push(error.message);
        console.error('❌ Polychora System test failed:', error);
    }
}

async function testGallerySystem() {
    console.log('🖼️ Testing Gallery System...');
    testResults.currentSystem = 'gallery';
    
    try {
        // Test gallery button click
        const galleryBtn = document.querySelector('.panel-btn[onclick*="gallery"]');
        if (galleryBtn) {
            galleryBtn.click();
            await sleep(1000);
        }
        
        // Test save functionality
        const saveBtn = document.querySelector('.panel-btn[onclick*="saveToPortfolio"]');
        if (saveBtn) {
            saveBtn.click();
            await sleep(500);
        }
        
        testResults.gallery.status = 'passed';
        console.log('✅ Gallery System test passed');
        
    } catch (error) {
        testResults.gallery.status = 'failed';
        testResults.gallery.errors.push(error.message);
        console.error('❌ Gallery System test failed:', error);
    }
}

async function switchToSystem(systemName) {
    const systemBtn = document.querySelector(`[data-system="${systemName}"]`);
    if (systemBtn) {
        systemBtn.click();
        await sleep(1000); // Wait for system switch
    } else {
        // Fallback: call global switchSystem function
        if (typeof switchSystem === 'function') {
            await switchSystem(systemName);
            await sleep(1000);
        }
    }
}

async function testParameterControls() {
    const sliders = document.querySelectorAll('.control-slider');
    
    for (let i = 0; i < Math.min(PARAMETER_TESTS, sliders.length); i++) {
        const slider = sliders[i];
        const originalValue = slider.value;
        
        // Test slider change
        slider.value = (parseFloat(slider.max) + parseFloat(slider.min)) / 2;
        slider.dispatchEvent(new Event('input'));
        
        await sleep(200);
        
        // Restore original value
        slider.value = originalValue;
        slider.dispatchEvent(new Event('input'));
    }
}

async function test4DRotationControls() {
    const rotationSliders = ['rot4dXW', 'rot4dYW', 'rot4dZW'].map(id => 
        document.getElementById(id)
    ).filter(slider => slider);
    
    for (const slider of rotationSliders) {
        const originalValue = slider.value;
        slider.value = 0.5;
        slider.dispatchEvent(new Event('input'));
        await sleep(200);
        
        slider.value = originalValue;
        slider.dispatchEvent(new Event('input'));
    }
}

async function testRandomization() {
    const randomBtn = document.querySelector('.panel-btn[onclick*="randomize"]');
    if (randomBtn) {
        randomBtn.click();
        await sleep(1000);
    }
}

function generateTestReport() {
    testResults.overall.endTime = Date.now();
    testResults.overall.duration = testResults.overall.endTime - testResults.overall.startTime;
    
    const report = {
        timestamp: new Date().toISOString(),
        duration: testResults.overall.duration,
        systems: {
            faceted: testResults.faceted,
            holographic: testResults.holographic,
            polychora: testResults.polychora,
            gallery: testResults.gallery
        },
        summary: {
            passed: Object.values(testResults).filter(r => r.status === 'passed').length - 1, // -1 for overall
            failed: Object.values(testResults).filter(r => r.status === 'failed').length,
            totalErrors: Object.values(testResults).reduce((acc, r) => acc + (r.errors?.length || 0), 0),
            totalWarnings: Object.values(testResults).reduce((acc, r) => acc + (r.warnings?.length || 0), 0)
        }
    };
    
    console.log('📊 VIB34D System Test Report:');
    console.log('========================================');
    console.log('🕐 Test Duration:', report.duration + 'ms');
    console.log('✅ Systems Passed:', report.summary.passed);
    console.log('❌ Systems Failed:', report.summary.failed);
    console.log('🚨 Total Errors:', report.summary.totalErrors);
    console.log('⚠️ Total Warnings:', report.summary.totalWarnings);
    
    // Detailed results
    Object.entries(report.systems).forEach(([system, result]) => {
        console.log(`\n${system.toUpperCase()} SYSTEM:`);
        console.log('Status:', result.status);
        if (result.errors.length > 0) {
            console.log('Errors:', result.errors);
        }
        if (result.warnings.length > 0) {
            console.log('Warnings:', result.warnings);
        }
    });
    
    // Store results globally for inspection
    window.VIB34DTestResults = report;
    
    // Determine overall status
    if (report.summary.failed === 0 && report.summary.totalErrors === 0) {
        console.log('\n🎉 ALL TESTS PASSED! VIB34D System is functioning correctly.');
        testResults.overall.status = 'passed';
    } else if (report.summary.failed > 0 || report.summary.totalErrors > 0) {
        console.log('\n🚨 TESTS FAILED! Issues detected in VIB34D System.');
        testResults.overall.status = 'failed';
    } else {
        console.log('\n⚠️ TESTS COMPLETED WITH WARNINGS.');
        testResults.overall.status = 'warning';
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Auto-run test when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(runComprehensiveTest, 2000);
    });
} else {
    setTimeout(runComprehensiveTest, 2000);
}

// Export for manual testing
window.VIB34DSystemTest = {
    run: runComprehensiveTest,
    results: () => window.VIB34DTestResults
};