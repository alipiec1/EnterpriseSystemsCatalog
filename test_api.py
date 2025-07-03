"""
Simplified test suite for the Enterprise Systems Catalog FastAPI backend
"""
import pytest
import json
import os
import tempfile
from fastapi.testclient import TestClient
from server.main import app

# Create test client
client = TestClient(app)

class TestBasicAPI:
    """Basic API functionality tests"""
    
    def test_health_check(self):
        """Test the root health check endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Enterprise Systems Catalog API"
        assert data["version"] == "1.0.0"

    def test_get_all_systems(self):
        """Test getting all systems"""
        response = client.get("/api/systems")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_create_system_with_valid_data(self):
        """Test creating a system with valid data"""
        test_data = {
            "system_name": "Test API System",
            "system_description": "A test system for API validation",
            "business_steward_email": "business@example.com",
            "business_steward_full_name": "Business Steward",
            "security_steward_email": "security@example.com",
            "security_steward_full_name": "Security Steward",
            "technical_steward_email": "technical@example.com",
            "technical_steward_full_name": "Technical Steward",
            "status": "active"
        }
        
        response = client.post("/api/systems", json=test_data)
        assert response.status_code == 201
        
        data = response.json()
        assert data["system_name"] == test_data["system_name"]
        assert data["status"] == "active"
        assert "system_id" in data
        assert "created_at" in data
        assert "updated_at" in data
        
        # Clean up: try to delete the created system
        try:
            client.delete(f"/api/systems/{data['system_id']}")
        except:
            pass  # Ignore cleanup errors

    def test_create_system_invalid_email(self):
        """Test creating a system with invalid email"""
        test_data = {
            "system_name": "Test System",
            "system_description": "A test system",
            "business_steward_email": "invalid-email",  # Invalid email
            "business_steward_full_name": "Business Steward",
            "security_steward_email": "security@example.com",
            "security_steward_full_name": "Security Steward",
            "technical_steward_email": "technical@example.com",
            "technical_steward_full_name": "Technical Steward"
        }
        
        response = client.post("/api/systems", json=test_data)
        assert response.status_code == 422

    def test_create_system_missing_required_fields(self):
        """Test creating a system with missing required fields"""
        incomplete_data = {
            "system_name": "Test System",
            "system_description": "A test system"
            # Missing steward information
        }
        
        response = client.post("/api/systems", json=incomplete_data)
        assert response.status_code == 422

    def test_get_nonexistent_system(self):
        """Test getting a system that doesn't exist"""
        response = client.get("/api/systems/NONEXISTENT-ID")
        assert response.status_code == 404

class TestSystemCRUD:
    """Test Create, Read, Update, Delete operations"""
    
    def setup_method(self):
        """Create a test system for CRUD operations"""
        self.test_system_data = {
            "system_name": "CRUD Test System",
            "system_description": "A system for testing CRUD operations",
            "business_steward_email": "business@crudtest.com",
            "business_steward_full_name": "CRUD Business Steward",
            "security_steward_email": "security@crudtest.com",
            "security_steward_full_name": "CRUD Security Steward",
            "technical_steward_email": "technical@crudtest.com",
            "technical_steward_full_name": "CRUD Technical Steward",
            "status": "active"
        }
        
        # Create a test system
        response = client.post("/api/systems", json=self.test_system_data)
        if response.status_code == 201:
            self.system_id = response.json()["system_id"]
        else:
            self.system_id = None

    def teardown_method(self):
        """Clean up test system"""
        if hasattr(self, 'system_id') and self.system_id:
            try:
                client.delete(f"/api/systems/{self.system_id}")
            except:
                pass  # Ignore cleanup errors

    def test_read_created_system(self):
        """Test reading the system we created"""
        if not self.system_id:
            pytest.skip("System creation failed in setup")
            
        response = client.get(f"/api/systems/{self.system_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["system_name"] == self.test_system_data["system_name"]
        assert data["system_id"] == self.system_id

    def test_update_system(self):
        """Test updating a system"""
        if not self.system_id:
            pytest.skip("System creation failed in setup")
            
        update_data = {
            "system_name": "Updated CRUD Test System",
            "status": "inactive"
        }
        
        response = client.put(f"/api/systems/{self.system_id}", json=update_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["system_name"] == "Updated CRUD Test System"
        assert data["status"] == "inactive"

    def test_delete_system(self):
        """Test deleting a system"""
        if not self.system_id:
            pytest.skip("System creation failed in setup")
            
        response = client.delete(f"/api/systems/{self.system_id}")
        assert response.status_code == 204
        
        # Verify system is deleted
        get_response = client.get(f"/api/systems/{self.system_id}")
        assert get_response.status_code == 404
        
        # Mark as cleaned up
        self.system_id = None

class TestUtilityFunctions:
    """Test utility functions"""
    
    def test_system_id_generation(self):
        """Test that system IDs are generated in the correct format"""
        from server.main import generate_system_id
        
        system_id = generate_system_id()
        assert system_id.startswith("SYS-")
        
        parts = system_id.split("-")
        assert len(parts) == 3
        assert parts[0] == "SYS"
        assert len(parts[1]) == 6  # timestamp part
        assert len(parts[2]) == 5  # random part

if __name__ == "__main__":
    pytest.main([__file__, "-v"])