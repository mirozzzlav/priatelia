from uuid import UUID

from app.modules.matching.repository import MatchingRepository
from app.shared.events.repository import EventRepository


class MatchingService:
    def __init__(self, repository: MatchingRepository, events: EventRepository):
        self.repository = repository
        self.events = events

    async def submit_action(
        self,
        actor_user_id: UUID,
        target_user_id: UUID,
        action: str,
    ) -> None:
        if action not in {"like", "nope"}:
            raise ValueError("Unsupported profile action")

        await self.repository.save_decision(actor_user_id, target_user_id, action)
        await self.events.append(
            "ProfileDecisionSubmitted",
            {
                "actorUserId": str(actor_user_id),
                "targetUserId": str(target_user_id),
                "action": action,
            },
        )

        if action != "like":
            return

        if not await self.repository.has_reverse_like(actor_user_id, target_user_id):
            return

        match_id = await self.repository.create_match(actor_user_id, target_user_id)
        await self.events.append(
            "MatchCreated",
            {
                "matchId": str(match_id),
                "firstUserId": str(actor_user_id),
                "secondUserId": str(target_user_id),
            },
        )
