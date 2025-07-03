#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🔧 Starting Enterprise Systems Catalog Frontend...');

// Start Vite frontend
const viteProcess = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5000'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit'
});

viteProcess.on('error', (error) => {
  console.error('❌ Error starting Vite:', error);
});

viteProcess.on('exit', (code) => {
  console.log(`Vite process exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  viteProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  viteProcess.kill('SIGTERM');
  process.exit(0);
});