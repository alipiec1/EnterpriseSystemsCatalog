#!/usr/bin/env python3
"""
Dedicated FastAPI server runner for the Enterprise Systems Catalog
"""

import os
import sys
import uvicorn

# Add current directory to Python path
sys.path.insert(0, os.getcwd())

if __name__ == "__main__":
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