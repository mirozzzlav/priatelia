import type { ChatMessage } from "src/services/api/types";
import { getStoredSession } from "src/services/api/sessionStorage";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";
const dataSource = import.meta.env.VITE_DATA_SOURCE ?? "mock";

type ChatSocketMessage = {
  message: ChatMessage;
  type: "message";
};

export type ChatReceiptUpdate = {
  deliveredAt: string | null;
  lastReadAt: string | null;
  matchId: string;
  type: "receipt_updated";
};

type ChatSocketEvent = ChatSocketMessage | ChatReceiptUpdate;

function getChatStreamUrl(matchId: string, token: string) {
  const httpUrl = new URL(apiBaseUrl, window.location.origin);
  const wsProtocol = httpUrl.protocol === "https:" ? "wss:" : "ws:";

  return `${wsProtocol}//${httpUrl.host}${httpUrl.pathname.replace(/\/$/, "")}/chats/matches/${matchId}/stream?token=${encodeURIComponent(token)}`;
}

function isChatSocketEvent(value: unknown): value is ChatSocketEvent {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    (value.type === "message" || value.type === "receipt_updated")
  );
}

export function connectChatThreadSocket({
  matchId,
  onMessage,
  onReceiptUpdate,
}: {
  matchId: string;
  onMessage: (message: ChatMessage) => void;
  onReceiptUpdate?: (receipt: ChatReceiptUpdate) => void;
}) {
  if (dataSource !== "rest") {
    return null;
  }

  const token = getStoredSession()?.token;

  if (!token) {
    return null;
  }

  const socket = new WebSocket(getChatStreamUrl(matchId, token));

  socket.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data as string) as unknown;

      if (!isChatSocketEvent(data)) {
        return;
      }

      if (data.type === "message" && "message" in data) {
        onMessage(data.message);
        socket.send(
          JSON.stringify({
            messageId: data.message.id,
            type: "message_delivered",
          }),
        );
        return;
      }

      if (data.type === "receipt_updated") {
        onReceiptUpdate?.(data);
      }
    } catch {
      // Ignore malformed socket messages.
    }
  });

  return socket;
}
