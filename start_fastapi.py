#!/usr/bin/env python3
import os
import sys

# Add current directory to Python path
sys.path.insert(0, os.getcwd())

try:
    from server.main import app
    import uvicorn
    
    print("Starting FastAPI server on port 8001...")
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=False)
except Exception as e:
    print(f"Error starting server: {e}")
    import traceback
    traceback.print_exc()