# Deployment Guide - Unified Service Portal

This guide provides complete instructions for building, packaging, and deploying the Unified Service Portal desktop application.

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Building the Backend](#building-the-backend)
4. [Building the Frontend](#building-the-frontend)
5. [Creating Desktop Packages](#creating-desktop-packages)
6. [Manual Packaging](#manual-packaging)
7. [Automated Release via GitHub Actions](#automated-release-via-github-actions)
8. [Testing the Package](#testing-the-package)
9. [Troubleshooting](#troubleshooting)

## Overview

The Unified Service Portal is packaged as an Electron desktop application that bundles:
- **Frontend**: React + Vite application
- **Backend**: Spring Boot JAR with embedded H2 database
- **Runtime**: Java Runtime Environment (optional bundling)

Target package size: Under 400 MB (currently ~150-200 MB without JRE)

## Prerequisites

### Development Machine Requirements

- **Node.js**: Version 18 or higher
- **Java JDK**: Version 17 or higher
- **Maven**: Version 3.6 or higher
- **Git**: Latest version

#### For Windows Packaging:
- Windows 10/11 (64-bit)
- NSIS (automatically installed by electron-builder)

#### For Linux Packaging:
- Ubuntu 20.04+ or similar Linux distribution
- Required packages:
  ```bash
  sudo apt update
  sudo apt install -y build-essential fakeroot rpm
  ```

## Building the Backend

### 1. Navigate to Backend Directory
```bash
cd demo/demo
```

### 2. Build the Executable JAR
```bash
mvn clean package -DskipTests
```

This creates `target/service.jar` (approximately 76 MB).

### 3. Verify the Build
```bash
ls -lh target/service.jar
java -jar target/service.jar --spring.profiles.active=production
```

Press Ctrl+C to stop after verifying it starts.

### 4. Test Health Endpoint
```bash
curl http://localhost:8081/api/health
```

Expected response:
```json
{
  "status": "UP",
  "message": "Unified Service Portal is running",
  "timestamp": "1708234567890"
}
```

## Building the Frontend

### 1. Navigate to Frontend Directory
```bash
cd vite-project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build for Production
```bash
npm run build:prod
```

This creates optimized files in `dist/` directory (approximately 2-5 MB).

### 4. Preview the Build (Optional)
```bash
npm run preview
```

## Creating Desktop Packages

### Option 1: Build All Platforms (Linux only)
```bash
cd vite-project
npm run package
```

This builds for both Windows and Linux. Only works on Linux host.

### Option 2: Build for Specific Platform

#### Windows Packages
```bash
npm run electron:build:win
```

Creates:
- `release/UnifiedServicePortal-*-Setup.exe` (NSIS installer)
- `release/UnifiedServicePortal-*-portable.exe` (Portable version)

#### Linux Packages
```bash
npm run electron:build:linux
```

Creates:
- `release/UnifiedServicePortal-*.AppImage` (Universal)
- `release/UnifiedServicePortal-*.deb` (Debian/Ubuntu)
- `release/UnifiedServicePortal-*.rpm` (Fedora/RHEL)

### Package Sizes
Expected sizes:
- Windows installer: 120-150 MB
- Windows portable: 120-150 MB
- Linux AppImage: 130-160 MB
- Linux .deb: 120-150 MB
- Linux .rpm: 120-150 MB

## Manual Packaging

If you need to create a custom package structure:

### Directory Structure
```
UnifiedServicePortal/
├── app/
│   ├── electron/          # Electron main process
│   ├── frontend/          # Built React app (from dist/)
│   └── resources/         # Icons, assets
├── backend/
│   └── service.jar        # Spring Boot JAR
├── jre/                   # (Optional) Bundled Java Runtime
├── logs/                  # Application logs (created at runtime)
├── data/                  # H2 database (created at runtime)
├── config/
│   └── application.properties  # Custom configuration
├── start.bat              # Windows launcher
├── start.sh               # Linux launcher
├── README.md
└── LICENSE.txt
```

### Steps

1. **Create base directory**:
   ```bash
   mkdir -p UnifiedServicePortal/{app/electron,app/frontend,app/resources,backend,config}
   ```

2. **Copy built files**:
   ```bash
   # Backend
   cp demo/demo/target/service.jar UnifiedServicePortal/backend/
   
   # Frontend
   cp -r vite-project/dist/* UnifiedServicePortal/app/frontend/
   
   # Electron files
   cp vite-project/app/electron/* UnifiedServicePortal/app/electron/
   cp vite-project/app/resources/* UnifiedServicePortal/app/resources/
   
   # Launchers
   cp vite-project/start.* UnifiedServicePortal/
   
   # License
   cp vite-project/LICENSE.txt UnifiedServicePortal/
   ```

3. **Create archive**:
   ```bash
   # For Linux
   tar -czf UnifiedServicePortal-linux.tar.gz UnifiedServicePortal/
   
   # For Windows (use 7-Zip or WinRAR)
   7z a UnifiedServicePortal-windows.zip UnifiedServicePortal/
   ```

## Automated Release via GitHub Actions

### Triggering a Release

1. **Tag the release**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Monitor the workflow**:
   - Go to GitHub Actions tab in your repository
   - Watch the "Build and Release" workflow
   - Check each job (Backend, Frontend, Windows, Linux)

3. **Download from Releases**:
   - Once complete, go to Releases tab
   - Find your tagged release
   - Download platform-specific installers

### Workflow Steps

The GitHub Actions workflow automatically:
1. Builds backend JAR with Maven
2. Builds frontend with Vite
3. Packages for Windows on Windows runner
4. Packages for Linux on Ubuntu runner
5. Creates GitHub Release with all artifacts

### Manual Workflow Trigger

You can also trigger the workflow manually:
1. Go to Actions tab
2. Select "Build and Release" workflow
3. Click "Run workflow"
4. Select branch and run

## Testing the Package

### Windows Testing

1. **Install from NSIS installer**:
   ```cmd
   UnifiedServicePortal-1.0.0-Setup.exe
   ```
   - Follow installation wizard
   - Choose installation directory
   - Select desktop shortcut option

2. **Run portable version**:
   ```cmd
   UnifiedServicePortal-1.0.0-portable.exe
   ```
   - No installation required
   - Runs from any directory

3. **Verify**:
   - Application should start automatically
   - Check system tray for icon
   - Navigate to different pages
   - Verify database persistence (close and reopen)

### Linux Testing

1. **AppImage** (Recommended for testing):
   ```bash
   chmod +x UnifiedServicePortal-1.0.0.AppImage
   ./UnifiedServicePortal-1.0.0.AppImage
   ```

2. **Debian/Ubuntu (.deb)**:
   ```bash
   sudo dpkg -i UnifiedServicePortal-1.0.0.deb
   unified-service-portal
   ```

3. **Fedora/RHEL (.rpm)**:
   ```bash
   sudo rpm -i UnifiedServicePortal-1.0.0.rpm
   unified-service-portal
   ```

### Test Checklist

- [ ] Application starts without errors
- [ ] Backend health check returns UP
- [ ] Login with default credentials works
- [ ] All pages load correctly
- [ ] Database persists data after restart
- [ ] System tray icon appears and works
- [ ] Quit from tray properly shuts down backend
- [ ] No console errors or warnings
- [ ] Package size is under 400 MB
- [ ] Works offline (no internet required)

## Troubleshooting

### Build Issues

#### Maven Build Fails
```bash
# Clear Maven cache
rm -rf ~/.m2/repository
mvn clean install
```

#### NPM Install Fails
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Electron Build Fails
```bash
# Install electron-builder dependencies
sudo apt install -y libgtk-3-dev libnotify-dev libnss3 libxss1

# Clear electron cache
rm -rf ~/.electron
npm run electron:build
```

### Runtime Issues

#### Backend Won't Start
- Check Java installation: `java -version`
- Check port 8081 is not in use: `lsof -i :8081` (Linux) or `netstat -ano | findstr :8081` (Windows)
- Check logs: `logs/backend.log` or `logs/application.log`

#### Frontend Won't Load
- Verify backend is running: `curl http://localhost:8081/api/health`
- Check Electron console: Enable DevTools in main.js (development mode)
- Check for CORS errors in browser console

#### Database Issues
- Delete `data/` directory to reset database
- Check file permissions on `data/` directory
- Verify H2 driver is included in JAR: `jar tf service.jar | grep h2`

### Package Size Issues

If package exceeds 400 MB:

1. **Remove source maps**:
   ```javascript
   // vite.config.js
   build: {
     sourcemap: false
   }
   ```

2. **Exclude dev dependencies**:
   ```bash
   npm prune --production
   ```

3. **Compress with UPX** (optional):
   ```bash
   upx --best service.jar
   ```

4. **Use JLink for minimal JRE**:
   ```bash
   jlink --add-modules java.base,java.sql,java.naming,java.desktop,java.management,java.security.jgss,java.instrument \
         --output jre-minimal \
         --compress 2 \
         --no-header-files \
         --no-man-pages
   ```

### Network Issues

#### Health Check Timeout
- Increase `MAX_HEALTH_CHECK_ATTEMPTS` in `main.js`
- Check firewall settings
- Verify backend is bound to `localhost:8081`

#### CORS Errors
- Verify CORS configuration in `CorsConfig.java`
- Check `application.properties` settings
- Ensure Electron loads from correct URL

## Optimization Tips

### Backend Optimization
- Use `-XX:+UseG1GC` for better memory management
- Set `-Xmx512m` to limit memory usage
- Enable `-XX:+UseStringDeduplication`

### Frontend Optimization
- Enable gzip compression on assets
- Use lazy loading for routes
- Optimize images (WebP format)
- Remove unused dependencies

### Electron Optimization
- Use `asar` archives (enabled by default)
- Enable `compression: maximum` in electron-builder.yml
- Remove unused Electron features

## Additional Resources

- [Electron Builder Documentation](https://www.electron.build/)
- [Spring Boot Documentation](https://docs.spring.io/spring-boot/)
- [Vite Documentation](https://vitejs.dev/)
- [Maven Documentation](https://maven.apache.org/)

## Support

For issues or questions:
1. Check logs in `logs/` directory
2. Review error messages carefully
3. Consult this troubleshooting guide
4. Open an issue on GitHub repository

---

**Last Updated**: February 2026
**Version**: 1.0.0
