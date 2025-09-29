import json
import uuid
from typing import Dict, List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel

router = APIRouter()

class ConnectionManager:
    """Manages WebSocket connections for real-time collaboration"""
    
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_sessions: Dict[str, dict] = {}
        
    async def connect(self, websocket: WebSocket, user_id: str = None):
        """Accept WebSocket connection and assign user ID"""
        await websocket.accept()
        
        if not user_id:
            user_id = str(uuid.uuid4())
            
        self.active_connections[user_id] = websocket
        self.user_sessions[user_id] = {
            'id': user_id,
            'name': f'User-{user_id[:8]}',
            'cursor': 1,
            'color': self._generate_user_color(user_id)
        }
        
        # Notify all users about new connection
        await self.broadcast_user_list()
        return user_id
        
    def disconnect(self, user_id: str):
        """Remove user connection"""
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        if user_id in self.user_sessions:
            del self.user_sessions[user_id]
            
    async def send_personal_message(self, message: dict, user_id: str):
        """Send message to specific user"""
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            await websocket.send_text(json.dumps(message))
            
    async def broadcast(self, message: dict, exclude_user: str = None):
        """Broadcast message to all connected users"""
        for user_id, websocket in self.active_connections.items():
            if exclude_user and user_id == exclude_user:
                continue
            try:
                await websocket.send_text(json.dumps(message))
            except:
                # Connection broken, remove user
                self.disconnect(user_id)
                
    async def broadcast_user_list(self):
        """Send updated user list to all connected users"""
        user_list = list(self.user_sessions.values())
        message = {
            'type': 'user_list',
            'users': user_list,
            'count': len(user_list)
        }
        await self.broadcast(message)
        
    async def update_user_cursor(self, user_id: str, line: int):
        """Update user's cursor position"""
        if user_id in self.user_sessions:
            self.user_sessions[user_id]['cursor'] = line
            message = {
                'type': 'cursor_update',
                'user_id': user_id,
                'cursor': line,
                'user': self.user_sessions[user_id]
            }
            await self.broadcast(message, exclude_user=user_id)
            
    def _generate_user_color(self, user_id: str) -> str:
        """Generate consistent color for user based on ID"""
        colors = [
            '#ef4444', '#f97316', '#eab308', '#22c55e',
            '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
        ]
        return colors[hash(user_id) % len(colors)]

# Global connection manager
manager = ConnectionManager()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str = None):
    """WebSocket endpoint for real-time collaboration"""
    connected_user_id = await manager.connect(websocket, user_id)
    
    try:
        # Send welcome message with user info
        welcome_message = {
            'type': 'connected',
            'user_id': connected_user_id,
            'user': manager.user_sessions[connected_user_id]
        }
        await manager.send_personal_message(welcome_message, connected_user_id)
        
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            message_type = message.get('type')
            
            if message_type == 'cursor_move':
                # Update user cursor position
                line = message.get('line', 1)
                await manager.update_user_cursor(connected_user_id, line)
                
            elif message_type == 'code_change':
                # Broadcast code changes to other users
                code_message = {
                    'type': 'code_update',
                    'code': message.get('code', ''),
                    'user_id': connected_user_id,
                    'timestamp': message.get('timestamp')
                }
                await manager.broadcast(code_message, exclude_user=connected_user_id)
                
            elif message_type == 'execution_state':
                # Share execution state with other users
                execution_message = {
                    'type': 'execution_update',
                    'current_line': message.get('current_line'),
                    'is_running': message.get('is_running', False),
                    'user_id': connected_user_id
                }
                await manager.broadcast(execution_message, exclude_user=connected_user_id)
                
            elif message_type == 'chat_message':
                # Simple chat functionality
                chat_message = {
                    'type': 'chat',
                    'message': message.get('message', ''),
                    'user': manager.user_sessions[connected_user_id],
                    'timestamp': message.get('timestamp')
                }
                await manager.broadcast(chat_message, exclude_user=connected_user_id)
                
    except WebSocketDisconnect:
        manager.disconnect(connected_user_id)
        await manager.broadcast_user_list()
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(connected_user_id)

@router.get("/collaboration/status")
async def get_collaboration_status():
    """Get current collaboration status"""
    return {
        'active_users': len(manager.active_connections),
        'users': list(manager.user_sessions.values())
    }