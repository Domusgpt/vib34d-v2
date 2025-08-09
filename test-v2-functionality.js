/**
 * VIB34D V2 - Comprehensive Functionality Test Suite
 * Tests all 4 systems and parameter controls
 */

const puppeteer = require('puppeteer');

// Test configuration
const TEST_URL = 'http://localhost:8144';
const SYSTEMS = ['faceted', 'quantum', 'holographic', 'polychora'];
const PARAMETERS = [
    { id: 'rot4dXW', min: -6.28, max: 6.28, testValue: 1.5 },
    { id: 'rot4dYW', min: -6.28, max: 6.28, testValue: -1.0 },
    { id: 'rot4dZW', min: -6.28, max: 6.28, testValue: 2.0 },
    { id: 'gridDensity', min: 5, max: 100, testValue: 25 },
    { id: 'morphFactor', min: 0, max: 2, testValue: 1.5 },
    { id: 'chaos', min: 0, max: 1, testValue: 0.5 },
    { id: 'speed', min: 0.1, max: 3, testValue: 2.0 },
    { id: 'hue', min: 0, max: 360, testValue: 180 },
    { id: 'intensity', min: 0, max: 1, testValue: 0.7 },
    { id: 'saturation', min: 0, max: 1, testValue: 0.9 }
];

