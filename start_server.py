#!/usr/bin/env python3
import subprocess
import sys
import os

# Change to the correct directory
os.chdir('/home/runner/workspace')

# Run the FastAPI server
cmd = [sys.executable, "-m", "uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

try:
    subprocess.run(cmd, check=True)
except KeyboardInterrupt:
    print("Server stopped by user")
except Exception as e:
    print(f"Error running server: {e}")