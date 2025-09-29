from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ds_analyzer import DataStructureAnalyzer, ExecutionTracer

router = APIRouter()


class DSAnalysisRequest(BaseModel):
    code: str
    enableTracing: bool = True


class DSAnalysisResponse(BaseModel):
    dsState: Dict[str, Any]
    operations: List[Dict[str, Any]]
    executionTimeline: Optional[List[Dict[str, Any]]] = None
    totalSteps: int = 0


class ExecutionStepRequest(BaseModel):
    code: str
    stepNumber: int


@router.post("/analyze-ds")
async def analyze_data_structures(request: DSAnalysisRequest):
    """
    🚀 Real-time analysis of Python code for data structures and variables
    """
    try:
        # Execute code safely and extract variables
        local_vars = {}
        global_vars = {}
        call_stack = []
        
        try:
            # Create safe execution environment
            safe_globals = {
                '__builtins__': {
                    'len': len, 'range': range, 'enumerate': enumerate,
                    'print': lambda *args: None,  # Silent print for analysis
                    'list': list, 'dict': dict, 'set': set, 'tuple': tuple,
                    'str': str, 'int': int, 'float': float, 'bool': bool,
                }
            }
            
            # Execute code and capture variables
            exec(request.code, safe_globals, local_vars)
            
            # Filter out built-in variables and functions
            variables = {}
            for name, value in local_vars.items():
                if not name.startswith('__') and not callable(value):
                    # Convert complex objects to serializable format
                    if isinstance(value, (list, tuple)):
                        variables[name] = list(value)
                    elif isinstance(value, dict):
                        variables[name] = dict(value)
                    elif isinstance(value, set):
                        variables[name] = list(value)
                    else:
                        variables[name] = value
            
            # Generate call stack info
            call_stack = [{"function": "main", "line": 1}]
            
            return {
                "variables": variables,
                "call_stack": call_stack,
                "success": True,
                "error": None
            }
            
        except Exception as exec_error:
            # If execution fails, try static analysis
            analyzer = DataStructureAnalyzer()
            analysis = analyzer.analyze_code(request.code)
            
            return {
                "variables": {},
                "call_stack": [{"function": "main", "line": 1}],
                "success": False,
                "error": str(exec_error),
                "static_analysis": analysis
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DS analysis error: {str(e)}")


@router.post("/execution-step")
async def get_execution_step(request: ExecutionStepRequest):
    """
    Get specific execution step data for timeline navigation
    """
    try:
        tracer = ExecutionTracer()
        execution_result = tracer.trace_execution(request.code)

        if request.stepNumber < 0 or request.stepNumber >= len(
            execution_result["executionTimeline"]
        ):
            raise HTTPException(status_code=400, detail="Invalid step number")

        step_data = execution_result["executionTimeline"][request.stepNumber]

        return {
            "step": step_data,
            "totalSteps": len(execution_result["executionTimeline"]),
            "hasNext": request.stepNumber
            < len(execution_result["executionTimeline"]) - 1,
            "hasPrev": request.stepNumber > 0,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execution step error: {str(e)}")


@router.post("/compare-algorithms")
async def compare_algorithms(request: dict):
    """
    Compare two algorithm implementations side by side
    """
    try:
        code_a = request.get("codeA", "")
        code_b = request.get("codeB", "")

        if not code_a or not code_b:
            raise HTTPException(
                status_code=400, detail="Both code samples are required for comparison"
            )

        tracer = ExecutionTracer()

        # Analyze both algorithms
        result_a = tracer.trace_execution(code_a)
        result_b = tracer.trace_execution(code_b)

        # Extract metrics for comparison
        metrics_a = _extract_algorithm_metrics(result_a)
        metrics_b = _extract_algorithm_metrics(result_b)

        return {
            "algorithmA": {
                "executionTimeline": result_a["executionTimeline"],
                "metrics": metrics_a,
                "totalSteps": result_a["totalSteps"],
            },
            "algorithmB": {
                "executionTimeline": result_b["executionTimeline"],
                "metrics": metrics_b,
                "totalSteps": result_b["totalSteps"],
            },
            "comparison": {
                "fasterAlgorithm": (
                    "A"
                    if metrics_a["totalComparisons"] < metrics_b["totalComparisons"]
                    else "B"
                ),
                "efficiencyRatio": metrics_b["totalComparisons"]
                / max(metrics_a["totalComparisons"], 1),
                "spaceComparison": _compare_space_usage(metrics_a, metrics_b),
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Algorithm comparison error: {str(e)}"
        )


@router.get("/ds-templates")
async def get_ds_templates():
    """
    Get predefined data structure and algorithm templates
    """
    templates = {
        "arrays": {
            "basic_array": {
                "name": "Basic Array Operations",
                "code": """# Basic Array Operations
my_array = [1, 2, 3, 4, 5]

# Add element
my_array.append(6)

# Remove element
my_array.pop()

# Insert at position
my_array.insert(2, 10)

# Access element
print(my_array[0])""",
                "description": "Basic array creation and manipulation",
            },
            "bubble_sort": {
                "name": "Bubble Sort Algorithm",
                "code": """def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
sorted_numbers = bubble_sort(numbers)
print("Sorted array:", sorted_numbers)""",
                "description": "Bubble sort with step-by-step visualization",
            },
        },
        "stacks": {
            "basic_stack": {
                "name": "Basic Stack Operations",
                "code": """# Stack implementation using list
stack = []

# Push operations
stack.append(1)
stack.append(2)
stack.append(3)

print("Stack:", stack)

# Pop operations
while stack:
    item = stack.pop()
    print(f"Popped: {item}")
    print("Stack:", stack)""",
                "description": "Basic stack push and pop operations",
            }
        },
        "trees": {
            "binary_tree": {
                "name": "Binary Tree Traversal",
                "code": """class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root):
    if root:
        inorder_traversal(root.left)
        print(root.val)
        inorder_traversal(root.right)

# Create a simple binary tree
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)

# Traverse the tree
inorder_traversal(root)""",
                "description": "Binary tree creation and in-order traversal",
            }
        },
    }

    return {"templates": templates}


def _extract_algorithm_metrics(execution_result: Dict[str, Any]) -> Dict[str, Any]:
    """Extract performance metrics from execution result"""
    timeline = execution_result.get("executionTimeline", [])

    total_comparisons = 0
    total_swaps = 0
    max_memory = 0

    for step in timeline:
        metrics = step.get("metrics", {})
        if isinstance(metrics.get("comparisons"), int):
            total_comparisons = max(total_comparisons, metrics["comparisons"])
        if isinstance(metrics.get("swaps"), int):
            total_swaps = max(total_swaps, metrics["swaps"])

    return {
        "totalComparisons": total_comparisons,
        "totalSwaps": total_swaps,
        "executionSteps": len(timeline),
        "timeComplexity": "O(n²)" if total_comparisons > 100 else "O(n log n)",
        "spaceComplexity": "O(1)" if max_memory < 10 else "O(n)",
    }


def _compare_space_usage(metrics_a: Dict[str, Any], metrics_b: Dict[str, Any]) -> str:
    """Compare space complexity between two algorithms"""
    space_a = metrics_a.get("spaceComplexity", "O(1)")
    space_b = metrics_b.get("spaceComplexity", "O(1)")

    if space_a == space_b:
        return f"Both algorithms use {space_a} space"
    else:
        return f"Algorithm A uses {space_a}, Algorithm B uses {space_b}"
