#!/usr/bin/env python3
"""
Run the development server for the Enterprise Systems Catalog with both FastAPI and Vite
"""

import os
import sys
import subprocess
import signal
import time
import threading
from pathlib import Path

# Add current directory to Python path
sys.path.insert(0, os.getcwd())

def start_vite_server():
    """Start the Vite frontend development server"""
    try:
        print("🔧 Starting Vite frontend server...")
        vite_process = subprocess.Popen(
            ["npx", "vite", "--host", "0.0.0.0", "--port", "5000"],
            cwd="client",
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        
        # Log Vite output
        for line in iter(vite_process.stdout.readline, ''):
            if line.strip():
                print(f"[Vite] {line.strip()}")
        
    except Exception as e:
        print(f"❌ Error starting Vite server: {e}")

def run_fastapi_server():
    """Run the FastAPI server"""
    try:
        from server.main import app
        import uvicorn
        
        print("🚀 Starting FastAPI API server...")
        print("📚 API documentation will be available at http://localhost:8000/docs")
        
        # Start the FastAPI server on port 8000
        uvicorn.run(
            "server.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
        
    except Exception as e:
        print(f"❌ Error starting FastAPI server: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    print("🚀 Starting Enterprise Systems Catalog Development Environment...")
    print("🌐 Frontend will be available at http://localhost:5000")
    print("📚 API documentation at http://localhost:8000/docs")
    
    # Start Vite server in a separate thread
    vite_thread = threading.Thread(target=start_vite_server, daemon=True)
    vite_thread.start()
    
    # Give Vite a moment to start
    time.sleep(2)
    
    # Start FastAPI server (this will block)
    run_fastapi_server()