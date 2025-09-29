import ast
from typing import Dict, List, Any, Tuple, Optional
import json

class DataStructureAnalyzer:
    """
    Analyzes Python code to identify and track data structure operations
    """
    
    def __init__(self):
        self.ds_operations = []
        self.ds_state = {}
        self.line_to_operations = {}
        
    def analyze_code(self, code: str) -> Dict[str, Any]:
        """
        Analyze code for data structure operations
        
        Returns:
            Dictionary containing DS operations and initial state
        """
        try:
            tree = ast.parse(code)
            
            # Reset state
            self.ds_operations = []
            self.ds_state = {
                'arrays': [],
                'linkedLists': [],
                'stacks': [],
                'queues': [],
                'trees': [],
                'graphs': [],
                'hashMaps': []
            }
            
            # Walk through AST and identify DS operations
            for node in ast.walk(tree):
                self._analyze_node(node)
            
            return {
                'operations': self.ds_operations,
                'initialState': self.ds_state,
                'lineMapping': self.line_to_operations
            }
            
        except Exception as e:
            raise Exception(f"Failed to analyze data structures: {str(e)}")
    
    def _analyze_node(self, node: ast.AST):
        """Analyze individual AST nodes for DS operations"""
        
        # List/Array creation and operations
        if isinstance(node, ast.Assign):
            self._analyze_assignment(node)
        
        # Method calls (append, pop, etc.)
        elif isinstance(node, ast.Call):
            self._analyze_method_call(node)
        
        # List comprehensions
        elif isinstance(node, ast.ListComp):
            self._analyze_list_comprehension(node)
    
    def _analyze_assignment(self, node: ast.Assign):
        """Analyze variable assignments for DS creation"""
        line_no = getattr(node, 'lineno', 0)
        
        for target in node.targets:
            if isinstance(target, ast.Name):
                var_name = target.id
                
                # List/Array creation
                if isinstance(node.value, ast.List):
                    elements = []
                    for elem in node.value.elts:
                        if isinstance(elem, (ast.Constant, ast.Num)):
                            elements.append(elem.n if hasattr(elem, 'n') else elem.value)
                        elif isinstance(elem, (ast.Str)):
                            elements.append(elem.s)
                        else:
                            elements.append('?')  # Unknown value
                    
                    array_info = {
                        'name': var_name,
                        'type': 'array',
                        'values': elements,
                        'line': line_no,
                        'operation': f'Created array {var_name} with {len(elements)} elements'
                    }
                    
                    self.ds_state['arrays'].append(array_info)
                    self._add_operation('create_array', var_name, line_no, array_info)
                
                # Dictionary creation
                elif isinstance(node.value, ast.Dict):
                    hashmap_info = {
                        'name': var_name,
                        'type': 'hashmap',
                        'keys': [],
                        'values': [],
                        'line': line_no,
                        'operation': f'Created dictionary {var_name}'
                    }
                    
                    self.ds_state['hashMaps'].append(hashmap_info)
                    self._add_operation('create_hashmap', var_name, line_no, hashmap_info)
    
    def _analyze_method_call(self, node: ast.Call):
        """Analyze method calls for DS operations"""
        line_no = getattr(node, 'lineno', 0)
        
        if isinstance(node.func, ast.Attribute):
            # Object method call (e.g., list.append())
            if isinstance(node.func.value, ast.Name):
                obj_name = node.func.value.id
                method_name = node.func.attr
                
                # Common list operations
                if method_name in ['append', 'insert', 'remove', 'pop', 'extend']:
                    operation_info = {
                        'object': obj_name,
                        'method': method_name,
                        'line': line_no,
                        'args': self._extract_call_args(node)
                    }
                    
                    self._add_operation(f'list_{method_name}', obj_name, line_no, operation_info)
                
                # Stack operations (if object treated as stack)
                elif method_name in ['push'] or (method_name == 'append' and self._is_stack_usage(obj_name)):
                    operation_info = {
                        'object': obj_name,
                        'method': 'push',
                        'line': line_no,
                        'args': self._extract_call_args(node)
                    }
                    
                    self._add_operation('stack_push', obj_name, line_no, operation_info)
        
        # Built-in functions
        elif isinstance(node.func, ast.Name):
            func_name = node.func.id
            
            if func_name == 'len':
                # Getting length of DS
                if node.args and isinstance(node.args[0], ast.Name):
                    obj_name = node.args[0].id
                    operation_info = {
                        'object': obj_name,
                        'operation': 'length',
                        'line': line_no
                    }
                    
                    self._add_operation('get_length', obj_name, line_no, operation_info)
    
    def _analyze_list_comprehension(self, node: ast.ListComp):
        """Analyze list comprehensions"""
        line_no = getattr(node, 'lineno', 0)
        
        operation_info = {
            'type': 'list_comprehension',
            'line': line_no,
            'operation': 'List comprehension creates new array'
        }
        
        self._add_operation('list_comprehension', 'temp', line_no, operation_info)
    
    def _extract_call_args(self, node: ast.Call) -> List[Any]:
        """Extract arguments from function call"""
        args = []
        for arg in node.args:
            if isinstance(arg, (ast.Constant, ast.Num)):
                args.append(arg.n if hasattr(arg, 'n') else arg.value)
            elif isinstance(arg, (ast.Str)):
                args.append(arg.s)
            elif isinstance(arg, ast.Name):
                args.append(f'var:{arg.id}')
            else:
                args.append('unknown')
        return args
    
    def _is_stack_usage(self, var_name: str) -> bool:
        """Heuristic to determine if variable is used as a stack"""
        # Simple heuristic - could be enhanced with more sophisticated analysis
        return 'stack' in var_name.lower()
    
    def _add_operation(self, op_type: str, obj_name: str, line_no: int, details: Dict[str, Any]):
        """Add operation to tracking lists"""
        operation = {
            'type': op_type,
            'object': obj_name,
            'line': line_no,
            'details': details,
            'timestamp': len(self.ds_operations)
        }
        
        self.ds_operations.append(operation)
        
        if line_no not in self.line_to_operations:
            self.line_to_operations[line_no] = []
        self.line_to_operations[line_no].append(operation)


