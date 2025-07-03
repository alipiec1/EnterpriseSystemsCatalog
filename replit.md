# Enterprise Systems Catalog

## Overview

This is a full-stack web application for cataloging enterprise systems with detailed stewardship information. The application allows users to create, view, and manage system records with comprehensive metadata including business, security, and technical steward information.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and build processes

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod for runtime type checking
- **Session Management**: Express sessions with PostgreSQL store

### Data Storage
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for database schema management
- **Fallback Storage**: JSON file storage implementation (JsonFileStorage class)

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

- July 03, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.