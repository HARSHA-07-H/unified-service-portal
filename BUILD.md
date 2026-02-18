# Build Instructions - Quick Start

This is a quick reference guide for building the Unified Service Portal packages. For detailed documentation, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Prerequisites

```bash
# Check versions
node --version   # Should be 18+
java -version    # Should be 17+
mvn --version    # Should be 3.6+
```

## Quick Build (Development)

### 1. Build Backend
```bash
cd demo/demo
mvn clean package -DskipTests
# Creates: target/service.jar (76MB)
```

### 2. Build Frontend
```bash
cd vite-project
npm install
npm run build:prod
# Creates: dist/ (616KB)
```

### 3. Test Locally
```bash
# Terminal 1 - Backend
cd demo/demo
java -jar target/service.jar --spring.profiles.active=production

# Terminal 2 - Frontend (if testing separately)
cd vite-project
npm run dev
```

Access at: http://localhost:5173 (frontend) → http://localhost:8081 (backend API)

## Production Packages

### Windows Packages (on Windows machine)
```bash
cd vite-project
npm install
npm run electron:build:win
```

Output:
- `release/UnifiedServicePortal-*-Setup.exe` (NSIS installer, ~150MB)
- `release/UnifiedServicePortal-*-portable.exe` (Portable, ~150MB)

### Linux Packages (on Linux machine)
```bash
cd vite-project
npm install
npm run electron:build:linux
```

Output:
- `release/UnifiedServicePortal-*.AppImage` (~160MB)
- `release/UnifiedServicePortal-*.deb` (~150MB)
- `release/UnifiedServicePortal-*.rpm` (~150MB)

### All Platforms (Linux host only)
```bash
cd vite-project
npm install
npm run package
```

## Automated Release

### Via GitHub Actions
```bash
# 1. Tag a release
git tag v1.0.0
git push origin v1.0.0

# 2. Wait for GitHub Actions to complete
# 3. Download from Releases tab
```

The workflow automatically:
- ✅ Builds backend JAR
- ✅ Builds frontend
- ✅ Creates Windows packages
- ✅ Creates Linux packages
- ✅ Creates GitHub Release
- ✅ Uploads all artifacts

## Common Issues

### Backend won't start
```bash
# Check Java
java -version

# Check port
lsof -i :8081  # Linux
netstat -ano | findstr :8081  # Windows

# View logs
tail -f logs/backend.log
```

### Frontend build fails
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build:prod
```

### Electron build fails
```bash
# Linux dependencies
sudo apt install -y libgtk-3-dev libnotify-dev libnss3 libxss1

# Clear electron cache
rm -rf ~/.electron
npm run electron:build:linux
```

## File Locations

| Component | Location | Size |
|-----------|----------|------|
| Backend JAR | `demo/demo/target/service.jar` | 76 MB |
| Frontend | `vite-project/dist/` | 616 KB |
| Windows Packages | `vite-project/release/*.exe` | ~150 MB |
| Linux Packages | `vite-project/release/*` | ~150-160 MB |

## Testing the Package

### Windows
```cmd
# Run installer
UnifiedServicePortal-1.0.0-Setup.exe

# Or run portable
UnifiedServicePortal-1.0.0-portable.exe
```

### Linux
```bash
# AppImage (recommended)
chmod +x UnifiedServicePortal-1.0.0.AppImage
./UnifiedServicePortal-1.0.0.AppImage

# Debian/Ubuntu
sudo dpkg -i UnifiedServicePortal-1.0.0.deb
unified-service-portal

# Fedora/RHEL
sudo rpm -i UnifiedServicePortal-1.0.0.rpm
unified-service-portal
```

## Verification Checklist

After building, verify:
- [ ] Backend JAR exists and is ~76MB
- [ ] Frontend dist exists and is ~616KB
- [ ] Health endpoint works: `curl http://localhost:8081/api/health`
- [ ] Application starts without errors
- [ ] Login works with default credentials
- [ ] Database persists data
- [ ] Package size is under 400MB ✓ (actual: ~177MB)

## Default Credentials

```
Username: prerana
Password: Prerana@542004
```

⚠️ **Change after first login!**

## Support

- **Full Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **User Manual**: [USER_GUIDE.md](USER_GUIDE.md)
- **Issues**: https://github.com/HARSHA-07-H/unified-service-portal/issues

---

**Quick Start Complete!** 🚀

For detailed instructions, troubleshooting, and advanced configuration, see [DEPLOYMENT.md](DEPLOYMENT.md).
