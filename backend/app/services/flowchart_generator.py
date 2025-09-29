import ast
from typing import Any, Dict, List, Tuple


class FlowchartGenerator:
    """
    Generates Mermaid.js flowchart from Python AST
    """

    def __init__(self):
        self.node_id = 0
        self.nodes = {}
        self.edges = []

    def generate_from_code(self, code: str) -> Tuple[str, Dict[str, Any]]:
        """
        Generate flowchart from Python code

        Args:
            code: Python source code string

        Returns:
            Tuple of (mermaid_code, nodes_dict)
        """
        try:
            tree = ast.parse(code)
            self.reset()

            # Process the AST
            start_node = self.create_node("START", "start")
            current_node = start_node

            for stmt in tree.body:
                current_node = self.process_statement(stmt, current_node)

            end_node = self.create_node("END", "end")
            self.add_edge(current_node, end_node)

            # Generate Mermaid syntax
            mermaid_code = self.generate_mermaid()

            return mermaid_code, self.nodes

        except Exception as e:
            raise Exception(f"Failed to generate flowchart: {str(e)}")

    def reset(self):
        """Reset internal state"""
        self.node_id = 0
        self.nodes = {}
        self.edges = []

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
