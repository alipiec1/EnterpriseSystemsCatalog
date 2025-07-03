from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import json
import os
import random
import string
from datetime import datetime
import httpx
import asyncio
# LangChain imports - will be used when properly configured
# from langchain_huggingface import HuggingFaceEndpoint
# from langchain_core.prompts import PromptTemplate
# from langchain_core.output_parsers import StrOutputParser

app = FastAPI(title="Enterprise Systems Catalog API", version="1.0.0")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database file path
DB_FILE = "db_data.json"

class SystemCreate(BaseModel):
    """
    A Pydantic model representing the data required to create a new system entry.

    Attributes:
        system_name: The name of the system.
        system_description: A brief description of the system.
        business_steward_email: The email address of the business steward.
        business_steward_full_name: The full name of the business steward.
        security_steward_email: The email address of the security steward.
        security_steward_full_name: The full name of the security steward.
        technical_steward_email: The email address of the technical steward.
        technical_steward_full_name: The full name of the technical steward.
        status: The status of the system (active, inactive, pending)
    """
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
    """
    A Pydantic model that extends SystemCreate with metadata, representing a system entry in the database.

    Attributes:
        Inherits all attributes from SystemCreate.
        system_id: A unique identifier for the system.
        created_at: Timestamp when the system was created.
        updated_at: Timestamp when the system was last updated.
    """
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
    """
    A Pydantic model for updating system entries.
    """
    system_name: Optional[str] = None
    system_description: Optional[str] = None
    business_steward_email: Optional[EmailStr] = None
    business_steward_full_name: Optional[str] = None
    security_steward_email: Optional[EmailStr] = None
    security_steward_full_name: Optional[str] = None
    technical_steward_email: Optional[EmailStr] = None
    technical_steward_full_name: Optional[str] = None
    status: Optional[str] = None


class ChatRequest(BaseModel):
    """
    A Pydantic model for chat requests.
    """
    prompt: str
    model: Optional[str] = "microsoft/DialoGPT-medium"
    max_tokens: Optional[int] = 200
    temperature: Optional[float] = 0.7


class ChatResponse(BaseModel):
    """
    A Pydantic model for chat responses.
    """
    response: str
    model_used: str

def generate_system_id() -> str:
    """Generate a unique system ID"""
    timestamp = str(int(datetime.now().timestamp()))[-6:]
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
    return f"SYS-{timestamp}-{random_str}"

def load_systems() -> List[System]:
    """Load systems from JSON file"""
    try:
        if os.path.exists(DB_FILE):
            with open(DB_FILE, "r") as json_file:
                data = json.load(json_file)
                return [System(**item) for item in data.get("systems", [])]
        return []
    except Exception as e:
        print(f"Error loading systems: {e}")
        return []

def save_systems(systems: List[System]) -> None:
    """Save systems to JSON file"""
    try:
        with open(DB_FILE, "w") as json_file:
            json.dump({"systems": [system.dict() for system in systems]}, json_file, indent=2)
    except Exception as e:
        print(f"Error saving systems: {e}")
        raise HTTPException(status_code=500, detail="Failed to save systems")


