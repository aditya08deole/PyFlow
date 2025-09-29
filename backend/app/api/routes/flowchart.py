from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import ast
from typing import Dict, Any
from app.services.flowchart_generator import FlowchartGenerator

router = APIRouter()

class CodeRequest(BaseModel):
    code: str

class FlowchartResponse(BaseModel):
    mermaid: str
    nodes: Dict[str, Any]

@router.post("/generate-flowchart", response_model=FlowchartResponse)
async def generate_flowchart(request: CodeRequest):
    """
    Generate a Mermaid.js flowchart from Python code
    """
    try:
        generator = FlowchartGenerator()
        mermaid_code, nodes = generator.generate_from_code(request.code)
        
        return FlowchartResponse(
            mermaid=mermaid_code,
            nodes=nodes
        )
    except SyntaxError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Syntax error in Python code: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating flowchart: {str(e)}"
        )

@router.post("/parse-code")
async def parse_code(request: CodeRequest):
    """
    Parse Python code and return AST information
    """
    try:
        tree = ast.parse(request.code)
        
        # Extract basic information from AST
        functions = []
        variables = []
        
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                functions.append({
                    "name": node.name,
                    "line": node.lineno,
                    "args": [arg.arg for arg in node.args.args]
                })
            elif isinstance(node, ast.Assign):
                for target in node.targets:
                    if isinstance(target, ast.Name):
                        variables.append({
                            "name": target.id,
                            "line": node.lineno
                        })
        
        return {
            "functions": functions,
            "variables": variables,
            "total_lines": request.code.count('\n') + 1
        }
        
    except SyntaxError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Syntax error: {str(e)}"
        )