# Installing PharmaCare as a Windows Desktop App

PharmaCare supports Progressive Web App (PWA) installation, allowing you to install it as a desktop application on Windows (and other platforms).

## Installation Instructions

### Windows (Chrome, Edge, Brave)

1. **Open PharmaCare in your browser**
   - Navigate to your PharmaCare URL (e.g., `https://your-domain.com` or `http://localhost:5000` for local)

2. **Look for the Install button**
   - Chrome/Edge: Look for the install icon (⊕ or computer icon) in the address bar
   - Or click the three-dot menu (⋮) → "Install PharmaCare..."

3. **Click "Install"**
   - A confirmation dialog will appear
   - Click "Install" to confirm

4. **Launch the Desktop App**
   - PharmaCare will open as a standalone app
   - It will appear in your Start Menu and can be pinned to taskbar
   - The app runs without browser UI (no address bar, tabs, etc.)

### Alternative Installation Methods

#### Via Browser Menu
- **Chrome**: Menu (⋮) → "Install PharmaCare"
- **Edge**: Menu (⋮) → "Apps" → "Install this site as an app"
- **Brave**: Menu (⋮) → "Install PharmaCare"

#### Manual Desktop Shortcut (if install button doesn't appear)
1. Open PharmaCare in Chrome or Edge
2. Click the three-dot menu (⋮)
3. Select "More tools" → "Create shortcut"
4. Check "Open as window"
5. Click "Create"

## Features of Desktop App

### Benefits
- ✅ Works like a native Windows application
- ✅ Separate window from your browser
- ✅ Appears in Start Menu and taskbar
- ✅ App shortcuts for quick access (Point of Sale, Inventory)
- ✅ Faster loading with caching
- ✅ Works offline for cached pages
- ✅ No browser UI distractions

### Limitations
- Requires internet connection for API calls
- Some features may not work offline
- Updates require refreshing the app

## Managing the Installed App

### Uninstall
**Windows:**
1. Right-click the app icon in taskbar or Start Menu
2. Select "Uninstall" or "Remove"
3. Or go to Settings → Apps → PharmaCare → Uninstall

**Browser:**
- Open the app → Click the three-dot menu → "Uninstall PharmaCare"

### Update
The app automatically checks for updates. To force an update:
1. Close the app completely
2. Reopen it
3. Or clear the app cache in browser settings

## Keyboard Shortcuts

Once installed, you can create custom keyboard shortcuts:
- **Windows**: Right-click app → Properties → Shortcut tab → Set shortcut key

## Troubleshooting

### Install button doesn't appear
- Make sure you're using a supported browser (Chrome, Edge, Brave, Opera)
- Ensure the site is served over HTTPS (or localhost for development)
- Clear browser cache and reload the page
- Check if the manifest.json is loading correctly (F12 → Application tab → Manifest)

### App doesn't work offline
- PWA offline support is limited to cached pages
- API calls require an internet connection
- Try accessing the app while online first to cache assets

### Icons not showing
- Icons need to be added to the `/client/public/` directory
- Create or add `icon-192.png` and `icon-512.png` files
- The icons should be square PNG images

## Creating App Icons

To add custom icons for your installation:

1. Create two PNG icon files:
   - `icon-192.png` (192x192 pixels)
   - `icon-512.png` (512x512 pixels)

2. Place them in `client/public/` directory

3. The icons will automatically be used for:
   - Desktop shortcut
   - Start Menu
   - Taskbar
   - Windows taskbar thumbnail

## Technical Details

- **Technology**: Progressive Web App (PWA)
- **Service Worker**: Caches assets for faster loading
- **Manifest**: Defines app metadata and appearance
- **Supported Browsers**: Chrome, Edge, Brave, Opera, Samsung Internet
- **Platforms**: Windows, macOS, Linux, Android, iOS (Safari 16.4+)

## Development

When developing, you can test PWA installation on:
- `http://localhost:5000` (localhost is allowed for PWA)
- Or deploy to a HTTPS domain

To see PWA debugging info:
1. Press F12 to open DevTools
2. Go to "Application" tab
3. Check "Manifest" and "Service Workers" sections
