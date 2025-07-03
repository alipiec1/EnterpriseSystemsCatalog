#!/usr/bin/env python3
"""
Run script for the Enterprise Systems Catalog FastAPI backend
"""

import uvicorn
from server.main import app

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)