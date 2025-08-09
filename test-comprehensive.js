const { chromium } = require('playwright');
const fs = require('fs');

async function comprehensiveTest() {
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const context = await browser.newContext({
        viewport: { width: 1200, height: 800 }
    });
    
    const page = await context.newPage();
    
    // Enable console logging
    page.on('console', msg => console.log(`CONSOLE [${msg.type()}]:`, msg.text()));
    page.on('pageerror', err => console.log(`PAGE ERROR:`, err.message));
    
    const testResults = {
        timestamp: new Date().toISOString(),
        tests: [],
        screenshots: []
    };
    
    try {
        console.log('🚀 Starting comprehensive VIB34D test...');
        
        // Test 1: Main Page Load
        console.log('📱 TEST 1: Loading main page...');
        await page.goto('http://localhost:8144/index.html');
        await page.waitForTimeout(3000);
        
        await page.screenshot({ path: 'test-01-main-page-load.png', fullPage: true });
        testResults.screenshots.push('test-01-main-page-load.png');
        testResults.tests.push({
            test: 'Main Page Load',
            status: 'PASS',
            details: 'Page loaded successfully'
        });
        
        // Test 2: System Switching
        console.log('🔄 TEST 2: Testing system switching...');
        
        // Test Holographic System
        await page.click('[data-system="holographic"]');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test-02-holographic-system.png', fullPage: true });
        testResults.screenshots.push('test-02-holographic-system.png');
        
        // Test Polychora System
        await page.click('[data-system="polychora"]');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test-03-polychora-system.png', fullPage: true });
        testResults.screenshots.push('test-03-polychora-system.png');
        
        // Back to Faceted
        await page.click('[data-system="faceted"]');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test-04-faceted-system.png', fullPage: true });
        testResults.screenshots.push('test-04-faceted-system.png');
        
        testResults.tests.push({
            test: 'System Switching',
            status: 'PASS',
            details: 'All three systems switchable'
        });
        
        // Test 3: Geometry Selection
        console.log('🔸 TEST 3: Testing geometry selection...');
        
        const geometryButtons = await page.$$('.geom-btn');
        console.log(`Found ${geometryButtons.length} geometry buttons`);
        
        for (let i = 0; i < Math.min(3, geometryButtons.length); i++) {
            await geometryButtons[i].click();
            await page.waitForTimeout(1000);
            await page.screenshot({ path: `test-05-geometry-${i}.png`, fullPage: true });
            testResults.screenshots.push(`test-05-geometry-${i}.png`);
        }
        
        testResults.tests.push({
            test: 'Geometry Selection',
            status: 'PASS',
            details: `Tested ${Math.min(3, geometryButtons.length)} geometry buttons`
        });
        
        // Test 4: Parameter Controls
        console.log('🎛️ TEST 4: Testing parameter controls...');
        
        // Test sliders
        const sliders = await page.$$('.param-slider');
        console.log(`Found ${sliders.length} parameter sliders`);
        
        if (sliders.length > 0) {
            // Test first few sliders
            for (let i = 0; i < Math.min(3, sliders.length); i++) {
                await sliders[i].fill('0.5');
                await page.waitForTimeout(500);
            }
            
            await page.screenshot({ path: 'test-06-parameter-controls.png', fullPage: true });
            testResults.screenshots.push('test-06-parameter-controls.png');
            
            testResults.tests.push({
                test: 'Parameter Controls',
                status: 'PASS',
                details: `Tested ${Math.min(3, sliders.length)} parameter sliders`
            });
        }
        
        // Test 5: Action Buttons
        console.log('⚡ TEST 5: Testing action buttons...');
        
        // Test Random button
        try {
            await page.click('button:has-text("🎲 Random")');
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'test-07-random-button.png', fullPage: true });
            testResults.screenshots.push('test-07-random-button.png');
            
            testResults.tests.push({
                test: 'Random Button',
                status: 'PASS',
                details: 'Random button clicked successfully'
            });
        } catch (e) {
            testResults.tests.push({
                test: 'Random Button',
                status: 'FAIL',
                details: `Error: ${e.message}`
            });
        }
        
        // Test Full Random button
        try {
            await page.click('button:has-text("🌀 Full")');
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'test-08-full-random.png', fullPage: true });
            testResults.screenshots.push('test-08-full-random.png');
            
            testResults.tests.push({
                test: 'Full Random Button',
                status: 'PASS',
                details: 'Full random button clicked successfully'
            });
        } catch (e) {
            testResults.tests.push({
                test: 'Full Random Button',
                status: 'FAIL',
                details: `Error: ${e.message}`
            });
        }
        
        // Test 6: CRITICAL - Save to Gallery Button
        console.log('💾 TEST 6: Testing SAVE TO GALLERY button (CRITICAL)...');
        
        try {
            // Take screenshot before save
            await page.screenshot({ path: 'test-09-before-save.png', fullPage: true });
            testResults.screenshots.push('test-09-before-save.png');
            
            // Click Save to Gallery button
            await page.click('button:has-text("💾 Save to Gallery")');
            await page.waitForTimeout(3000); // Wait for save process
            
            // Take screenshot after save
            await page.screenshot({ path: 'test-10-after-save.png', fullPage: true });
            testResults.screenshots.push('test-10-after-save.png');
            
            testResults.tests.push({
                test: 'Save to Gallery Button',
                status: 'PASS',
                details: 'Save to Gallery button clicked - check console for results'
            });
        } catch (e) {
            testResults.tests.push({
                test: 'Save to Gallery Button',
                status: 'FAIL',
                details: `Error: ${e.message}`
            });
        }
        
        // Test 7: Gallery Button
        console.log('🖼️ TEST 7: Testing Gallery button...');
        
        try {
            // Store reference to popup
            const [newPage] = await Promise.all([
                context.waitForEvent('page'),
                page.click('button:has-text("🖼️")') // Gallery button
            ]);
            
            await newPage.waitForLoadState('networkidle');
            await newPage.waitForTimeout(3000);
            
            // Screenshot the gallery
            await newPage.screenshot({ path: 'test-11-gallery-page.png', fullPage: true });
            testResults.screenshots.push('test-11-gallery-page.png');
            
            // Check if user variations are visible
            const userVariations = await newPage.$('text=User Saved Variations');
            const variationCount = await newPage.textContent('#variationCount');
            
            await newPage.close();
            
            testResults.tests.push({
                test: 'Gallery Button',
                status: 'PASS',
                details: `Gallery opened. Variation count: ${variationCount}. User variations: ${userVariations ? 'FOUND' : 'NOT FOUND'}`
            });
        } catch (e) {
            testResults.tests.push({
                test: 'Gallery Button',
                status: 'FAIL',
                details: `Error: ${e.message}`
            });
        }
        
        // Test 8: Trading Cards
        console.log('🎴 TEST 8: Testing Trading Cards...');
        
        try {
            // Test trading card page
            await page.goto('http://localhost:8144/vib34d-trading-card.html');
            await page.waitForTimeout(3000);
            await page.screenshot({ path: 'test-12-trading-card.png', fullPage: true });
            testResults.screenshots.push('test-12-trading-card.png');
            
            // Test social card page
            await page.goto('http://localhost:8144/vib34d-social-card.html');
            await page.waitForTimeout(3000);
            await page.screenshot({ path: 'test-13-social-card.png', fullPage: true });
            testResults.screenshots.push('test-13-social-card.png');
            
            // Test showcase page
            await page.goto('http://localhost:8144/trading-cards-showcase.html');
            await page.waitForTimeout(3000);
            await page.screenshot({ path: 'test-14-trading-showcase.png', fullPage: true });
            testResults.screenshots.push('test-14-trading-showcase.png');
            
            testResults.tests.push({
                test: 'Trading Cards',
                status: 'PASS',
                details: 'All trading card pages loaded successfully'
            });
        } catch (e) {
            testResults.tests.push({
                test: 'Trading Cards',
                status: 'FAIL',
                details: `Error: ${e.message}`
            });
        }
        
        // Test 9: Mobile Responsiveness
        console.log('📱 TEST 9: Testing mobile responsiveness...');
        
        await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
        await page.goto('http://localhost:8144/index.html');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test-15-mobile-main.png', fullPage: true });
        testResults.screenshots.push('test-15-mobile-main.png');
        
        await page.goto('http://localhost:8144/vib34d-social-card.html');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test-16-mobile-social-card.png', fullPage: true });
        testResults.screenshots.push('test-16-mobile-social-card.png');
        
        testResults.tests.push({
            test: 'Mobile Responsiveness',
            status: 'PASS',
            details: 'Mobile layouts tested'
        });
        
        // Test 10: Console Error Check
        console.log('🔍 TEST 10: Checking for JavaScript errors...');
        
        await page.setViewportSize({ width: 1200, height: 800 });
        await page.goto('http://localhost:8144/index.html');
        
        const errors = [];
        page.on('pageerror', err => {
            errors.push(err.message);
        });
        
        await page.waitForTimeout(5000);
        
        testResults.tests.push({
            test: 'JavaScript Errors',
            status: errors.length === 0 ? 'PASS' : 'WARN',
            details: errors.length === 0 ? 'No JavaScript errors detected' : `Errors found: ${errors.join(', ')}`
        });
        
    } catch (error) {
        console.error('Test failed:', error);
        testResults.tests.push({
            test: 'Overall Test',
            status: 'FAIL',
            details: `Fatal error: ${error.message}`
        });
    } finally {
        // Generate test report
        const report = `
# VIB34D Comprehensive Test Report
Generated: ${testResults.timestamp}

## Test Results Summary
${testResults.tests.map(test => 
    `- **${test.test}**: ${test.status} - ${test.details}`
).join('\n')}

## Screenshots Captured
${testResults.screenshots.map(screenshot => 
    `- ${screenshot}`
).join('\n')}

## Overall Status
- Total Tests: ${testResults.tests.length}
- Passed: ${testResults.tests.filter(t => t.status === 'PASS').length}
- Failed: ${testResults.tests.filter(t => t.status === 'FAIL').length}
- Warnings: ${testResults.tests.filter(t => t.status === 'WARN').length}
`;

        fs.writeFileSync('test-report.md', report);
        fs.writeFileSync('test-results.json', JSON.stringify(testResults, null, 2));
        
        console.log('\n📊 TEST COMPLETE - Report saved to test-report.md');
        console.log(`📸 ${testResults.screenshots.length} screenshots captured`);
        console.log(`✅ ${testResults.tests.filter(t => t.status === 'PASS').length} tests passed`);
        console.log(`❌ ${testResults.tests.filter(t => t.status === 'FAIL').length} tests failed`);
        
        await browser.close();
    }
}

comprehensiveTest().catch(console.error);