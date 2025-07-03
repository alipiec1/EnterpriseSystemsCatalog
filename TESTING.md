# Testing Guide

This document outlines the testing strategy and procedures for the Enterprise Systems Catalog backend API.

## Test Files

### `test_api.py` (Recommended)
A comprehensive, focused test suite that validates the actual API functionality with real HTTP requests. This is the primary test file to use.

### `test_backend.py` (Advanced)
A more complex test suite using mocking and unit testing patterns. Contains detailed unit tests but requires more maintenance.

## Running Tests

### Prerequisites
```bash
pip install -r backend_requirements.txt
```

### Execute Tests
```bash
# Run the main test suite
python -m pytest test_api.py -v

# Run all tests
python -m pytest -v

# Run tests with coverage (if installed)
python -m pytest test_api.py --cov=server

# Run specific test class
python -m pytest test_api.py::TestBasicAPI -v

# Run specific test
python -m pytest test_api.py::TestBasicAPI::test_health_check -v
```

## Test Categories

### 1. Basic API Tests (`TestBasicAPI`)
- **Health Check**: Validates the root endpoint returns correct API information
- **Get All Systems**: Tests retrieval of all systems (returns list)
- **Create System**: Tests system creation with valid data
- **Validation Tests**: Tests email validation and required field validation
- **Error Handling**: Tests proper error responses for invalid requests

### 2. CRUD Operations (`TestSystemCRUD`)
- **Create**: System creation with automatic ID generation
- **Read**: Individual system retrieval by ID
- **Update**: Partial system updates
- **Delete**: System deletion with verification

### 3. Utility Functions (`TestUtilityFunctions`)
- **ID Generation**: Tests system ID format and uniqueness

## Test Data

### Valid System Data Structure
```json
{
  "system_name": "Test System",
  "system_description": "A test system description",
  "business_steward_email": "business@example.com",
  "business_steward_full_name": "Business Steward",
  "security_steward_email": "security@example.com",
  "security_steward_full_name": "Security Steward",
  "technical_steward_email": "technical@example.com",
  "technical_steward_full_name": "Technical Steward",
  "status": "active"
}
```

### Expected Response Format
```json
{
  "system_id": "SYS-123456-ABCDE",
  "system_name": "Test System",
  "system_description": "A test system description",
  "business_steward_email": "business@example.com",
  "business_steward_full_name": "Business Steward",
  "security_steward_email": "security@example.com",
  "security_steward_full_name": "Security Steward",
  "technical_steward_email": "technical@example.com",
  "technical_steward_full_name": "Technical Steward",
  "status": "active",
  "created_at": "2025-07-03T15:27:12.174551",
  "updated_at": "2025-07-03T15:27:12.174558"
}
```

## API Endpoints Tested

| Method | Endpoint | Status Code | Description |
|--------|----------|-------------|-------------|
| GET | `/` | 200 | Health check |
| GET | `/api/systems` | 200 | Get all systems |
| POST | `/api/systems` | 201 | Create new system |
| GET | `/api/systems/{id}` | 200/404 | Get system by ID |
| PUT | `/api/systems/{id}` | 200/404 | Update system |
| DELETE | `/api/systems/{id}` | 204/404 | Delete system |

## Validation Tests

### Email Validation
The tests verify that invalid email formats are rejected:
- `invalid-email`
- `test@`
- `@test.com`
- `test.com`
- Empty string

### Required Fields
All steward information fields are required:
- `system_name`
- `system_description`
- `business_steward_email`
- `business_steward_full_name`
- `security_steward_email`
- `security_steward_full_name`
- `technical_steward_email`
- `technical_steward_full_name`

## Test Environment

The tests use FastAPI's `TestClient` which:
- Creates an isolated test environment
- Doesn't require a running server
- Uses the same application instance as production
- Maintains data persistence during test execution
- Automatically cleans up created test data

## Test Coverage

Current test coverage includes:
- ✅ API endpoint functionality
- ✅ Data validation
- ✅ Error handling
- ✅ CRUD operations
- ✅ System ID generation
- ✅ HTTP status codes
- ✅ JSON response format

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure you're running tests from the project root directory
2. **Database Conflicts**: Tests create and delete real data; ensure test data doesn't conflict with important data
3. **Port Conflicts**: Tests use TestClient, so no port conflicts should occur

### Debug Mode
```bash
# Run tests with detailed output
python -m pytest test_api.py -v -s

# Run with Python debugging
python -m pytest test_api.py --pdb
```

## Future Enhancements

Potential additions to the test suite:
- Performance testing
- Concurrent access testing
- Database integrity testing
- Backup/restore testing
- API rate limiting testing