async function runTests() {
    console.log('🧪 VIB34D V2 Comprehensive Test Suite Starting...\n');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set up console message capture
    const consoleLogs = [];
    page.on('console', msg => {
        const text = msg.text();
        consoleLogs.push(text);
        if (text.includes('📊') || text.includes('🔮') || text.includes('🌌')) {
            console.log(`  Console: ${text}`);
        }
    });
    
    // Capture errors
    const errors = [];
    page.on('pageerror', error => {
        errors.push(error.message);
        console.error(`  ❌ Page Error: ${error.message}`);
    });
    
    try {
        // Navigate to the application
        console.log(`📡 Navigating to ${TEST_URL}...`);
        await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
        console.log('✅ Page loaded successfully\n');
        
        // Wait for initialization
        await page.waitForTimeout(2000);
        
        // Test results storage
        const testResults = {
            systems: {},
            errors: [],
            warnings: [],
            success: true
        };
        
        // Test each system
        for (const system of SYSTEMS) {
            console.log(`\n🔧 Testing ${system.toUpperCase()} System`);
            console.log('━'.repeat(40));
            
            testResults.systems[system] = {
                switchSuccess: false,
                parameters: {},
                canvasActive: false,
                consoleErrors: []
            };
            
            // Switch to system
            console.log(`  Switching to ${system} system...`);
            const buttonSelector = `button[data-system="${system}"]`;
            
            try {
                await page.click(buttonSelector);
                await page.waitForTimeout(500);
                
                // Verify system switch
                const activeSystem = await page.evaluate(() => window.currentSystem);
                if (activeSystem === system) {
                    console.log(`  ✅ Successfully switched to ${system}`);
                    testResults.systems[system].switchSuccess = true;
                } else {
                    console.log(`  ❌ Failed to switch to ${system} (current: ${activeSystem})`);
                    testResults.success = false;
                }
            } catch (error) {
                console.log(`  ❌ Error switching to ${system}: ${error.message}`);
                testResults.systems[system].consoleErrors.push(error.message);
                testResults.success = false;
                continue;
            }
            
            // Test parameters for this system
            console.log(`  Testing parameters for ${system}...`);
            
            for (const param of PARAMETERS) {
                try {
                    // Set parameter value
                    await page.evaluate((paramId, value) => {
                        const slider = document.getElementById(paramId);
                        if (slider) {
                            slider.value = value;
                            slider.dispatchEvent(new Event('input', { bubbles: true }));
                            return true;
                        }
                        return false;
                    }, param.id, param.testValue);
                    
                    await page.waitForTimeout(100);
                    
                    // Check for parameter update in console
                    const paramLogs = consoleLogs.filter(log => 
                        log.includes(param.id) && 
                        log.includes(system.toUpperCase())
                    );
                    
                    if (paramLogs.length > 0) {
                        console.log(`    ✅ ${param.id}: Updated successfully`);
                        testResults.systems[system].parameters[param.id] = true;
                    } else {
                        console.log(`    ⚠️ ${param.id}: No console confirmation`);
                        testResults.systems[system].parameters[param.id] = false;
                    }
                    
                } catch (error) {
                    console.log(`    ❌ ${param.id}: Error - ${error.message}`);
                    testResults.systems[system].parameters[param.id] = false;
                    testResults.systems[system].consoleErrors.push(`${param.id}: ${error.message}`);
                }
            }
            
            // Check if canvas is rendering
            const canvasActive = await page.evaluate((systemName) => {
                let canvasId;
                switch(systemName) {
                    case 'faceted':
                        canvasId = 'content-canvas';
                        break;
                    case 'quantum':
                        canvasId = 'quantum-content-canvas';
                        break;
                    case 'holographic':
                        canvasId = 'holo-content-canvas';
                        break;
                    case 'polychora':
                        canvasId = 'polychora-content-canvas';
                        break;
                }
                
                const canvas = document.getElementById(canvasId);
                if (canvas) {
                    const gl = canvas.getContext('webgl');
                    return gl !== null;
                }
                return false;
            }, system);
            
            if (canvasActive) {
                console.log(`  ✅ WebGL canvas is active`);
                testResults.systems[system].canvasActive = true;
            } else {
                console.log(`  ❌ WebGL canvas is not active`);
                testResults.success = false;
            }
        }
        
        // Test action buttons
        console.log('\n🎮 Testing Action Buttons');
        console.log('━'.repeat(40));
        
        // Test Random button
        try {
            await page.evaluate(() => {
                window.randomizeAll();
            });
            console.log('  ✅ Random button functional');
        } catch (error) {
            console.log(`  ❌ Random button error: ${error.message}`);
        }
        
        // Test Reset button
        try {
            await page.evaluate(() => {
                window.resetAll();
            });
            console.log('  ✅ Reset button functional');
        } catch (error) {
            console.log(`  ❌ Reset button error: ${error.message}`);
        }
        
        // Generate test report
        console.log('\n📊 TEST SUMMARY');
        console.log('═'.repeat(50));
        
        let totalTests = 0;
        let passedTests = 0;
        
        for (const [system, results] of Object.entries(testResults.systems)) {
            console.log(`\n${system.toUpperCase()} System:`);
            
            // System switch test
            totalTests++;
            if (results.switchSuccess) {
                passedTests++;
                console.log('  ✅ System Switch: PASSED');
            } else {
                console.log('  ❌ System Switch: FAILED');
            }
            
            // Canvas test
            totalTests++;
            if (results.canvasActive) {
                passedTests++;
                console.log('  ✅ WebGL Canvas: ACTIVE');
            } else {
                console.log('  ❌ WebGL Canvas: INACTIVE');
            }
            
            // Parameter tests
            const paramResults = Object.values(results.parameters);
            const paramsPassed = paramResults.filter(r => r === true).length;
            totalTests += paramResults.length;
            passedTests += paramsPassed;
            
            console.log(`  📊 Parameters: ${paramsPassed}/${paramResults.length} working`);
            
            if (results.consoleErrors.length > 0) {
                console.log(`  ⚠️ Errors: ${results.consoleErrors.length}`);
            }
        }
        
        // Overall summary
        console.log('\n' + '═'.repeat(50));
        const successRate = ((passedTests / totalTests) * 100).toFixed(1);
        console.log(`📈 Overall Success Rate: ${successRate}% (${passedTests}/${totalTests} tests passed)`);
        
        if (errors.length > 0) {
            console.log(`\n⚠️ Page Errors Detected: ${errors.length}`);
            errors.forEach(err => console.log(`  - ${err}`));
        }
        
        if (successRate >= 90) {
            console.log('\n🎉 V2 TESTING SUCCESSFUL - Ready for deployment!');
        } else if (successRate >= 70) {
            console.log('\n⚠️ V2 TESTING PARTIALLY SUCCESSFUL - Some issues remain');
        } else {
            console.log('\n❌ V2 TESTING FAILED - Critical issues detected');
        }
        
        // Save test results
        const fs = require('fs');
        fs.writeFileSync('test-results-v2.json', JSON.stringify(testResults, null, 2));
        console.log('\n💾 Test results saved to test-results-v2.json');
        
    } catch (error) {
        console.error('\n❌ Test suite error:', error);
    }
    
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser will remain open for manual inspection...');
    console.log('Press Ctrl+C to close and continue with deployment.');
    
    // Wait indefinitely (user will Ctrl+C when ready)
    await new Promise(() => {});
}

// Run the tests
runTests().catch(console.error);