async def generate_llm_response(prompt: str, model: str = "meta-llama/Llama-3.1-8B-Instruct", max_tokens: int = 200, temperature: float = 0.7) -> str:
    """
    Generate chat responses using Hugging Face Inference API with modern endpoints
    """
    hf_token = os.getenv("HUGGINGFACE_API_TOKEN")
    if not hf_token:
        return "⚠️ Hugging Face API token not configured. Please add your token to enable AI responses. The backend is ready for integration once you provide your token."
    
    # Create enterprise systems context
    system_context = """You are an AI assistant for an Enterprise Systems Catalog. You help users understand and manage their enterprise systems, stewardship roles, and API integration.

Your expertise includes:
- System lifecycle management and tracking
- Business, security, and technical stewardship roles  
- API documentation and integration guidance
- Data validation and security best practices
- Enterprise architecture and governance

Provide helpful, detailed, and professional responses. Use bullet points and structured formatting when appropriate."""

    # Use chat completion format for modern models
    messages = [
        {"role": "system", "content": system_context},
        {"role": "user", "content": prompt}
    ]
    
    # Use the correct Inference Providers API endpoint
    api_url = "https://router.huggingface.co/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {hf_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "meta-llama/Llama-3.1-8B-Instruct",
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "stream": False
    }
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            print(f"Making request to: {api_url}")
            print(f"Headers: {headers}")
            print(f"Payload: {payload}")
            
            response = await client.post(api_url, headers=headers, json=payload)
            
            print(f"Response status: {response.status_code}")
            print(f"Response headers: {response.headers}")
            
            # Handle model loading
            if response.status_code == 503:
                print("Model is loading, waiting 3 seconds...")
                await asyncio.sleep(3)
                response = await client.post(api_url, headers=headers, json=payload)
                print(f"Retry response status: {response.status_code}")
            
            if response.status_code != 200:
                error_detail = f"Hugging Face API error: {response.status_code}"
                try:
                    error_data = response.json()
                    print(f"Error response data: {error_data}")
                    if "error" in error_data:
                        error_detail = error_data["error"]
                except Exception as parse_error:
                    print(f"Could not parse error response: {parse_error}")
                    print(f"Raw response text: {response.text}")
                
                # Try a fallback model for common errors
                if model != "google/flan-t5-base" and response.status_code in [400, 404, 422]:
                    print("Trying fallback model...")
                    return await generate_llm_response(prompt, "google/flan-t5-base", max_tokens, temperature)
                
                raise HTTPException(status_code=500, detail=f"Failed to generate response: {error_detail}")
            
            result = response.json()
            print(f"Successful response: {result}")
            
            # Extract generated text from chat completion response
            if "choices" in result and len(result["choices"]) > 0:
                choice = result["choices"][0]
                if "message" in choice and "content" in choice["message"]:
                    generated_text = choice["message"]["content"].strip()
                    if generated_text:
                        return generated_text
            
            # Fallback for old-style responses
            if isinstance(result, list) and len(result) > 0:
                generated_text = result[0].get('generated_text', '').strip()
                if generated_text:
                    return generated_text
            
            return "I'm sorry, I couldn't generate a helpful response at this time. Please try rephrasing your question."
                
    except httpx.TimeoutException:
        print("Request timed out")
        raise HTTPException(status_code=504, detail="Request timeout - the model may be loading. Please try again in a moment.")
    except Exception as e:
        print(f"Error calling Hugging Face API: {e}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        
        # Check if it's a token issue
        if "404" in str(e) or "Invalid credentials" in str(e):
            return "🔑 **Token Issue Detected**\n\nThe Hugging Face API token appears to be invalid or expired. Please:\n\n1. Go to https://huggingface.co/settings/tokens\n2. Create a new token with 'Inference Providers' permissions\n3. Update your HUGGINGFACE_API_TOKEN environment variable\n4. Restart the application\n\nThe backend is fully configured and ready to work once you provide a valid token."
        
        # Final fallback with error message
        return f"I'm experiencing technical difficulties connecting to the AI service. Error: {str(e)[:100]}. Please check your Hugging Face API token configuration."

@app.post("/api/systems", response_model=System, status_code=status.HTTP_201_CREATED)
async def create_system(system_create: SystemCreate):
    """
    Endpoint for creating a new system entry.

    Args:
        system_create: An instance of SystemCreate containing the system's creation data.

    Returns:
        An instance of System, representing the newly created system entry.
    """
    systems = load_systems()
    
    # Create new system
    now = datetime.now().isoformat()
    system = System(
        system_id=generate_system_id(),
        **system_create.dict(),
        created_at=now,
        updated_at=now
    )
    
    systems.append(system)
    save_systems(systems)
    
    return system

@app.get("/api/systems/{system_id}", response_model=System, operation_id="get_system_by_id")
async def get_system(system_id: str):
    """
    Endpoint for retrieving a specific system by its system_id.

    Args:
        system_id: A string representing the unique identifier of the system to be retrieved.

    Returns:
        An instance of System, representing the system entry with the matching system_id.

    Raises:
        HTTPException: A 404 Not Found error if a system with the specified system_id is not found.
    """
    systems = load_systems()
    
    for system in systems:
        if system.system_id == system_id:
            return system
    
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="System not found")

@app.get("/api/systems", response_model=List[System], operation_id="get_all_systems")
async def get_all_systems():
    """
    Endpoint for retrieving all systems in the database.

    Returns:
        A list of System instances, representing all the system entries in the database.
        If there are no systems, returns an empty list.
    """
    return load_systems()

@app.put("/api/systems/{system_id}", response_model=System)
async def update_system(system_id: str, system_update: SystemUpdate):
    """
    Endpoint for updating an existing system entry.

    Args:
        system_id: A string representing the unique identifier of the system to be updated.
        system_update: An instance of SystemUpdate containing the fields to be updated.

    Returns:
        An instance of System, representing the updated system entry.

    Raises:
        HTTPException: A 404 Not Found error if a system with the specified system_id is not found.
    """
    systems = load_systems()
    
    for i, system in enumerate(systems):
        if system.system_id == system_id:
            # Update only the fields that were provided
            update_data = system_update.dict(exclude_unset=True)
            if update_data:
                for field, value in update_data.items():
                    setattr(system, field, value)
                system.updated_at = datetime.now().isoformat()
                
                systems[i] = system
                save_systems(systems)
                return system
    
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="System not found")

@app.delete("/api/systems/{system_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_system(system_id: str):
    """
    Endpoint for deleting a system entry.

    Args:
        system_id: A string representing the unique identifier of the system to be deleted.

    Raises:
        HTTPException: A 404 Not Found error if a system with the specified system_id is not found.
    """
    systems = load_systems()
    
    for i, system in enumerate(systems):
        if system.system_id == system_id:
            systems.pop(i)
            save_systems(systems)
            return
    
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="System not found")

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_llm(chat_request: ChatRequest):
    """
    Endpoint for generating LLM responses using LangChain and Hugging Face
    
    Args:
        chat_request: ChatRequest containing the user prompt and optional parameters
        
    Returns:
        ChatResponse with the generated response and model information
    """
    try:
        model = chat_request.model or "microsoft/DialoGPT-medium"
        max_tokens = chat_request.max_tokens or 200
        temperature = chat_request.temperature or 0.7
        
        response = await generate_llm_response(
            prompt=chat_request.prompt,
            model=model,
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        return ChatResponse(
            response=response,
            model_used=model
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail="Failed to process chat request")

@app.get("/")
async def root():
    """Root endpoint for health check"""
    return {"message": "Enterprise Systems Catalog API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)