from uuid import UUID

from app.modules.chats.repository import ChatRepository
from app.modules.chats.schemas import ChatMatch, ChatMessage, ChatThread
from app.modules.matching.repository import MatchingRepository
from app.modules.profiles.repository import ProfileRepository
from app.shared.events.repository import EventRepository


class ChatService:
    def __init__(
        self,
        chats: ChatRepository,
        matching: MatchingRepository,
        profiles: ProfileRepository,
        events: EventRepository,
    ):
        self.chats = chats
        self.matching = matching
        self.profiles = profiles
        self.events = events

    async def list_chat_matches(self, user_id: UUID) -> list[ChatMatch]:
        matches = await self.matching.list_matches(user_id)
        match_ids = [match.id for match in matches]
        profile_rows = await self.profiles.get_public_profiles_by_ids(
            [match.other_user_id for match in matches]
        )
        profiles_by_user_id = {row["user_id"]: row for row in profile_rows}
        last_messages = await self.chats.get_last_messages_by_match_ids(match_ids)
        seen_match_ids = await self.chats.get_seen_match_ids(user_id, match_ids)
        unread_counts = await self.chats.get_unread_counts_by_match_ids(
            user_id,
            match_ids,
        )

        chat_matches: list[ChatMatch] = []
        for match in matches:
            profile = profiles_by_user_id.get(match.other_user_id)
            if profile is None:
                continue
            last_message = last_messages.get(match.id)
            chat_matches.append(
                ChatMatch(
                    id=str(match.id),
                    age=str(profile["age"]),
                    isNew=match.id not in seen_match_ids,
                    lastMessage=last_message.text if last_message else None,
                    lastMessageAt=last_message.sent_at.isoformat()
                    if last_message
                    else None,
                    location=profile["location"],
                    name=profile["nickname"],
                    photo=profile["photo"],
                    unreadCount=unread_counts.get(match.id, 0),
                )
            )

        return chat_matches

    async def mark_matches_seen(self, user_id: UUID, match_ids: list[UUID]) -> None:
        await self.chats.mark_matches_seen(match_ids, user_id)

    async def get_thread(self, user_id: UUID, match_id: UUID) -> ChatThread | None:
        if not await self.matching.user_can_access_match(user_id, match_id):
            return None

        await self.chats.mark_thread_read(match_id, user_id)

        matches = await self.list_chat_matches(user_id)
        match = next((item for item in matches if item.id == str(match_id)), None)
        if match is None:
            return None

        messages = await self.chats.list_messages(match_id)
        return ChatThread(
            match=match,
            messages=[
                ChatMessage(
                    id=str(message.id),
                    matchId=str(message.match_id),
                    sender="current-user"
                    if message.sender_user_id == user_id
                    else "match",
                    sentAt=message.sent_at.isoformat(),
                    text=message.text,
                )
                for message in messages
            ],
        )

    async def send_message(
        self,
        user_id: UUID,
        match_id: UUID,
        text: str,
    ) -> ChatMessage | None:
        if not await self.matching.user_can_access_match(user_id, match_id):
            return None

        message = await self.chats.insert_message(match_id, user_id, text.strip())
        await self.events.append(
            "MessageSent",
            {
                "matchId": str(match_id),
                "messageId": str(message.id),
                "senderUserId": str(user_id),
            },
        )
        return ChatMessage(
            id=str(message.id),
            matchId=str(message.match_id),
            sender="current-user",
            sentAt=message.sent_at.isoformat(),
            text=message.text,
        )
