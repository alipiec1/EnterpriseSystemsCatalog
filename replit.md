# Enterprise Systems Catalog

## Overview

This is a full-stack web application for cataloging enterprise systems with detailed stewardship information. The application allows users to create, view, and manage system records with comprehensive metadata including business, security, and technical steward information.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with validation
- **Build Tool**: Vite for development and build processes
- **Location**: `/client` directory with independent package.json

### Backend Architecture
- **Runtime**: Python with FastAPI
- **Language**: Python 3.11 with Pydantic models
- **Database**: JSON file storage (db_data.json)
- **Schema Validation**: Pydantic for runtime type checking and validation
- **API Documentation**: Automatic OpenAPI/Swagger documentation
- **CORS**: Configured for frontend integration
- **Location**: `/server/main.py` as single backend file

### Data Storage
- **Primary Database**: JSON file storage (db_data.json)
- **Storage Implementation**: File-based JSON storage with automatic file management
- **Data Validation**: Pydantic models ensure data integrity
- **Backup Strategy**: Simple file-based persistence for easy deployment

## Key Components

### Database Schema
The system uses a single primary entity - System:
- `system_id` (auto-generated)
- `system_name` 
- `system_description`
- Business Steward: `business_steward_full_name`, `business_steward_email`
- Security Steward: `security_steward_full_name`, `security_steward_email`
- Technical Steward: `technical_steward_full_name`, `technical_steward_email`
- `created_at`, `updated_at` timestamps
- `status` (active/inactive/pending)

### Frontend Components
- **Dashboard**: Main page with system list and management
- **SystemList**: Displays systems with search and filter capabilities
- **SystemForm**: Modal form for creating/editing systems
- **SystemDetail**: Modal for viewing system details
- **Layout**: Main application layout with navigation

### API Endpoints
- `GET /api/systems` - Retrieve all systems
- `GET /api/systems/:id` - Retrieve specific system
- `POST /api/systems` - Create new system
- Additional CRUD operations planned for future implementation

## Data Flow

1. **Client Request**: React components make API calls using React Query
2. **API Processing**: Express routes handle requests and validate data with Zod
3. **Data Persistence**: Storage layer (either Drizzle ORM or JSON file) manages data
4. **Response**: API returns JSON responses to client
5. **State Update**: React Query updates client state and triggers re-renders

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for Neon
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight client-side routing
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation library

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: CSS class variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking
- **tsx**: TypeScript execution
- **esbuild**: JavaScript bundler

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx with file watching for auto-reload
- **Database**: Local PostgreSQL or Neon cloud database

### Production
- **Build Process**: 
  - Frontend: `vite build` - creates optimized static assets
  - Backend: `esbuild` - bundles server code for Node.js
- **Deployment**: Single Node.js process serving both API and static assets
- **Database**: Neon PostgreSQL serverless database

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment flag (development/production)
- Database migrations managed via `drizzle-kit push`

## Changelog

- July 03, 2025: Added comprehensive testing infrastructure
  - Created test_api.py with complete API endpoint coverage
  - Added TESTING.md documentation with detailed testing procedures
  - Installed pytest and httpx testing dependencies
  - All 10 test cases passing with CRUD operations, validation, and error handling
  - Updated README.md with testing instructions and file structure
- July 03, 2025: Cleaned up codebase and finalized architecture
  - Removed unused Express.js files and dependencies
  - Simplified project structure with clear separation of frontend/backend
  - Created comprehensive documentation (README.md, backend_requirements.txt)
  - Established dual-server development setup with proper workflow configuration
  - Updated Vite configuration to allow all hosts for Replit compatibility
- July 03, 2025: Successfully migrated from Express.js to FastAPI backend
  - Replaced Express.js server with FastAPI for better API documentation and Python ecosystem
  - Implemented JSON file storage for simple deployment and data persistence
  - Created comprehensive system CRUD operations with proper validation
  - Configured CORS and hot reload for development
  - All API endpoints tested and working: GET, POST, PUT, DELETE operations
- July 03, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.