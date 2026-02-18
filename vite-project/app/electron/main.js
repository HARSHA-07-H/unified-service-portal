const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

let mainWindow;
let tray;
let backendProcess;
const BACKEND_PORT = 8081;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;
const MAX_HEALTH_CHECK_ATTEMPTS = 60; // 60 seconds max wait

// Get the correct paths for development and production
const isDev = !app.isPackaged;
const appPath = app.getAppPath();
const backendJarPath = isDev
  ? path.join(appPath, '..', '..', 'demo', 'demo', 'target', 'service.jar')
  : path.join(process.resourcesPath, 'backend', 'service.jar');

const frontendPath = isDev
  ? path.join(appPath, 'dist', 'index.html')
  : path.join(appPath, 'dist', 'index.html');

// Ensure logs directory exists
const logsDir = path.join(app.getPath('userData'), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Backend management functions
function startBackend() {
  return new Promise((resolve, reject) => {
    console.log('Starting backend server...');
    console.log('Backend JAR path:', backendJarPath);

    if (!fs.existsSync(backendJarPath)) {
      console.error('Backend JAR not found at:', backendJarPath);
      reject(new Error(`Backend JAR not found at: ${backendJarPath}`));
      return;
    }

    const logFile = path.join(logsDir, `backend-${Date.now()}.log`);
    const logStream = fs.createWriteStream(logFile, { flags: 'a' });

    backendProcess = spawn('java', [
      '-jar',
      backendJarPath,
      '--spring.profiles.active=production'
    ], {
      cwd: app.getPath('userData'),
      detached: false
    });

    backendProcess.stdout.on('data', (data) => {
      console.log(`Backend: ${data}`);
      logStream.write(data);
    });

    backendProcess.stderr.on('data', (data) => {
      console.error(`Backend Error: ${data}`);
      logStream.write(data);
    });

    backendProcess.on('error', (error) => {
      console.error('Failed to start backend:', error);
      reject(error);
    });

    backendProcess.on('exit', (code, signal) => {
      console.log(`Backend process exited with code ${code} and signal ${signal}`);
      logStream.end();
    });

    // Wait for backend to be healthy
    checkBackendHealth()
      .then(() => {
        console.log('Backend is ready!');
        resolve();
      })
      .catch(reject);
  });
}

function checkBackendHealth(attempt = 0) {
  return new Promise((resolve, reject) => {
    if (attempt >= MAX_HEALTH_CHECK_ATTEMPTS) {
      reject(new Error('Backend health check timeout'));
      return;
    }

    const options = {
      hostname: 'localhost',
      port: BACKEND_PORT,
      path: '/api/health',
      method: 'GET',
      timeout: 1000
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve();
      } else {
        setTimeout(() => {
          checkBackendHealth(attempt + 1).then(resolve).catch(reject);
        }, 1000);
      }
    });

    req.on('error', () => {
      setTimeout(() => {
        checkBackendHealth(attempt + 1).then(resolve).catch(reject);
      }, 1000);
    });

    req.on('timeout', () => {
      req.destroy();
      setTimeout(() => {
        checkBackendHealth(attempt + 1).then(resolve).catch(reject);
      }, 1000);
    });

    req.end();
  });
}

function stopBackend() {
  return new Promise((resolve) => {
    if (backendProcess) {
      console.log('Stopping backend server...');
      backendProcess.on('exit', () => {
        console.log('Backend stopped');
        resolve();
      });
      
      // Try graceful shutdown first
      backendProcess.kill('SIGTERM');
      
      // Force kill after 5 seconds if still running
      setTimeout(() => {
        if (backendProcess && !backendProcess.killed) {
          backendProcess.kill('SIGKILL');
          resolve();
        }
      }, 5000);
    } else {
      resolve();
    }
  });
}

// Window management
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '..', 'resources', 'icon.png'),
    show: false
  });

  // Load the frontend
  if (isDev) {
    // In development, load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from built files
    mainWindow.loadFile(frontendPath);
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  const trayIconPath = path.join(__dirname, '..', 'resources', 'tray-icon.png');
  tray = new Tray(trayIconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        } else {
          createWindow();
        }
      }
    },
    {
      label: 'Quit',
      click: async () => {
        app.isQuitting = true;
        await stopBackend();
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Unified Service Portal');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
    } else {
      createWindow();
    }
  });
}

// App lifecycle
app.whenReady().then(async () => {
  try {
    // Start backend first
    await startBackend();
    
    // Create window and tray
    createWindow();
    createTray();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  // On macOS, applications typically stay active until quit explicitly
  if (process.platform !== 'darwin') {
    app.isQuitting = true;
    stopBackend().then(() => app.quit());
  }
});

app.on('before-quit', async (event) => {
  if (backendProcess && !backendProcess.killed) {
    event.preventDefault();
    await stopBackend();
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('get-backend-url', () => {
  return BACKEND_URL;
});

ipcMain.handle('check-backend-status', async () => {
  try {
    await checkBackendHealth(0);
    return { status: 'running' };
  } catch (error) {
    return { status: 'stopped', error: error.message };
  }
});
