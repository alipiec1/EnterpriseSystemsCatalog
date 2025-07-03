// This file has been replaced with a FastAPI-only solution
// The FastAPI server is now the primary backend
// Run the FastAPI server directly using: .pythonlibs/bin/python3 run_dev_server.py

import { spawn } from "child_process";

console.log("🚀 Starting FastAPI Development Server...");

// Start the FastAPI server
const fastApiProcess = spawn('.pythonlibs/bin/python3', ['run_dev_server.py'], {
  cwd: process.cwd(),
  stdio: 'inherit'
});

fastApiProcess.on('error', (error) => {
  console.error(`FastAPI server error: ${error.message}`);
});

process.on('SIGTERM', () => {
  fastApiProcess.kill();
  process.exit(0);
});

process.on('SIGINT', () => {
  fastApiProcess.kill();
  process.exit(0);
});
