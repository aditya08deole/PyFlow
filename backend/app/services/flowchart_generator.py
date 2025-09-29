import ast
import time
from typing import Any, Dict, List, Tuple, Optional


class FlowchartGenerator:
    """
    Enhanced Mermaid.js flowchart generator with performance analysis
    """

    def __init__(self):
        self.node_id = 0
        self.nodes = {}
        self.edges = []
        self.performance_metrics = {
            'execution_time': 0,
            'memory_usage': 0,
            'complexity': 'O(1)',
            'operations': 0
        }
        self.code_insights = []
        self.variables_used = set()
        self.functions_defined = []

    def generate_from_code(self, code: str) -> Tuple[str, Dict[str, Any]]:
        """
        Generate enhanced flowchart with performance metrics and insights

        Args:
            code: Python source code string

        Returns:
            Tuple of (mermaid_code, analysis_data)
        """
        start_time = time.time()
        
        try:
            tree = ast.parse(code)
            self.reset()
            
            # Analyze code complexity and gather insights
            self._analyze_code_complexity(tree)
            self._gather_code_insights(tree, code)

            # Process the AST
            start_node = self.create_node("START", "start")
            current_node = start_node

            for stmt in tree.body:
                current_node = self.process_statement(stmt, current_node)

            end_node = self.create_node("END", "end")
            self.add_edge(current_node, end_node)

            # Calculate execution time
            self.performance_metrics['execution_time'] = round((time.time() - start_time) * 1000, 2)
            
            # Generate Mermaid syntax
            mermaid_code = self.generate_mermaid()
            
            # Prepare comprehensive analysis data
            analysis_data = {
                'nodes': self.nodes,
                'performance_metrics': self.performance_metrics,
                'code_insights': self.code_insights,
                'variables': list(self.variables_used),
                'functions': self.functions_defined
            }

            return mermaid_code, analysis_data

        except Exception as e:
            raise Exception(f"Failed to generate flowchart: {str(e)}")

    def reset(self):
        """Reset internal state"""
        self.node_id = 0
        self.nodes = {}
        self.edges = []
        self.performance_metrics = {
            'execution_time': 0,
            'memory_usage': 0,
            'complexity': 'O(1)',
            'operations': 0
        }
        self.code_insights = []
        self.variables_used = set()
        self.functions_defined = []
        
    def _analyze_code_complexity(self, tree: ast.AST) -> None:
        """Analyze code complexity and estimate Big-O"""
        complexity_score = 0
        
        for node in ast.walk(tree):
            if isinstance(node, ast.For):
                complexity_score += 1
            elif isinstance(node, ast.While):
                complexity_score += 1
            elif isinstance(node, ast.If):
                complexity_score += 0.5
                
        # Estimate complexity
        if complexity_score == 0:
            self.performance_metrics['complexity'] = 'O(1)'
        elif complexity_score <= 1:
            self.performance_metrics['complexity'] = 'O(n)'
        elif complexity_score <= 2:
            self.performance_metrics['complexity'] = 'O(n²)'
        else:
            self.performance_metrics['complexity'] = 'O(n³+)'
            
    def _gather_code_insights(self, tree: ast.AST, code: str) -> None:
        """Gather insights about code quality and patterns"""
        lines = code.split('\n')
        
        # Count operations
        operations = 0
        for node in ast.walk(tree):
            if isinstance(node, (ast.Assign, ast.Call, ast.Return)):
                operations += 1
                
        self.performance_metrics['operations'] = operations
        
        # Analyze patterns and suggest improvements
        if len(lines) > 50:
            self.code_insights.append("Consider breaking down large functions")
            
        # Check for common patterns
        has_docstrings = any('"""' in line or "'''" in line for line in lines)
        if not has_docstrings:
            self.code_insights.append("Add docstrings for better documentation")
            
        # Check for error handling
        has_try_except = any('try:' in line for line in lines)
        if not has_try_except and len(lines) > 10:
            self.code_insights.append("Consider adding error handling")

    def create_node(
        self, label: str, node_type: str = "process", line_no: int = None
    ) -> str:
        """Create a new flowchart node"""
        node_id = f"node{self.node_id}"
        self.node_id += 1

        self.nodes[node_id] = {
            "id": node_id,
            "label": label,
            "type": node_type,
            "line": line_no,
        }

        return node_id

    def add_edge(self, from_node: str, to_node: str, label: str = ""):
        """Add an edge between two nodes"""
        self.edges.append({"from": from_node, "to": to_node, "label": label})

    def process_statement(self, stmt, current_node: str) -> str:
        """Process a single AST statement"""

        if isinstance(stmt, ast.Assign):
            # Variable assignment
            targets = [
                target.id for target in stmt.targets if isinstance(target, ast.Name)
            ]
            # Track variables
            self.variables_used.update(targets)
            label = f"Assign: {', '.join(targets)}"
            node = self.create_node(label, "process", stmt.lineno)
            self.add_edge(current_node, node)
            return node

        elif isinstance(stmt, ast.If):
            # If statement
            condition = (
                ast.unparse(stmt.test) if hasattr(ast, "unparse") else "condition"
            )
            decision_node = self.create_node(
                f"If {condition}?", "decision", stmt.lineno
            )
            self.add_edge(current_node, decision_node)

            # Process if body
            if_end = decision_node
            for if_stmt in stmt.body:
                if_end = self.process_statement(if_stmt, if_end)

            # Process else body
            else_end = decision_node
            if stmt.orelse:
                for else_stmt in stmt.orelse:
                    else_end = self.process_statement(else_stmt, else_end)

            # Create merge node
            merge_node = self.create_node("Merge", "process")
            self.add_edge(if_end, merge_node, "Yes")
            self.add_edge(else_end, merge_node, "No" if stmt.orelse else "")

            return merge_node

        elif isinstance(stmt, ast.For):
            # For loop
            target = stmt.target.id if isinstance(stmt.target, ast.Name) else "item"
            iter_expr = (
                ast.unparse(stmt.iter) if hasattr(ast, "unparse") else "iterable"
            )
            loop_node = self.create_node(
                f"For {target} in {iter_expr}", "decision", stmt.lineno
            )
            self.add_edge(current_node, loop_node)

            # Process loop body
            body_end = loop_node
            for body_stmt in stmt.body:
                body_end = self.process_statement(body_stmt, body_end)

            # Loop back
            self.add_edge(body_end, loop_node, "Continue")

            return loop_node

        elif isinstance(stmt, ast.While):
            # While loop
            condition = (
                ast.unparse(stmt.test) if hasattr(ast, "unparse") else "condition"
            )
            loop_node = self.create_node(f"While {condition}?", "decision", stmt.lineno)
            self.add_edge(current_node, loop_node)

            # Process loop body
            body_end = loop_node
            for body_stmt in stmt.body:
                body_end = self.process_statement(body_stmt, body_end)

            # Loop back
            self.add_edge(body_end, loop_node, "Continue")

            return loop_node

        elif isinstance(stmt, ast.FunctionDef):
            # Function definition
            func_info = {
                'name': stmt.name,
                'args': [arg.arg for arg in stmt.args.args],
                'line': stmt.lineno
            }
            self.functions_defined.append(func_info)
            func_node = self.create_node(
                f"Function: {stmt.name}", "process", stmt.lineno
            )
            self.add_edge(current_node, func_node)
            return func_node

        elif isinstance(stmt, ast.Return):
            # Return statement
            return_node = self.create_node("Return", "process", stmt.lineno)
            self.add_edge(current_node, return_node)
            return return_node

        elif isinstance(stmt, ast.Expr) and isinstance(stmt.value, ast.Call):
            # Function call (like print)
            func_name = "function"
            if isinstance(stmt.value.func, ast.Name):
                func_name = stmt.value.func.id

            call_node = self.create_node(f"Call: {func_name}()", "process", stmt.lineno)
            self.add_edge(current_node, call_node)
            return call_node

        else:
            # Generic statement
            stmt_type = type(stmt).__name__
            generic_node = self.create_node(
                f"Statement: {stmt_type}", "process", getattr(stmt, "lineno", None)
            )
            self.add_edge(current_node, generic_node)
            return generic_node

    def generate_mermaid(self) -> str:
        """Generate Mermaid.js flowchart syntax"""
        lines = ["flowchart TD"]

        # Add node definitions
        for node_id, node_data in self.nodes.items():
            node_type = node_data["type"]
            label = node_data["label"]

            if node_type == "start":
                lines.append(f"    {node_id}([{label}])")
            elif node_type == "end":
                lines.append(f"    {node_id}([{label}])")
            elif node_type == "decision":
                lines.append(f"    {node_id}{{{label}}}")
            else:  # process
                lines.append(f"    {node_id}[{label}]")

        # Add edges
        for edge in self.edges:
            if edge["label"]:
                lines.append(f"    {edge['from']} -->|{edge['label']}| {edge['to']}")
            else:
                lines.append(f"    {edge['from']} --> {edge['to']}")

        return "\n".join(lines)
