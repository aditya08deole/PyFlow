from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import flowchart, debug, ai_assistant, ds_analysis

app = FastAPI(
    title="PyFlow Enhanced API",
    description="Backend API for PyFlow - Visual Python Coding Assistant with Data Structure Visualization",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(flowchart.router, prefix="/api", tags=["flowchart"])
app.include_router(debug.router, prefix="/api", tags=["debug"])
app.include_router(ai_assistant.router, prefix="/api", tags=["ai"])
app.include_router(ds_analysis.router, prefix="/api", tags=["datastructures"])

@app.get("/")
async def root():
    return {"message": "Welcome to PyFlow API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)