# Application Icons and Resources

This directory contains the application icons and resources for the Electron app.

## Required Icons

### For Windows:
- `build/icon.ico` - Windows icon (256x256 recommended)

### For Linux:
- `build/icon.png` - Linux icon (512x512 recommended)

### For System Tray:
- `app/resources/tray-icon.png` - System tray icon (16x16 or 32x32)
- `app/resources/icon.png` - Application icon

## Creating Icons

You can create icons from an SVG or PNG using tools like:
- ImageMagick: `convert icon.png -resize 256x256 icon.ico`
- Online converters: https://icoconvert.com/
- Photoshop or GIMP

For now, placeholder 1x1 pixel images are used. Replace these with actual icons before distribution.

## Icon Guidelines

- Use a simple, recognizable design
- Ensure good contrast for system tray (light and dark modes)
- Test on both Windows and Linux
- Use transparent backgrounds where appropriate
