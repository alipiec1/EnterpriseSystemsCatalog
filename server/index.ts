import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Enterprise Systems Catalog Development Environment...');
console.log('🌐 Frontend will be available at http://localhost:5000');
console.log('📚 API documentation at http://localhost:8000/docs');

// Start the Python FastAPI server
console.log('🔧 Starting FastAPI backend server...');
const pythonProcess = spawn('python', ['server/main.py'], {
  stdio: 'pipe',
  cwd: join(__dirname, '..')
});

pythonProcess.stdout?.on('data', (data) => {
  console.log(`[FastAPI] ${data.toString().trim()}`);
});

pythonProcess.stderr?.on('data', (data) => {
  console.error(`[FastAPI] ${data.toString().trim()}`);
});

// Start the Vite frontend server
console.log('🔧 Starting Vite frontend server...');
const viteProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'pipe',
  cwd: join(__dirname, '..', 'client')
});

viteProcess.stdout?.on('data', (data) => {
  console.log(`[Vite] ${data.toString().trim()}`);
});

viteProcess.stderr?.on('data', (data) => {
  console.error(`[Vite] ${data.toString().trim()}`);
});

// Handle process termination
const cleanup = () => {
  console.log('\n🔄 Shutting down servers...');
  pythonProcess.kill();
  viteProcess.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

pythonProcess.on('error', (error) => {
  console.error('FastAPI server error:', error);
});

viteProcess.on('error', (error) => {
  console.error('Vite server error:', error);
});

pythonProcess.on('close', (code) => {
  console.log(`FastAPI server exited with code ${code}`);
});

viteProcess.on('close', (code) => {
  console.log(`Vite server exited with code ${code}`);
});