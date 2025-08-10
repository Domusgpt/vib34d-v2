# VIB34D GALLERY FIXES - COMPACT ACTION PLAN

## 🚨 TWO MAIN ISSUES TO FIX:

### 1. **Gallery Previews Show Wrong Visualizer**
- **Problem**: All hover previews show faceted system regardless of saved system type
- **Root Cause**: Engine activation timing in iframe context
- **Fix**: Force engine activation and canvas visibility in gallery preview iframes

### 2. **Custom Saves Create Individual Collections Instead of Date Groups**
- **Problem**: Each save creates "Gallery Collection - Date" instead of grouping by date
- **Root Cause**: UnifiedSaveManager creates individual collections per save
- **Fix**: Modify to create daily collections that append multiple saves

---

## 🛠️ IMPLEMENTATION ACTIONS:

### Action 1: Fix Gallery Preview Visualization
**File**: `index.html` - Line ~995 in `applyGalleryPreviewData()`
```javascript
// ADD: Force engine activation verification
if (previewData.system === 'quantum' && window.quantumEngine) {
    window.quantumEngine.setActive(true);
    await new Promise(resolve => setTimeout(resolve, 300));
} else if (previewData.system === 'holographic' && window.holographicSystem) {
    window.holographicSystem.setActive(true); 
    await new Promise(resolve => setTimeout(resolve, 300));
}

// ADD: Force canvas layer visibility
const systems = ['faceted', 'quantum', 'holographic'];
systems.forEach(sys => {
    const layerId = sys === 'faceted' ? 'vib34dLayers' : `${sys}Layers`;
    const layers = document.getElementById(layerId);
    if (layers) {
        layers.style.display = sys === previewData.system ? 'block' : 'none';
    }
});
```

### Action 2: Fix Custom Collection Date Grouping
**File**: `src/core/UnifiedSaveManager.js` - Line ~185 in `saveToGallery()`
```javascript
// REPLACE: Individual collection creation
// WITH: Date-based collection grouping

async saveToGallery(variation) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const collectionKey = `custom-saves-${today}`;
    
    // Get or create today's collection
    let todaysCollection = this.collections.get(collectionKey);
    if (!todaysCollection) {
        todaysCollection = {
            name: `Custom Saves - ${today}`,
            description: `Custom variations saved on ${new Date().toLocaleDateString()}`,
            variations: []
        };
        this.collections.set(collectionKey, todaysCollection);
    }
    
    // Add to existing daily collection instead of creating new one
    todaysCollection.variations.push({
        id: todaysCollection.variations.length,
        name: variation.name,
        system: variation.system,
        parameters: this.normalizeParameters(variation.parameters)
    });
    
    // Update and save
    todaysCollection.totalVariations = todaysCollection.variations.length;
    this.saveCollectionsToStorage();
}
```

---

## 🎯 QUICK TEST PLAN:

### Test Gallery Previews:
1. Open gallery → Hover over quantum/holographic variations
2. Should see different visualization systems (not all faceted)
3. Check console for engine activation logs

### Test Custom Collection Grouping:
1. Save 2-3 custom variations on same day
2. Refresh gallery → Should appear in single "Custom Saves - DATE" collection
3. Not individual collections per save

## 📋 FILES TO MODIFY:
- `index.html` (gallery preview engine activation)
- `src/core/UnifiedSaveManager.js` (date-based collection grouping)

## ⏱️ ESTIMATED TIME: 
- 30 minutes to implement both fixes
- 15 minutes testing and verification

**Result**: Gallery will show correct visualization systems in previews + organize custom saves by date instead of individual collections.