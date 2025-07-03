#!/usr/bin/env python3
"""
Simple script to start the FastAPI backend for the Enterprise Systems Catalog
"""
import uvicorn
import sys
import os

# Add the server directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'server'))

if __name__ == "__main__":
    print("🚀 Starting Enterprise Systems Catalog API...")
    print("📚 API documentation will be available at http://localhost:8000/docs")
    print("🔧 Make sure to start the frontend separately with: cd client && npm run dev")
    
    uvicorn.run(
        "server.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        access_log=True
    )