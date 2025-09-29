from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List

router = APIRouter()

class DebugRequest(BaseModel):
    code: str
    action: str  # "start", "step", "stop"
    current_line: int = None

class DebugResponse(BaseModel):
    success: bool
    current_line: int = None
    variables: Dict[str, Any] = {}
    output: str = ""
    finished: bool = False

@router.post("/debug", response_model=DebugResponse)
async def debug_code(request: DebugRequest):
    """
    Handle debugging operations
    """
    try:
        if request.action == "start":
            return DebugResponse(
                success=True,
                current_line=1,
                variables={},
                output="Debug session started",
                finished=False
            )
        
        elif request.action == "step":
            # Simulate stepping through code
            next_line = (request.current_line or 1) + 1
            
            # Mock variables for demonstration
            mock_variables = {
                "n": 5,
                "result": 1 if next_line > 3 else None
            }
            
            return DebugResponse(
                success=True,
                current_line=next_line,
                variables=mock_variables,
                output=f"Executing line {next_line}",
                finished=next_line > 10  # Mock finish condition
            )
        
        elif request.action == "stop":
            return DebugResponse(
                success=True,
                current_line=None,
                variables={},
                output="Debug session stopped",
                finished=True
            )
        
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unknown debug action: {request.action}"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Debug error: {str(e)}"
        )

@router.post("/execute")
async def execute_code(request: dict):
    """
    Execute Python code safely (sandboxed)
    """
    try:
        code = request.get("code", "")
        
        # This is a simplified mock - in production, use proper sandboxing
        # like Docker containers or restricted execution environments
        
        return {
            "success": True,
            "output": "Code execution completed (mock response)",
            "errors": []
        }
        
    except Exception as e:
        return {
            "success": False,
            "output": "",
            "errors": [str(e)]
        }