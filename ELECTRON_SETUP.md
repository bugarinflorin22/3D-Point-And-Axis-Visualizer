# Building Your Math Program as a Windows EXE

## Setup Complete! ✅

Your project is now configured to build as a Windows desktop application using Electron. Here's how to use it:

## Available Commands

### 1. **Development Mode** (Test locally first)
```powershell
npm run electron-dev
```
This will:
- Start the Vite dev server on `http://localhost:5173`
- Open your app in Electron window
- Enable hot module reloading

### 2. **Build as EXE** (Create the installer)
```powershell
npm run electron-build
```
This will:
- Build your React app to the `dist` folder
- Package it with Electron
- Create two Windows installers in `dist-electron`:
  - **NSIS Installer** - Traditional Windows installer (.exe with setup wizard)
  - **Portable EXE** - Single executable file, no installation needed

## Deliverables

After running `npm run electron-build`, you'll find:
- `dist-electron/Math Program Setup X.X.X.exe` - Full installer with uninstaller
- `dist-electron/Math Program X.X.X.exe` - Portable standalone executable

## What Was Added

1. **Electron** - Desktop framework for bundling your web app
2. **Electron-builder** - Tool for packaging as EXE/MSI
3. **Public folder** - Contains:
   - `electron-main.js` - Electron entry point
   - `preload.js` - Security layer
4. **electron-builder.json5** - Configuration for Windows packaging

## First Time Setup

1. Test in development mode first:
   ```powershell
   npm run electron-dev
   ```

2. Once satisfied, build the EXE:
   ```powershell
   npm run electron-build
   ```

## Distribution

The generated EXE files can be:
- ✅ Shared directly (portable version)
- ✅ Used in an installer (NSIS version)
- ✅ Signed with a certificate (optional, removes security warning)
- ✅ Distributed to end users

## Next Steps (Optional)

### Add App Icon
1. Create a 512x512 PNG icon
2. Place it at `assets/icon.png`
3. electron-builder will automatically use it

### Code Signing
If you want to remove the Windows security warning:
1. Get a code signing certificate
2. Add `certificateFile` and `certificatePassword` to electron-builder.json5

### Customization
Edit `electron-builder.json5` to:
- Change app name
- Modify installer behavior
- Add custom shortcuts
- Set file associations

## Troubleshooting

**Port already in use?**
- Kill process on port 5173: `netstat -ano | findstr :5173`

**Build fails?**
- Run `npm install` again
- Clear node_modules and reinstall

**App won't launch?**
- Check console output in dev mode
- Ensure dist folder exists after build

---

Questions? The app is now ready for building! Run `npm run electron-build` to create your EXE.
