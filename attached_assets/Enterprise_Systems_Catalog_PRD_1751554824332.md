# Product Requirements Document: Enterprise Systems Catalog

## 1. Overview

**Product Name**: Enterprise Systems Catalog  
**Type**: Internal Inventory Web Application  
**Purpose**:  
A lightweight, responsive web application designed to catalog enterprise systems with detailed metadata. It allows users to **create**, **view**, and in the future, **update/delete** system records. It also supports future AI-powered chat interaction for querying system data.

---

## 2. Goals and Objectives

- Maintain a structured catalog of enterprise systems.
- Capture stewardship information across business, security, and technical roles.
- Store data in JSON files (no traditional database required).
- Support both standard API access and MCP (Machine-Consumable Protocol) access via LangChain.
- Set the foundation for an AI-based question-answering interface.

---

## 3. Tech Stack

| Layer      | Technology           |
|------------|----------------------|
| Frontend   | React + Tailwind CSS |
| Backend    | FastAPI + Python     |
| Storage    | JSON files (`db_data.json`) |
| Protocol   | FastAPI-MCP Adapter  |
| Deployment | Localhost via `uvicorn` |

---

## 4. Functional Requirements

### 4.1 System Entity

Each enterprise system will include:

- `system_id` (auto-generated)
- `system_name`
- `system_description`
- Business Steward:
  - `business_steward_full_name`
  - `business_steward_email`
- Security Steward:
  - `security_steward_full_name`
  - `security_steward_email`
- Technical Steward:
  - `technical_steward_full_name`
  - `technical_steward_email`

### 4.2 User Stories

| ID  | Title               | Description                                                                 |
|-----|---------------------|-----------------------------------------------------------------------------|
| US1 | Create System Entry | As a user, I want to create a new system record using a web form.           |
| US2 | View All Systems    | As a user, I want to see a list of all saved systems.                       |
| US3 | View System by ID   | As a user, I want to view detailed information of a system via its ID.      |
| US4 | Save Data to JSON   | As a system, I want all records persisted in a JSON file.                   |
| US5 | Expose Read API via MCP | As a system, I want APIs available to external tools like LangChain. |

---

## 5. API Specification

### `POST /systems/`

- Create a new system entry.
- Request Body: `SystemCreate` model
- Response: Newly created `System` object

### `GET /systems/`

- Get all systems.
- Response: List of `System` objects

### `GET /systems/{system_id}`

- Get a system by ID.
- Response: `System` object

---

## 6. Frontend Requirements

### Pages / Components

- `SystemForm.tsx`: Form to input system data
- `SystemList.tsx`: Table displaying all system records
- `SystemDetail.tsx`: Modal or page showing detailed view of a selected system
- `Layout.tsx`: Shared layout/navigation
- `App.tsx`: Routes and application structure

### UI Features

- Use Tailwind for styling
- Responsive layout for desktop/mobile
- Form validation with error states
- Loading indicators for API calls
- Simple file-based state or `useState` management (no need for Redux or Zustand initially)

---

## 7. Non-Functional Requirements

- Lightweight (no database)
- Readable JSON persistence
- Clear separation of frontend/backend
- Read operations available via MCP
- Local-only deployment with `uvicorn`

---

## 8. Future Features

- ✅ **Chat Interface**: Integrate LangChain or RAG-style interface to allow natural language Q&A about systems.
- ✅ **Update/Delete Systems**: Extend backend and frontend to support editing and deleting entries.
- ✅ **Search & Filter**: Filter systems based on steward, name, or email.
- ✅ **Authentication**: Optional login or admin control.
- ✅ **Deployment**: Host on a cloud provider or internal server.

---

## 9. Acceptance Criteria

- Users can submit valid system entries and see them listed.
- System data is saved to and loaded from `db_data.json`.
- MCP server is accessible at a separate port with read operations.
- Application is styled and responsive.
