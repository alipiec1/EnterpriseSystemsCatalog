# Enterprise Systems Catalog

A full-stack web application for cataloging enterprise systems with detailed stewardship information.

## Architecture

- **Frontend**: React 18 with TypeScript, Tailwind CSS, and Vite
- **Backend**: FastAPI (Python) with JSON file storage
- **Database**: JSON file storage (db_data.json)

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+

### Setup

1. **Backend Setup**:
   ```bash
   pip install -r backend_requirements.txt
   python server/main.py
   ```
   Backend will be available at `http://localhost:8000`

2. **Frontend Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

### API Documentation

When the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

## Features

- Create, read, update, and delete enterprise systems
- Track business, security, and technical steward information
- Search and filter systems
- Responsive web interface
- JSON file persistence

## File Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Application pages
│   │   └── lib/            # Utilities
│   └── package.json
├── server/
│   └── main.py            # FastAPI backend
├── backend_requirements.txt
├── db_data.json           # Data storage
└── README.md
```