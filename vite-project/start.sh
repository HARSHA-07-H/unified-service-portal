#!/bin/bash

echo "========================================"
echo "Unified Service Portal"
echo "========================================"
echo ""

# Set working directory to script location
cd "$(dirname "$0")"

# Check if Java is installed
echo "[1/5] Checking Java installation..."
if ! command -v java &> /dev/null; then
    echo "ERROR: Java is not installed or not in PATH"
    echo "Please install Java 17 or higher and try again"
    echo "On Ubuntu/Debian: sudo apt install openjdk-17-jre"
    echo "On Fedora/RHEL: sudo dnf install java-17-openjdk"
    exit 1
fi
echo "Java found: $(java -version 2>&1 | head -n 1)"
echo ""

# Check if backend JAR exists
BACKEND_JAR="backend/service.jar"
echo "[2/5] Checking backend JAR..."
if [ ! -f "$BACKEND_JAR" ]; then
    echo "ERROR: Backend JAR not found at $BACKEND_JAR"
    exit 1
fi
echo "Backend JAR found!"
echo ""

# Create necessary directories
echo "[3/5] Creating directories..."
mkdir -p data logs
echo "Directories ready!"
echo ""

# Start backend server as daemon
echo "[4/5] Starting backend server..."
nohup java -jar "$BACKEND_JAR" --spring.profiles.active=production > logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend process started (PID: $BACKEND_PID)"

# Save PID for cleanup
echo $BACKEND_PID > .backend.pid

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    sleep 2
    if curl -s http://localhost:8081/api/health > /dev/null 2>&1; then
        echo "Backend is ready!"
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    
    if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
        echo "ERROR: Backend failed to start within 60 seconds"
        echo "Check logs/backend.log for details"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
done
echo ""

# Launch Electron app
echo "[5/5] Launching application..."
if [ -f "./UnifiedServicePortal" ]; then
    ./UnifiedServicePortal &
elif [ -f "./unified-service-portal" ]; then
    ./unified-service-portal &
else
    # Try AppImage
    APPIMAGE=$(ls UnifiedServicePortal*.AppImage 2>/dev/null | head -n 1)
    if [ -n "$APPIMAGE" ]; then
        ./"$APPIMAGE" &
    else
        echo "ERROR: Application executable not found"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
fi

echo ""
echo "========================================"
echo "Application started successfully!"
echo "Backend: http://localhost:8081"
echo "========================================"
echo ""
echo "The application is now running."
echo "To stop the backend, run: kill $(cat .backend.pid)"
echo ""
