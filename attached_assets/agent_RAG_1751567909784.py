#import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

# --- Load environment variables from .env file ---
load_dotenv(load_dotenv(dotenv_path='../.env'))

# LangChain Components
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# --- RAG Pipeline Initialization ---
print("Initializing RAG pipeline...")
loader = PyPDFLoader("Operational_Procedures_and_Guidelines.pdf")
docs = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000,chunk_overlap=200)
splits = text_splitter.split_documents(docs)
vectorstore = FAISS.from_documents(documents=splits, embedding=OpenAIEmbeddings())
retriever = vectorstore.as_retriever()
template = "Answer based on context:\n{context}\n\nQuestion: {question}"
prompt = ChatPromptTemplate.from_template(template)
llm = ChatOpenAI(model="gpt-3.5-turbo-0125")
def format_docs(docs): return "\n\n".join(doc.page_content for doc in docs)
rag_chain = ({"context": retriever | format_docs, "question": RunnablePassthrough()} 
             | prompt 
             | llm 
             | StrOutputParser())
print("RAG pipeline ready.")

# --- FastAPI App Definition ---
app = FastAPI()
class QuestionInput(BaseModel): question: str
class AnswerResponse(BaseModel): answer: str

@app.post('/ask', response_model=AnswerResponse)
def ask_rag_question(query: QuestionInput):
    answer = rag_chain.invoke(query.question)
    return {'answer': answer}