# Unified Service Portal - User Guide

Welcome to the Unified Service Portal! This guide will help you install, configure, and use the application.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation](#installation)
3. [First-Time Setup](#first-time-setup)
4. [Using the Application](#using-the-application)
5. [Troubleshooting](#troubleshooting)
6. [FAQs](#faqs)
7. [Support](#support)

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10 (64-bit) or Linux (64-bit)
- **RAM**: 4 GB
- **Disk Space**: 500 MB free space
- **Display**: 1280x720 resolution
- **Java**: Version 17 or higher (bundled in installer)

### Recommended Requirements
- **RAM**: 8 GB or more
- **Disk Space**: 1 GB free space
- **Display**: 1920x1080 resolution
- **Internet**: For initial setup and updates (optional)

## Installation

### Windows Installation

#### Option 1: NSIS Installer (Recommended)

1. **Download** the installer:
   - File name: `UnifiedServicePortal-X.X.X-Setup.exe`
   - Download from: GitHub Releases page

2. **Run** the installer:
   - Double-click the downloaded `.exe` file
   - If Windows SmartScreen appears, click "More info" → "Run anyway"
   
3. **Follow** the installation wizard:
   - Accept the license agreement
   - Choose installation directory (default: `C:\Program Files\UnifiedServicePortal`)
   - Select "Create Desktop Shortcut" option
   - Click "Install"

4. **Launch** the application:
   - Click "Finish" to launch immediately
   - Or use desktop shortcut
   - Or find in Start Menu under "Unified Service Portal"

#### Option 2: Portable Version

1. **Download** the portable version:
   - File name: `UnifiedServicePortal-X.X.X-portable.exe`
   
2. **Extract** to any folder:
   - Create a folder (e.g., `C:\UnifiedServicePortal`)
   - Move the `.exe` file to this folder
   
3. **Run** the application:
   - Double-click the `.exe` file
   - No installation required
   - All data stored in application folder

### Linux Installation

#### Option 1: AppImage (Recommended - Works on all distributions)

1. **Download** the AppImage:
   - File name: `UnifiedServicePortal-X.X.X.AppImage`

2. **Make executable**:
   ```bash
   chmod +x UnifiedServicePortal-X.X.X.AppImage
   ```

3. **Run**:
   ```bash
   ./UnifiedServicePortal-X.X.X.AppImage
   ```

4. **Optional - Integrate with desktop**:
   - Right-click the AppImage
   - Select "Integrate and run"
   - Application will appear in application menu

#### Option 2: Debian/Ubuntu (.deb)

1. **Download** the .deb package:
   - File name: `UnifiedServicePortal-X.X.X.deb`

2. **Install**:
   ```bash
   sudo dpkg -i UnifiedServicePortal-X.X.X.deb
   ```

3. **If dependencies are missing**:
   ```bash
   sudo apt-get install -f
   ```

4. **Launch**:
   ```bash
   unified-service-portal
   ```
   Or find in Applications menu under "Utility"

#### Option 3: Fedora/RHEL (.rpm)

1. **Download** the .rpm package:
   - File name: `UnifiedServicePortal-X.X.X.rpm`

2. **Install**:
   ```bash
   sudo rpm -i UnifiedServicePortal-X.X.X.rpm
   ```
   Or with DNF:
   ```bash
   sudo dnf install UnifiedServicePortal-X.X.X.rpm
   ```

3. **Launch**:
   ```bash
   unified-service-portal
   ```
   Or find in Applications menu

## First-Time Setup

### 1. Application Launch

When you first launch the application:

1. **Wait for backend to start** (10-30 seconds):
   - You'll see a loading screen
   - Backend server initializes
   - Database is created automatically

2. **Application opens automatically**:
   - Main window appears
   - You'll see the home page

### 2. Default Login Credentials

The application comes with a pre-configured Super Admin account:

- **Username**: `prerana`
- **Password**: `Prerana@542004`

**⚠️ Important**: Change the default password after first login!

### 3. First Login

1. **Select user type**:
   - Click "Super Admin" on home page

2. **Enter credentials**:
   - Username: `prerana`
   - Password: `Prerana@542004`

3. **Change password** (if prompted):
   - Enter current password
   - Enter new password (must meet requirements)
   - Confirm new password

### 4. Password Requirements

New passwords must have:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*)

Example: `MySecure@Pass123`

## Using the Application

### Dashboard Overview

After login, you'll see the main dashboard with:

- **Navigation menu**: Access different sections
- **User info**: Your current login details
- **Quick actions**: Common tasks
- **Statistics**: System overview

### Main Features

#### 1. User Management
- View all users
- Add new users
- Edit user details
- Delete users
- Reset passwords

#### 2. Admin Management
- Upload admins from Excel file
- View admin list
- Manage admin permissions
- Change passwords

#### 3. Data Import/Export
- Import data from Excel
- Export data to Excel
- Bulk operations

#### 4. Reports
- Generate various reports
- Export to Excel/PDF
- View statistics

### System Tray

The application runs in the system tray:

- **Windows**: Look in bottom-right corner (notification area)
- **Linux**: Look in top panel

#### System Tray Options:
- **Show App**: Restore window if minimized
- **Quit**: Close application completely

**Note**: Closing the main window minimizes to tray. Use "Quit" to exit completely.

### Data Storage

All your data is stored locally:

- **Location**: Application user data folder
  - Windows: `C:\Users\YourName\AppData\Roaming\UnifiedServicePortal\data`
  - Linux: `~/.config/UnifiedServicePortal/data`

- **Database**: H2 file-based database
- **Backups**: Recommended to backup `data/` folder regularly

## Troubleshooting

### Application Won't Start

**Problem**: Double-clicking does nothing or shows error

**Solutions**:
1. Check if Java is installed:
   ```bash
   java -version
   ```
   If not, download from [Adoptium](https://adoptium.net/)

2. Check logs:
   - Windows: `%APPDATA%\UnifiedServicePortal\logs`
   - Linux: `~/.config/UnifiedServicePortal/logs`

3. Try running from command line:
   ```bash
   # Windows
   "C:\Program Files\UnifiedServicePortal\UnifiedServicePortal.exe"
   
   # Linux
   unified-service-portal
   ```

### Login Issues

**Problem**: Cannot login with credentials

**Solutions**:
1. Verify username and password (case-sensitive)
2. Reset database if needed:
   - Close application
   - Delete `data/` folder
   - Restart application (creates fresh database)
3. Default credentials will be recreated

### Slow Performance

**Problem**: Application is slow or unresponsive

**Solutions**:
1. Check system resources (RAM, CPU)
2. Close other applications
3. Restart the application
4. Clear browser cache (if applicable)
5. Check logs for errors

### Port Already in Use

**Problem**: Error message about port 8081

**Solutions**:
1. Close other applications using port 8081
2. Find and kill the process:
   ```bash
   # Windows
   netstat -ano | findstr :8081
   taskkill /PID <PID> /F
   
   # Linux
   lsof -i :8081
   kill <PID>
   ```

### Database Issues

**Problem**: Data not saving or corrupt database

**Solutions**:
1. Backup current data folder
2. Stop application completely
3. Delete database files:
   - `data/testdb.mv.db`
   - `data/testdb.trace.db`
4. Restart application (creates new database)
5. Re-import data if needed

### Windows SmartScreen Warning

**Problem**: "Windows protected your PC" warning

**Why**: Application is not code-signed (expensive certificate)

**Solution**:
1. Click "More info"
2. Click "Run anyway"
3. Application is safe (open-source code)

### Linux Permission Issues

**Problem**: Cannot execute AppImage or application

**Solution**:
```bash
# Make executable
chmod +x UnifiedServicePortal-*.AppImage

# If still fails, check SELinux/AppArmor
sudo setenforce 0  # Temporarily disable SELinux
```

## FAQs

### Q: Does the application require internet?
**A**: No, the application works completely offline after installation.

### Q: Where is my data stored?
**A**: All data is stored locally in your user folder:
- Windows: `%APPDATA%\UnifiedServicePortal\data`
- Linux: `~/.config/UnifiedServicePortal/data`

### Q: Can I use this on multiple computers?
**A**: Yes, install on each computer. Data is stored separately on each machine.

### Q: How do I backup my data?
**A**: Copy the entire `data/` folder from the application data directory.

### Q: How do I restore from backup?
**A**: 
1. Stop the application
2. Replace `data/` folder with your backup
3. Start the application

### Q: Can I change the database location?
**A**: Yes, modify `application.properties` in the installation directory.

### Q: How do I uninstall?
**A**: 
- Windows: Use "Add or Remove Programs" in Settings
- Linux: `sudo apt remove unified-service-portal` or delete AppImage

### Q: Will uninstalling delete my data?
**A**: No, data in AppData/config folders is preserved. Delete manually if needed.

### Q: How do I update to a new version?
**A**: 
1. Download new version
2. Install over existing installation
3. Data is preserved automatically

### Q: Can I run multiple instances?
**A**: No, only one instance can run at a time (port 8081 limitation).

### Q: Is my data encrypted?
**A**: Passwords are encrypted (BCrypt). Other data is stored in H2 database (not encrypted).

### Q: What browsers are supported?
**A**: Application uses Electron (Chromium-based), no external browser needed.

## Support

### Getting Help

1. **Check logs**:
   - Windows: `%APPDATA%\UnifiedServicePortal\logs`
   - Linux: `~/.config/UnifiedServicePortal/logs`

2. **Read documentation**:
   - DEPLOYMENT.md - Technical details
   - README.md - Project overview

3. **GitHub Issues**:
   - Report bugs
   - Request features
   - Ask questions

### Reporting Bugs

When reporting bugs, include:
- Operating system and version
- Application version
- Steps to reproduce
- Error messages from logs
- Screenshots if applicable

### Contact

- **GitHub**: [Repository Issues](https://github.com/HARSHA-07-H/unified-service-portal/issues)
- **Email**: (Add your email here)

---

## Quick Reference

### Default Credentials
```
Username: prerana
Password: Prerana@542004
```

### Common Commands

**Windows**:
```cmd
# Start application
"C:\Program Files\UnifiedServicePortal\UnifiedServicePortal.exe"

# View logs
type %APPDATA%\UnifiedServicePortal\logs\backend.log

# Check if running
netstat -ano | findstr :8081
```

**Linux**:
```bash
# Start application
unified-service-portal

# View logs
cat ~/.config/UnifiedServicePortal/logs/backend.log

# Check if running
lsof -i :8081
```

### File Locations

| Purpose | Windows | Linux |
|---------|---------|-------|
| Installation | `C:\Program Files\UnifiedServicePortal` | `/usr/lib/unified-service-portal` |
| Data | `%APPDATA%\UnifiedServicePortal\data` | `~/.config/UnifiedServicePortal/data` |
| Logs | `%APPDATA%\UnifiedServicePortal\logs` | `~/.config/UnifiedServicePortal/logs` |
| Config | `%APPDATA%\UnifiedServicePortal\config` | `~/.config/UnifiedServicePortal/config` |

---

**Thank you for using Unified Service Portal!**

**Last Updated**: February 2026  
**Version**: 1.0.0
