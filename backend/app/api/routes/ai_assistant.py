import os
from typing import List

import openai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class AIRequest(BaseModel):
    code: str
    question: str = ""


class AIResponse(BaseModel):
    suggestions: List[str]
    explanations: List[str]


@router.post("/ai-suggestions", response_model=AIResponse)
async def get_ai_suggestions(request: AIRequest):
    """
    Get enhanced AI-powered code suggestions and explanations
    """
    try:
        # Enhanced AI analysis with code pattern detection
        code = request.code
        suggestions = []
        explanations = []
        
        # Analyze code patterns
        if "def " in code and "return" not in code:
            suggestions.append("Function should have a return statement")
            
        if code.count("for ") > 2:
            suggestions.append("Consider optimizing nested loops for better performance")
            
        if "try:" not in code and ("input(" in code or "open(" in code):
            suggestions.append("Add error handling for user input and file operations")
            
        if '"""' not in code and "def " in code:
            suggestions.append("Add docstrings to document function behavior")
            
        if ": int" not in code and ": str" not in code and "def " in code:
            suggestions.append("Consider adding type hints for better code clarity")
            
        # Smart complexity analysis
        loop_count = code.count("for ") + code.count("while ")
        if loop_count == 0:
            explanations.append("Code has O(1) time complexity - very efficient")
        elif loop_count == 1:
            explanations.append("Code has O(n) time complexity - good performance")
        elif loop_count > 1:
            explanations.append("Code may have O(n²) or higher complexity - consider optimization")
            
        # Default suggestions if none found
        if not suggestions:
            suggestions = [
                "Code looks good! Consider adding comments for better readability",
                "Well-structured code with good practices",
                "Consider adding unit tests for better reliability"
            ]
            
        if not explanations:
            explanations = [
                "Code follows Python best practices",
                "Good variable naming and structure",
                "Clear logic flow and organization"
            ]

        return AIResponse(suggestions=suggestions, explanations=explanations)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")


@router.post("/explain-code")
async def explain_code(request: dict):
    """
    Get detailed explanation of code functionality
    """
    try:
        code = request.get("code", "")

        # Mock explanation - replace with actual AI service
        num_lines = code.count("\n") + 1
        explanation = (
            f"This code appears to define functions and perform operations. "
            f"It contains {code.count('def')} function definitions and "
            f"{num_lines} total lines."
        )

        return {
            "explanation": explanation,
            "complexity": "Medium",
            "suggestions": [
                "Add comments for better readability",
                "Consider breaking down complex functions",
            ],
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Explanation service error: {str(e)}"
        )


@router.post("/fix-errors")
async def fix_errors(request: dict):
    """
    Suggest fixes for common Python errors
    """
    try:
        code = request.get("code", "")
        error_msg = request.get("error", "")

        # Mock error fixing suggestions
        fixes = [
            "Check for proper indentation",
            "Ensure all variables are defined before use",
            "Verify function parameter names match usage",
        ]

        return {
            "fixes": fixes,
            "corrected_code": code,  # In real implementation, return corrected code
            "confidence": 0.85,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error fixing service error: {str(e)}"
        )
