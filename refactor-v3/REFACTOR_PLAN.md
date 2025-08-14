# VIB34D CANVAS REFACTOR PLAN

## Current Architecture Issues
- **20-21 canvases**: 5 per system × 4 systems (+ 1 extra somewhere)
- **Mobile breaks**: Can't handle 20+ WebGL contexts
- **Inefficient**: Switching systems = hiding/showing different canvas sets
- **Complex**: Gallery previews, trading cards, viewer all expect specific canvas IDs

## New Architecture: 5 Canvases Total
- **5 permanent canvases**: background, shadow, content, highlight, accent
- **4 shader programs**: Switch shaders, not canvases
- **System switch**: Change shader program, not DOM elements
- **Mobile friendly**: Only 5 WebGL contexts ever

## What Must Be Preserved
1. **Gallery card tilting/previews** - Complex mouse interaction system
2. **Trading card generation** - Captures specific canvas layers
3. **Parameter system** - 11 parameters affecting all visualizations
4. **URL parameter loading** - Gallery/viewer integration
5. **Save/load system** - Portfolio management

## Refactor Steps
1. Create new index.html with only 5 canvases
2. Modify Visualizer.js to switch shaders instead of canvases
3. Update Engine.js to use shared canvases
4. Test each system thoroughly
5. Update gallery integration
6. Fix trading card references
7. Test on mobile

## Files to Modify
- `index.html` - Remove duplicate canvas elements
- `src/core/Visualizer.js` - Add shader switching logic
- `src/core/Engine.js` - Update canvas references
- `src/managers/CanvasLayerManager.js` - Simplify to 5 canvases
- `gallery.html` - Update preview system
- `src/export/TradingCardGenerator.js` - Update canvas capture

## Testing Checklist
- [ ] All 4 systems render correctly
- [ ] Parameter changes work
- [ ] System switching smooth
- [ ] Gallery previews functional
- [ ] Trading cards generate
- [ ] Mobile works with 5 contexts
- [ ] No performance regression