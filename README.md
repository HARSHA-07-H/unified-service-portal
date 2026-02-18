# Unified Service Portal 🚀

A complete desktop application for managing users and services, built with React, Spring Boot, and Electron. Delivers a professional cross-platform experience with embedded backend and database.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux-lightgrey.svg)

## ✨ Features

- **🖥️ Desktop Application**: Native Windows and Linux installers
- **📦 All-in-One Package**: No external dependencies required
- **🔒 Secure Authentication**: BCrypt password hashing, role-based access
- **👥 User Management**: Complete CRUD operations for users and admins
- **📊 Excel Integration**: Import/export data via Excel files
- **💾 Embedded Database**: H2 file-based database for data persistence
- **🎨 Modern UI**: React 19 with responsive design
- **⚡ Fast & Optimized**: Vite bundling, optimized builds
- **🔄 Auto-Updates**: GitHub Actions for automated releases
- **📱 System Tray**: Minimize to tray, background operation

## 📋 System Requirements

### Minimum
- **OS**: Windows 10 (64-bit) or Linux (64-bit)
- **RAM**: 4 GB
- **Storage**: 500 MB free space
- **Java**: 17+ (bundled in installers)

### Recommended
- **RAM**: 8 GB+
- **Storage**: 1 GB free space
- **Display**: 1920x1080 resolution

## 🚀 Quick Start

### For End Users

