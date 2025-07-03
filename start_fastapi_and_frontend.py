#!/usr/bin/env python3
"""
Start FastAPI server and serve frontend assets
"""

import os
import sys
import uvicorn
import subprocess
from pathlib import Path

# Add current directory to Python path
sys.path.insert(0, os.getcwd())

def start_frontend():
    """Start the Vite frontend development server"""
    try:
        frontend_process = subprocess.Popen(
            ["npm", "run", "dev:frontend"],
            cwd=os.getcwd(),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT
        )
        print("✓ Frontend server started")
        return frontend_process
    except Exception as e:
        print(f"❌ Error starting frontend: {e}")
        return None

def start_fastapi():
    """Start the FastAPI server"""
    try:
        from server.main import app
        print("✓ FastAPI app loaded successfully")
        print("🚀 Starting FastAPI server on http://0.0.0.0:8000")
        print("📚 API documentation will be available at http://localhost:8000/docs")
        
        uvicorn.run(
            app, 
            host="0.0.0.0", 
            port=8000, 
            reload=False,
            log_level="info"
        )
    except Exception as e:
        print(f"❌ Error starting FastAPI server: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    print("🔧 Starting Enterprise Systems Catalog...")
    
    # Start FastAPI server (this will run in the main thread)
    start_fastapi()