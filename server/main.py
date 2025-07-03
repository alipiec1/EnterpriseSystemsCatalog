from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import json
import os
import random
import string
from datetime import datetime
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# LangChain Components for RAG
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

app = FastAPI(title="Enterprise Systems Catalog API", version="1.0.0")

# --- RAG Pipeline Initialization ---
print("Initializing RAG pipeline...")
rag_chain = None
try:
    # Check if OpenAI API key is available
    if os.getenv("OPENAI_API_KEY"):
        loader = PyPDFLoader("Operational_Procedures_and_Guidelines.pdf")
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(docs)
        vectorstore = FAISS.from_documents(documents=splits, embedding=OpenAIEmbeddings())
        retriever = vectorstore.as_retriever()
        
        # Create RAG template that includes enterprise systems context
        template = """You are an AI assistant for an Enterprise Systems Catalog. Use the following context from operational procedures and guidelines to answer questions about enterprise systems, stewardship, and operational procedures.

Context: {context}

Question: {question}

Provide helpful, detailed responses based on the context. If the context doesn't contain relevant information, use your knowledge of enterprise systems and best practices to provide guidance. Use bullet points and structured formatting when appropriate."""
        
        prompt = ChatPromptTemplate.from_template(template)
        llm = ChatOpenAI(model="gpt-3.5-turbo-0125")
        
        def format_docs(docs): 
            return "\n\n".join(doc.page_content for doc in docs)
        
        rag_chain = (
            {"context": retriever | format_docs, "question": RunnablePassthrough()} 
            | prompt 
            | llm 
            | StrOutputParser()
        )
        print("RAG pipeline ready with OpenAI.")
    else:
        print("OpenAI API key not found. RAG functionality disabled.")
except Exception as e:
    print(f"Error initializing RAG pipeline: {e}")
    rag_chain = None

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
    model: Optional[str] = "gpt-3.5-turbo-0125"
    max_tokens: Optional[int] = 300
    temperature: Optional[float] = 0.7


class ChatResponse(BaseModel):
    """
    A Pydantic model for chat responses using RAG pipeline.
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


async def generate_llm_response(prompt: str, model: str = "gpt-3.5-turbo-0125", max_tokens: int = 200, temperature: float = 0.7) -> str:
    """
    Generate chat responses using RAG pipeline with OpenAI
    """
    global rag_chain
    
    # Check if OpenAI API key is configured
    if not os.getenv("OPENAI_API_KEY"):
        return "⚠️ OpenAI API key not configured. Please add your API key to enable AI responses with RAG functionality."
    
    # Check if RAG chain is initialized
    if not rag_chain:
        return "⚠️ RAG pipeline not initialized. Please check the PDF document and OpenAI API key configuration."
    
    try:
        # Use the RAG chain to generate a response
        response = await asyncio.to_thread(rag_chain.invoke, prompt)
        
        if response and response.strip():
            return response.strip()
        else:
            return "I'm sorry, I couldn't generate a helpful response at this time. Please try rephrasing your question."
            
    except Exception as e:
        print(f"Error with RAG pipeline: {e}")
        import traceback
        traceback.print_exc()
        
        # Fallback to a basic enterprise systems response
        return f"I'm experiencing technical difficulties with the RAG system. Error: {str(e)[:100]}. Please check your OpenAI API key configuration and ensure the PDF document is available."

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
    Endpoint for generating RAG-powered responses using OpenAI and document retrieval
    
    Args:
        chat_request: ChatRequest containing the user prompt and optional parameters
        
    Returns:
        ChatResponse with the generated response and model information
    """
    try:
        model = chat_request.model or "gpt-3.5-turbo-0125"
        max_tokens = chat_request.max_tokens or 300
        temperature = chat_request.temperature or 0.7
        
        response = await generate_llm_response(
            prompt=chat_request.prompt,
            model=model,
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        return ChatResponse(
            response=response,
            model_used="gpt-3.5-turbo-0125 (RAG-powered)"
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