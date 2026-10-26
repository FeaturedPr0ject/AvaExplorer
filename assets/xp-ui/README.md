# AvaExplorer XP UI kit

A compact, original UI kit inspired by Windows XP Explorer and the Luna visual style.

- `icons.svg`: vector symbols for the toolbar, folders, drives, file types and navigation.
- `theme.css`: reusable CSS design tokens and control styles.
- `theme.json`: machine-readable color, typography and spacing values.

The graphics are original SVG recreations inspired by the era and do not include copied Windows XP DLLs, system files, or extracted proprietary icon binaries.

Use an icon from the sprite:

```html
<svg class="file-icon" aria-hidden="true">
  <use href="assets/xp-ui/icons.svg#xp-folder"></use>
</svg>
```
