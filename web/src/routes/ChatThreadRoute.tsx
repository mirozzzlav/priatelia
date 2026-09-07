import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { ChatThreadScreen } from "src/features/messages";
import { apiClient, type ChatMessage, type ChatThread } from "src/services/api";
import {
  connectChatThreadSocket,
  type ChatReceiptUpdate,
} from "src/services/api/chatSocket";

function getReceiptStatus(
  message: ChatMessage,
  receipt: ChatReceiptUpdate,
): ChatMessage["deliveryStatus"] {
  const sentAt = Date.parse(message.sentAt);
  const lastReadAt = receipt.lastReadAt ? Date.parse(receipt.lastReadAt) : null;
  const deliveredAt = receipt.deliveredAt
    ? Date.parse(receipt.deliveredAt)
    : null;

  if (lastReadAt !== null && lastReadAt >= sentAt) {
    return "seen";
  }

  if (deliveredAt !== null && deliveredAt >= sentAt) {
    return "delivered";
  }

  return message.deliveryStatus ?? "sent";
}

export function ChatThreadRoute() {
  const navigate = useNavigate();
  const { matchId } = useParams<{ matchId: string }>();
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) {
      return;
    }

    let isMounted = true;

    const loadThread = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextThread = await apiClient.getChatThread(matchId);

        if (isMounted) {
          setThread(nextThread);
        }
      } catch {
        if (isMounted) {
          setError("Konverzáciu sa nepodarilo načítať.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadThread();

    return () => {
      isMounted = false;
    };
  }, [matchId]);

  useEffect(() => {
    if (!matchId || thread?.match.id !== matchId) {
      return;
    }

    const socket = connectChatThreadSocket({
      matchId,
      onMessage: (message) => {
        setThread((currentThread) => {
          if (
            !currentThread ||
            currentThread.messages.some(
              (currentMessage) => currentMessage.id === message.id,
            )
          ) {
            return currentThread;
          }

          return {
            ...currentThread,
            messages: [...currentThread.messages, message],
          };
        });
        apiClient.markChatThreadRead(matchId).catch(() => {});
      },
      onReceiptUpdate: (receipt) => {
        setThread((currentThread) => {
          if (!currentThread || receipt.matchId !== currentThread.match.id) {
            return currentThread;
          }

          return {
            ...currentThread,
            messages: currentThread.messages.map((message) =>
              message.sender === "current-user"
                ? {
                    ...message,
                    deliveryStatus: getReceiptStatus(message, receipt),
                  }
                : message,
            ),
          };
        });
      },
    });

    return () => {
      socket?.close();
    };
  }, [matchId, thread?.match.id]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!matchId) {
      return;
    }

    setIsSending(true);

    try {
      const message = await apiClient.sendChatMessage(matchId, { text });

      setThread((currentThread) => {
        if (!currentThread) {
          return currentThread;
        }

        return {
          ...currentThread,
          messages: [...currentThread.messages, message],
        };
      });
    } finally {
      setIsSending(false);
    }
  }, [matchId]);

  const handleBack = useCallback(() => {
    navigate("/messages");
  }, [navigate]);

  if (!matchId) {
    return <Navigate to="/messages" replace />;
  }

  return (
    <ChatThreadScreen
      error={error}
      isLoading={isLoading}
      isSending={isSending}
      onBack={handleBack}
      onSendMessage={handleSendMessage}
      thread={thread}
    />
  );
}
