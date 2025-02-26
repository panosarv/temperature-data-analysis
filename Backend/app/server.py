from fastapi import FastAPI
from app.routers import uploadRouter, plotRouter
from fastapi.middleware.cors import CORSMiddleware


server = FastAPI(
    title="Climate Data API",
    description="An API for uploading and visualizing climate data.",
    version="1.0.0",
)
server.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

server.include_router(uploadRouter, prefix="/api/upload", tags=["upload"])
server.include_router(plotRouter, prefix="/api/graph", tags=["graph"])