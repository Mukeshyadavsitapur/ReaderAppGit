---
name: Chatbot Character Picker Pattern
description: Detailed instructions and implementation patterns for the modern grid-based character selection UI in ReaderApp.
---

# Chatbot Character Picker Implementation

## Overview
The chatbot character picker is designed as a modern, 2-column grid that allows users to select from a variety of specialized AI companions. It features a premium design with vertical cards, subtle shadows, and responsive layouts.

## Component Architecture

### 1. Grid Container
The picker uses a `ScrollView` containing a `View` that implements the 2-column grid.
- **Styling**:
  ```tsx
  <View style={{ 
      flexDirection: 'row', 
      flexWrap: 'wrap', 
      justifyContent: 'space-between',
      gap: 12,
      marginTop: 10
  }}>
  ```

### 2. Character Card (Grid Item)
Each character is represented by a `TouchableOpacity` card with a vertical layout.
- **Sizing**: `width: '48%'` and `aspectRatio: 1`.
- **Layout**: `justifyContent: 'space-between'` to anchor the icon at the top and text at the bottom.
- **Styling**:
  - `borderRadius: 24`
  - Border: `borderWidth: 1`, `borderColor: theme.border`.
  - Background: `backgroundColor: isDay ? '#ffffff' : theme.uiBg`.
  - Shadows: `shadowOpacity: 0.03`, `shadowRadius: 4`, `elevation: 2`.

### 3. Icon/Initial Container
- **Standard Characters**: Balanced icon (size 24) in a circular container (`borderRadius: 16`) using `theme.highlight` background.
- **Custom Characters**: Large initial (size 24) with bold weight.
- **Color Logic**: Uses `char.color[0]` for icon/text color. Background uses `theme.highlight` for consistency.

### 4. Text & Labels
- **Title**: Font size 16, weight 900, with tight letter spacing.
- **Role**: Font size 11, secondary color, opacity 0.7.
- **Custom Badge**: A small, absolute-positioned badge for custom characters.

### 5. "Add New Character" Action
The action button is integrated into the grid as a dashed-border card.
- **Styling**: `borderStyle: 'dashed'`, `borderWidth: 1.5`, `borderColor: theme.border`.

## Best Practices
1. **Consistency**: Ensure the grid layout matches the `GeminiHome` tool grid for a unified app experience. Use `theme.uiBg` and `theme.border` for predictable results.
2. **Visual Hierarchy**: Icons should be the primary focal point, followed by bold titles.
3. **Touch Targets**: Maintain `48%` width and `aspectRatio: 1` to ensure easy-to-tap grid items.
4. **Theme Adaptation**: Use `isDay` (from `theme.id === 'day'`) to pick between `#ffffff` and `theme.uiBg` for the card background.