class ExecutionTracer:
    """
    Traces Python code execution to capture DS state changes
    """
    
    def __init__(self):
        self.execution_steps = []
        self.current_step = 0
        self.ds_analyzer = DataStructureAnalyzer()
    
    def trace_execution(self, code: str) -> Dict[str, Any]:
        """
        Simulate code execution and track DS state changes
        
        Returns:
            Dictionary with execution steps and DS state timeline
        """
        try:
            # Analyze static structure first
            analysis = self.ds_analyzer.analyze_code(code)
            
            # Simulate execution steps (in real implementation, use actual execution tracing)
            execution_timeline = self._simulate_execution(code, analysis)
            
            return {
                'staticAnalysis': analysis,
                'executionTimeline': execution_timeline,
                'totalSteps': len(execution_timeline)
            }
            
        except Exception as e:
            raise Exception(f"Failed to trace execution: {str(e)}")
    
    def _simulate_execution(self, code: str, analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Simulate code execution step by step
        (In production, replace with actual Python execution tracing)
        """
        steps = []
        lines = code.strip().split('\n')
        
        # Mock DS state for demonstration
        current_ds_state = {
            'arrays': [],
            'stacks': [],
            'variables': {}
        }
        
        for i, line in enumerate(lines, 1):
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            
            step = {
                'stepNumber': len(steps),
                'lineNumber': i,
                'code': line,
                'dsState': self._update_ds_state(line, current_ds_state.copy()),
                'variables': self._extract_variables(line),
                'operation': self._identify_operation(line),
                'metrics': self._calculate_metrics(len(steps))
            }
            
            steps.append(step)
            current_ds_state = step['dsState']
        
        return steps
    
    def _update_ds_state(self, line: str, current_state: Dict[str, Any]) -> Dict[str, Any]:
        """Update DS state based on executed line"""
        
        # Simple pattern matching for demo (replace with proper analysis)
        if '= [' in line and ']' in line:
            # Array creation
            var_name = line.split('=')[0].strip()
            values_str = line.split('[')[1].split(']')[0]
            
            try:
                values = [int(x.strip()) for x in values_str.split(',') if x.strip()]
                current_state['arrays'].append({
                    'name': var_name,
                    'values': values,
                    'highlightIndex': None,
                    'operation': f'Created array {var_name}'
                })
            except:
                pass
        
        elif '.append(' in line:
            # Array append
            parts = line.split('.append(')
            if len(parts) >= 2:
                var_name = parts[0].strip()
                value_str = parts[1].split(')')[0]
                
                for arr in current_state['arrays']:
                    if arr['name'] == var_name:
                        try:
                            value = int(value_str)
                            arr['values'].append(value)
                            arr['highlightIndex'] = len(arr['values']) - 1
                            arr['operation'] = f'Appended {value} to {var_name}'
                        except:
                            pass
        
        return current_state
    
    def _extract_variables(self, line: str) -> Dict[str, Any]:
        """Extract variable values from line (simplified)"""
        variables = {}
        
        if '=' in line and not line.strip().startswith('='):
            parts = line.split('=', 1)
            if len(parts) == 2:
                var_name = parts[0].strip()
                try:
                    # Try to evaluate simple expressions
                    value = parts[1].strip()
                    if value.isdigit():
                        variables[var_name] = int(value)
                    elif value.startswith('"') and value.endswith('"'):
                        variables[var_name] = value[1:-1]
                except:
                    variables[var_name] = 'unknown'
        
        return variables
    
    def _identify_operation(self, line: str) -> Optional[str]:
        """Identify the type of operation being performed"""
        line_lower = line.lower()
        
        if '.append(' in line_lower:
            return 'Array Append'
        elif '.pop(' in line_lower:
            return 'Array Pop'
        elif '.insert(' in line_lower:
            return 'Array Insert'
        elif '= [' in line and ']' in line:
            return 'Array Creation'
        elif 'for ' in line_lower:
            return 'Loop Start'
        elif 'if ' in line_lower:
            return 'Conditional Check'
        elif 'def ' in line_lower:
            return 'Function Definition'
        else:
            return 'Assignment' if '=' in line else 'Expression'
    
    def _calculate_metrics(self, step_number: int) -> Dict[str, Any]:
        """Calculate algorithm metrics for current step"""
        return {
            'comparisons': step_number * 2,  # Mock data
            'swaps': step_number // 2,
            'memoryUsed': f'{step_number * 4}KB',
            'timeComplexity': 'O(n)' if step_number < 10 else 'O(n²)'
        }