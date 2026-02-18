# Release Files - For Repository Maintainers

This document lists what files should be uploaded to GitHub Releases and what end users need.

## 📦 Files to Upload to GitHub Releases

When creating a release (via GitHub Actions or manually), include these files:

### Windows Files (2 files)
1. **`UnifiedServicePortal-X.X.X-x64-Setup.exe`** (~150 MB)
   - NSIS installer for Windows
   - Installs to Program Files
   - Creates Start Menu entry and desktop shortcut

2. **`UnifiedServicePortal-X.X.X-x64-portable.exe`** (~150 MB)
   - Portable version for Windows
   - No installation required
   - Can run from USB drive

### Linux Files (3 files)
3. **`UnifiedServicePortal-X.X.X.AppImage`** (~160 MB)
   - Universal Linux format
   - Works on all distributions
   - Single executable file

4. **`UnifiedServicePortal-X.X.X.deb`** (~150 MB)
   - Debian/Ubuntu package
   - Native package manager integration

5. **`UnifiedServicePortal-X.X.X.rpm`** (~150 MB)
   - Fedora/RHEL package
   - Native package manager integration

### Documentation Files (Include in Release Notes)
6. **DOWNLOAD_GUIDE.md** - Link to this in release notes
7. **QUICK_DOWNLOAD.md** - Include text in release notes
8. **USER_GUIDE.md** - Link to this in release notes

## 📝 Release Notes Template

When creating a release, use this template:

```markdown
## Unified Service Portal v1.0.0

### 📥 What to Download?

**Windows users:** Download `UnifiedServicePortal-1.0.0-x64-Setup.exe`
**Linux (Ubuntu/Debian):** Download `UnifiedServicePortal-1.0.0.deb`
**Linux (Other):** Download `UnifiedServicePortal-1.0.0.AppImage`

**[📖 Complete Download Guide](https://github.com/HARSHA-07-H/unified-service-portal/blob/main/DOWNLOAD_GUIDE.md)**

### What's New
- Feature 1
- Feature 2
- Bug fixes

### Installation
- Windows: Double-click the .exe file
- Linux (.deb): `sudo dpkg -i UnifiedServicePortal-1.0.0.deb`
- Linux (AppImage): `chmod +x UnifiedServicePortal-1.0.0.AppImage && ./UnifiedServicePortal-1.0.0.AppImage`

### First Time Login
```
Username: prerana
Password: Prerana@542004
```
⚠️ Change password immediately after first login!

### System Requirements
- Windows 10/11 (64-bit) or Linux (64-bit)
- 4GB RAM minimum
- 500MB free disk space

### Documentation
- [User Guide](https://github.com/HARSHA-07-H/unified-service-portal/blob/main/USER_GUIDE.md)
- [Download Guide](https://github.com/HARSHA-07-H/unified-service-portal/blob/main/DOWNLOAD_GUIDE.md)
- [Deployment Guide](https://github.com/HARSHA-07-H/unified-service-portal/blob/main/DEPLOYMENT.md)

### Support
Report issues at: https://github.com/HARSHA-07-H/unified-service-portal/issues
```

## 🚀 Automated Release Process

When you push a tag (e.g., `v1.0.0`), GitHub Actions automatically:

1. Builds the backend JAR
2. Builds the frontend
3. Creates Windows packages (.exe files)
4. Creates Linux packages (.AppImage, .deb, .rpm)
5. Creates a GitHub Release
6. Uploads all 5 files to the release

### To Create a Release:
```bash
git tag v1.0.0
git push origin v1.0.0
```

Then wait for GitHub Actions to complete (~10-15 minutes).

## 📋 End User File Summary

**End users only need ONE file:**

| Platform | File to Download | Size |
|----------|------------------|------|
| Windows | `*-Setup.exe` | 150 MB |
| Windows (Portable) | `*-portable.exe` | 150 MB |
| Linux (Ubuntu/Debian) | `*.deb` | 150 MB |
| Linux (Fedora/RHEL) | `*.rpm` | 150 MB |
| Linux (Universal) | `*.AppImage` | 160 MB |

## ❌ What NOT to Include in Releases

Do NOT upload these to releases (they're automatically created by GitHub):
- Source code (zip)
- Source code (tar.gz)
- Individual .jar files
- Frontend build folders
- Node modules
- Maven target directories

## ✅ Release Checklist

Before publishing a release:
- [ ] All 5 package files are present
- [ ] File sizes are reasonable (~150-160 MB each)
- [ ] Release notes include download guide link
- [ ] Default credentials are mentioned
- [ ] System requirements are listed
- [ ] Installation instructions are clear
- [ ] Release is marked as "Latest" (if applicable)

## 📊 Expected File Sizes

| File | Expected Size | Acceptable Range |
|------|---------------|------------------|
| Windows Setup | 150 MB | 140-170 MB |
| Windows Portable | 150 MB | 140-170 MB |
| Linux AppImage | 160 MB | 150-180 MB |
| Linux .deb | 150 MB | 140-170 MB |
| Linux .rpm | 150 MB | 140-170 MB |

If files are significantly larger or smaller, investigate before releasing.

## 🔒 Security Notes

- All packages are unsigned (consider code signing for future)
- Windows SmartScreen may show a warning (expected)
- Provide SHA256 checksums for verification (optional but recommended)

## 📞 Support

For release-related questions:
- Check GitHub Actions logs if build fails
- Verify electron-builder.yml configuration
- Consult DEPLOYMENT.md for build instructions

---

**Last Updated:** February 2026