#### Windows
1. Download `UnifiedServicePortal-X.X.X-Setup.exe` from [Releases](https://github.com/HARSHA-07-H/unified-service-portal/releases)
2. Run the installer
3. Launch from Start Menu or Desktop shortcut

#### Linux (Ubuntu/Debian)
```bash
# Download .deb package
wget https://github.com/HARSHA-07-H/unified-service-portal/releases/download/vX.X.X/UnifiedServicePortal-X.X.X.deb

# Install
sudo dpkg -i UnifiedServicePortal-X.X.X.deb

# Run
unified-service-portal
```

#### Linux (Universal - AppImage)
```bash
# Download AppImage
wget https://github.com/HARSHA-07-H/unified-service-portal/releases/download/vX.X.X/UnifiedServicePortal-X.X.X.AppImage

# Make executable and run
chmod +x UnifiedServicePortal-X.X.X.AppImage
./UnifiedServicePortal-X.X.X.AppImage
```

### Default Login
```
Username: prerana
Password: Prerana@542004
```

**⚠️ Change default password after first login!**

## 🛠️ For Developers

### Prerequisites
- Node.js 18+ 
- Java JDK 17+
- Maven 3.6+
- Git

### Clone Repository
```bash
git clone https://github.com/HARSHA-07-H/unified-service-portal.git
cd unified-service-portal
```

### Build Backend
```bash
cd demo/demo
mvn clean package -DskipTests
```

This creates `target/service.jar` (~76 MB).

### Build Frontend
```bash
cd vite-project
npm install
npm run build:prod
```

This creates optimized files in `dist/` directory (~2-5 MB).

### Run in Development Mode

#### Terminal 1 - Backend
```bash
cd demo/demo
mvn spring-boot:run
```

Backend runs on `http://localhost:8081`

#### Terminal 2 - Frontend
```bash
cd vite-project
npm run dev
```

Frontend runs on `http://localhost:5173`

### Build Desktop Packages

#### Windows (on Windows machine)
```bash
cd vite-project
npm run electron:build:win
```

Creates:
- `release/UnifiedServicePortal-*-Setup.exe` (Installer)
- `release/UnifiedServicePortal-*-portable.exe` (Portable)

#### Linux (on Linux machine)
```bash
cd vite-project
npm run electron:build:linux
```

Creates:
- `release/UnifiedServicePortal-*.AppImage`
- `release/UnifiedServicePortal-*.deb`
- `release/UnifiedServicePortal-*.rpm`

### Build All (Linux only)
```bash
cd vite-project
npm run package
```

## 📦 Project Structure

```
unified-service-portal/
├── demo/demo/                  # Spring Boot Backend
│   ├── src/main/java/         # Java source code
│   ├── src/main/resources/    # Application properties
│   └── pom.xml                # Maven configuration
│
├── vite-project/              # React Frontend & Electron
│   ├── src/                   # React components
│   ├── app/
│   │   ├── electron/          # Electron main process
│   │   │   ├── main.js        # Main Electron entry
│   │   │   └── preload.js     # Secure IPC bridge
│   │   └── resources/         # Icons and assets
│   ├── dist/                  # Built frontend (generated)
│   ├── electron-builder.yml   # Packaging configuration
│   ├── vite.config.js         # Vite build config
│   └── package.json           # NPM dependencies
│
├── .github/workflows/         # CI/CD
│   └── release.yml            # Automated release workflow
│
├── DEPLOYMENT.md              # Build & deployment guide
├── USER_GUIDE.md              # End-user documentation
└── README.md                  # This file
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Electron Shell (Desktop)        │
│  ┌─────────────────────────────────┐   │
│  │   React Frontend (Port 5173)    │   │
│  │   - React Router                │   │
│  │   - Modern UI Components        │   │
│  │   - API calls to backend        │   │
│  └──────────────┬──────────────────┘   │
│                 │ HTTP/REST              │
│  ┌──────────────▼──────────────────┐   │
│  │  Spring Boot Backend (8081)     │   │
│  │  - REST API Endpoints           │   │
│  │  - Security (BCrypt)            │   │
│  │  - JPA/Hibernate                │   │
│  └──────────────┬──────────────────┘   │
│                 │                        │
│  ┌──────────────▼──────────────────┐   │
│  │   H2 Database (Embedded)        │   │
│  │   - File-based storage          │   │
│  │   - ./data/testdb               │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## 🔧 Configuration

### Backend Configuration

Edit `demo/demo/src/main/resources/application.properties`:

```properties
# Server
server.port=8081

# Database
spring.datasource.url=jdbc:h2:file:./data/testdb
spring.datasource.username=sa
spring.datasource.password=

# JPA
spring.jpa.hibernate.ddl-auto=update
```

### Frontend Configuration

Edit `vite-project/vite.config.js`:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8081'
    }
  }
})
```

### Electron Configuration

Edit `vite-project/electron-builder.yml` for packaging options.

## 🚢 Automated Releases

### GitHub Actions Workflow

Releases are automated via GitHub Actions:

1. **Tag a release**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Workflow runs automatically**:
   - Builds backend JAR
   - Builds frontend
   - Packages for Windows
   - Packages for Linux
   - Creates GitHub Release
   - Uploads all installers

3. **Download from Releases tab**

### Manual Build

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed build instructions.

## 📚 Documentation

- **[USER_GUIDE.md](USER_GUIDE.md)** - Complete user manual
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Build and deployment guide
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical implementation details

## 🧪 Testing

### Backend Tests
```bash
cd demo/demo
mvn test
```

### Frontend Tests
```bash
cd vite-project
npm test
```

### Manual Testing Checklist
- [ ] Application starts without errors
- [ ] Backend health check returns UP
- [ ] Login works with default credentials
- [ ] All pages navigate correctly
- [ ] Database persists after restart
- [ ] System tray functions work
- [ ] Package size < 400 MB

## 📊 Package Sizes

Target sizes (without JRE bundling):

| Component | Size |
|-----------|------|
| Backend JAR | ~76 MB |
| Frontend Build | ~5 MB |
| Electron Runtime | ~100 MB |
| **Total Package** | **~180-200 MB** |

With JRE bundled: ~250-300 MB (still under 400 MB goal ✅)

## 🔐 Security

- ✅ BCrypt password hashing
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ SQL injection prevention (JPA)
- ✅ Secure Electron IPC
- ✅ No plain-text passwords
- ✅ Context isolation enabled

## 🐛 Troubleshooting

### Application won't start
```bash
# Check Java version
java -version

# Check logs
# Windows: %APPDATA%\UnifiedServicePortal\logs
# Linux: ~/.config/UnifiedServicePortal/logs
```

### Port 8081 already in use
```bash
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Linux
lsof -i :8081
kill <PID>
```

### Database issues
```bash
# Reset database (deletes all data!)
rm -rf data/testdb.*  # Linux
del /Q data\testdb.*  # Windows
```

See [USER_GUIDE.md](USER_GUIDE.md) for more troubleshooting.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see [LICENSE.txt](vite-project/LICENSE.txt) file for details.

## 👥 Authors

- **HARSHA-07-H** - *Initial work* - [@HARSHA-07-H](https://github.com/HARSHA-07-H)

## 🙏 Acknowledgments

- Spring Boot team for excellent framework
- React team for amazing UI library
- Electron team for desktop capabilities
- Vite team for blazing fast builds
- All contributors and users

## 📞 Support

- 📧 Email: (Add your email)
- 🐛 Issues: [GitHub Issues](https://github.com/HARSHA-07-H/unified-service-portal/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/HARSHA-07-H/unified-service-portal/discussions)

## 🗺️ Roadmap

- [ ] Add more authentication methods (OAuth, LDAP)
- [ ] Implement automatic updates
- [ ] Add multi-language support
- [ ] Mobile responsive improvements
- [ ] Dark mode theme
- [ ] Advanced reporting features
- [ ] Plugin system for extensibility
- [ ] PostgreSQL support (optional)
- [ ] Code signing for installers
- [ ] macOS support

---

**⭐ Star this repo if you find it helpful!**

**Made with ❤️ by HARSHA-07-H**
