# AC/DC Thunder Bolt Feature

The AC/DC band preview now includes the iconic thunder bolt that appears between AC and DC based on space placement in the user input.

## How Thunder Positioning Works

The thunder bolt position is determined by where spaces appear in the user's text input:

### Thunder Placement Modes

1. **No Thunder** (`ACDC`)
   - Input: `"ACDC"` (no spaces)
   - Result: Regular AC/DC text with no thunder bolt

2. **Thunder at Start** (`⚡ACDC`)
   - Input: `" ACDC"` (space at beginning)
   - Result: Thunder bolt appears before the text

3. **Thunder at End** (`ACDC⚡`)
   - Input: `"ACDC "` (space at end)
   - Result: Thunder bolt appears after the text

4. **Thunder in Middle** (`AC⚡DC`)
   - Input: `"AC DC"` (space in middle)
   - Result: Thunder bolt appears between AC and DC
   - Special rendering: Text parts are rendered separately with space for thunder

## Configuration Variables

Located in `src/previewConfig.js`:

```javascript
export const ACDC_THUNDER_CONFIG = {
  // Thunder size relative to font size
  THUNDER_SIZE_NORMAL: 0.8,  // 80% of font height for normal scaling
  THUNDER_SIZE_SMALL: 0.75,   // 75% of font height for small scaling
  
  // Thunder positioning offsets
  THUNDER_OFFSET_X: 0,   // Horizontal offset adjustment
  THUNDER_OFFSET_Y: -10, // Vertical offset adjustment (negative moves up)
  
  // Placement mode constants
  PLACEMENT_MODES: {
    START: 'start',
    END: 'end', 
    MIDDLE: 'middle',
    NONE: 'none'
  }
}
```

## Implementation Details

### Thunder Analysis Function
- `analyzeThunderPlacement()` - Analyzes input text to determine thunder mode and position
- Returns thunder mode, x-position, and text parts for rendering

### Thunder Drawing Function  
- `drawThunderBolt()` - Loads and draws the thunder.png image
- Handles scaling based on text length (normal/small)
- Applies positioning offsets

### Special Text Rendering
- For middle thunder placement, text is split and rendered in two parts
- Creates proper spacing for the thunder bolt between text parts
- Maintains consistent AC/DC styling (red fill, yellow border, black outline)

## Thunder Image
- Location: `src/assets/thunder.png`
- Classic yellow lightning bolt icon
- Automatically scales with text size and dual scaling system

## Examples

Try these inputs in the AC/DC band preview:
- `"ACDC"` → No thunder
- `" ACDC"` → Thunder at start  
- `"ACDC "` → Thunder at end
- `"AC DC"` → Thunder between AC and DC

The thunder bolt perfectly complements the classic AC/DC logo styling!
