from dataclasses import dataclass
from uuid import UUID

from fastapi import WebSocket

from app.modules.chats.schemas import ChatMessage, ChatThreadReceiptRecord


@dataclass(frozen=True)
class ChatConnection:
    user_id: UUID
    websocket: WebSocket


class ChatWebSocketManager:
    def __init__(self) -> None:
        self._connections_by_match_id: dict[UUID, list[ChatConnection]] = {}

    async def connect(
        self,
        match_id: UUID,
        user_id: UUID,
        websocket: WebSocket,
    ) -> None:
        await websocket.accept()
        connections = self._connections_by_match_id.setdefault(match_id, [])
        connections.append(ChatConnection(user_id=user_id, websocket=websocket))

    def disconnect(self, match_id: UUID, websocket: WebSocket) -> None:
        connections = self._connections_by_match_id.get(match_id)
        if connections is None:
            return

        self._connections_by_match_id[match_id] = [
            connection
            for connection in connections
            if connection.websocket is not websocket
        ]

        if not self._connections_by_match_id[match_id]:
            del self._connections_by_match_id[match_id]

    async def broadcast_message(
        self,
        match_id: UUID,
        sender_user_id: UUID,
        message: ChatMessage,
    ) -> None:
        connections = list(self._connections_by_match_id.get(match_id, []))

        for connection in connections:
            if connection.user_id == sender_user_id:
                continue

            try:
                await connection.websocket.send_json(
                    {
                        "message": message.model_copy(
                            update={"sender": "match"},
                        ).model_dump(),
                        "type": "message",
                    }
                )
            except RuntimeError:
                self.disconnect(match_id, connection.websocket)

    async def broadcast_receipt(
        self,
        match_id: UUID,
        actor_user_id: UUID,
        receipt: ChatThreadReceiptRecord,
    ) -> None:
        connections = list(self._connections_by_match_id.get(match_id, []))

        for connection in connections:
            if connection.user_id == actor_user_id:
                continue

            try:
                await connection.websocket.send_json(
                    {
                        "deliveredAt": receipt.delivered_at.isoformat()
                        if receipt.delivered_at
                        else None,
                        "lastReadAt": receipt.last_read_at.isoformat()
                        if receipt.last_read_at
                        else None,
                        "matchId": str(match_id),
                        "type": "receipt_updated",
                    }
                )
            except RuntimeError:
                self.disconnect(match_id, connection.websocket)


chat_websocket_manager = ChatWebSocketManager()
