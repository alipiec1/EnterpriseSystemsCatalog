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

## Testing

The backend includes comprehensive test coverage using pytest:

```bash
# Install testing dependencies
pip install -r backend_requirements.txt

# Run tests
python -m pytest test_api.py -v

# Run all tests including advanced mocking tests
python -m pytest -v
```

See `TESTING.md` for detailed testing documentation.

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
├── test_api.py            # Main test suite
├── test_backend.py        # Advanced test suite with mocking
├── backend_requirements.txt
├── db_data.json           # Data storage
├── TESTING.md             # Testing documentation
└── README.md
```