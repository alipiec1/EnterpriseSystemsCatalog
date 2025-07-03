#!/usr/bin/env python3
"""
Simple FastAPI server with static file serving for the Enterprise Systems Catalog
"""

import os
import sys
from pathlib import Path
from fastapi import FastAPI, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import json
import random
import string
from datetime import datetime
import uvicorn

# Add current directory to Python path
sys.path.insert(0, os.getcwd())

# Database file path
DB_FILE = "db_data.json"

class SystemCreate(BaseModel):
    system_name: str
    system_description: str
    business_steward_email: EmailStr
    business_steward_full_name: str
    security_steward_email: EmailStr
    security_steward_full_name: str
    technical_steward_email: EmailStr
    technical_steward_full_name: str
    status: str = "active"

class System(BaseModel):
    system_id: str
    system_name: str
    system_description: str
    business_steward_email: str
    business_steward_full_name: str
    security_steward_email: str
    security_steward_full_name: str
    technical_steward_email: str
    technical_steward_full_name: str
    status: str
    created_at: str
    updated_at: str

class SystemUpdate(BaseModel):
    system_name: Optional[str] = None
    system_description: Optional[str] = None
    business_steward_email: Optional[EmailStr] = None
    business_steward_full_name: Optional[str] = None
    security_steward_email: Optional[EmailStr] = None
    security_steward_full_name: Optional[str] = None
    technical_steward_email: Optional[EmailStr] = None
    technical_steward_full_name: Optional[str] = None
    status: Optional[str] = None

def generate_system_id() -> str:
    """Generate a unique system ID"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

def load_systems() -> List[System]:
    """Load systems from JSON file"""
    if not os.path.exists(DB_FILE):
        return []
    
    try:
        with open(DB_FILE, 'r') as f:
            data = json.load(f)
            return [System(**system) for system in data.get('systems', [])]
    except Exception as e:
        print(f"Error loading systems: {e}")
        return []

def save_systems(systems: List[System]) -> None:
    """Save systems to JSON file"""
    try:
        with open(DB_FILE, 'w') as f:
            json.dump({
                'systems': [system.model_dump() for system in systems]
            }, f, indent=2)
    except Exception as e:
        print(f"Error saving systems: {e}")

app = FastAPI(title="Enterprise Systems Catalog", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
@app.post("/api/systems", response_model=System, status_code=status.HTTP_201_CREATED)
async def create_system(system_create: SystemCreate):
    systems = load_systems()
    
    new_system = System(
        system_id=generate_system_id(),
        system_name=system_create.system_name,
        system_description=system_create.system_description,
        business_steward_email=system_create.business_steward_email,
        business_steward_full_name=system_create.business_steward_full_name,
        security_steward_email=system_create.security_steward_email,
        security_steward_full_name=system_create.security_steward_full_name,
        technical_steward_email=system_create.technical_steward_email,
        technical_steward_full_name=system_create.technical_steward_full_name,
        status=system_create.status,
        created_at=datetime.now().isoformat(),
        updated_at=datetime.now().isoformat()
    )
    
    systems.append(new_system)
    save_systems(systems)
    
    return new_system

@app.get("/api/systems", response_model=List[System])
async def get_all_systems():
    return load_systems()

@app.get("/api/systems/{system_id}", response_model=System)
async def get_system(system_id: str):
    systems = load_systems()
    for system in systems:
        if system.system_id == system_id:
            return system
    raise HTTPException(status_code=404, detail="System not found")

@app.put("/api/systems/{system_id}", response_model=System)
async def update_system(system_id: str, system_update: SystemUpdate):
    systems = load_systems()
    
    for i, system in enumerate(systems):
        if system.system_id == system_id:
            # Update fields
            for field, value in system_update.model_dump(exclude_unset=True).items():
                setattr(system, field, value)
            
            system.updated_at = datetime.now().isoformat()
            systems[i] = system
            save_systems(systems)
            return system
    
    raise HTTPException(status_code=404, detail="System not found")

@app.delete("/api/systems/{system_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_system(system_id: str):
    systems = load_systems()
    
    for i, system in enumerate(systems):
        if system.system_id == system_id:
            systems.pop(i)
            save_systems(systems)
            return
    
    raise HTTPException(status_code=404, detail="System not found")

@app.get("/")
async def root():
    """Root endpoint for health check"""
    return {"message": "Enterprise Systems Catalog API", "version": "1.0.0"}

# In development, we rely on Vite dev server for frontend
# In production, serve static files from client/dist
if os.path.exists("client/dist") and os.getenv("NODE_ENV") == "production":
    app.mount("/", StaticFiles(directory="client/dist", html=True), name="static")
else:
    # Development mode - frontend served by Vite on a different port
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # For any non-API route, return a simple message directing to the frontend
        if not full_path.startswith("api") and not full_path.startswith("docs"):
            return {"message": "Frontend running on Vite dev server", "frontend_url": "http://localhost:3000"}
        return {"message": "Enterprise Systems Catalog API", "version": "1.0.0"}

if __name__ == "__main__":
    print("🚀 Starting Enterprise Systems Catalog...")
    print("📚 API documentation will be available at http://localhost:5000/docs")
    print("🌐 Frontend will be available at http://localhost:5000")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=5000,
        log_level="info"
    )