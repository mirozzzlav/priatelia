import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { useChatMatches } from "src/context/chatMatches";
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

const deliveryStatusRank: Record<
  NonNullable<ChatMessage["deliveryStatus"]>,
  number
> = {
  sent: 0,
  delivered: 1,
  seen: 2,
};

function getLatestDeliveryStatus(
  currentStatus: ChatMessage["deliveryStatus"],
  nextStatus: ChatMessage["deliveryStatus"],
) {
  if (!nextStatus) {
    return currentStatus ?? "sent";
  }

  if (!currentStatus) {
    return nextStatus;
  }

  return deliveryStatusRank[nextStatus] > deliveryStatusRank[currentStatus]
    ? nextStatus
    : currentStatus;
}

function mergeThread(currentThread: ChatThread | null, nextThread: ChatThread) {
  if (!currentThread || currentThread.match.id !== nextThread.match.id) {
    return nextThread;
  }

  const currentMessagesById = new Map(
    currentThread.messages.map((message) => [message.id, message]),
  );

  return {
    ...nextThread,
    messages: nextThread.messages.map((nextMessage) => {
      const currentMessage = currentMessagesById.get(nextMessage.id);

      if (!currentMessage || nextMessage.sender !== "current-user") {
        return nextMessage;
      }

      return {
        ...nextMessage,
        deliveryStatus: getLatestDeliveryStatus(
          currentMessage.deliveryStatus,
          nextMessage.deliveryStatus,
        ),
      };
    }),
  };
}

export function ChatThreadRoute() {
  const navigate = useNavigate();
  const { matchId } = useParams<{ matchId: string }>();
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { markMatchMessagesRead } = useChatMatches();

  const loadThread = useCallback(
    async ({
      isInitialLoad = false,
      isMounted = () => true,
    }: {
      isInitialLoad?: boolean;
      isMounted?: () => boolean;
    } = {}) => {
      if (!matchId) {
        return;
      }

      if (isInitialLoad) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const nextThread = await apiClient.getChatThread(matchId);

        if (isMounted()) {
          setThread((currentThread) => mergeThread(currentThread, nextThread));
          markMatchMessagesRead(matchId);
        }
      } catch {
        if (isMounted() && isInitialLoad) {
          setError("Konverzáciu sa nepodarilo načítať.");
        }
      } finally {
        if (isMounted() && isInitialLoad) {
          setIsLoading(false);
        }
      }
    },
    [markMatchMessagesRead, matchId],
  );

  useEffect(() => {
    let isMounted = true;

    const timeoutId = window.setTimeout(() => {
      void loadThread({
        isInitialLoad: true,
        isMounted: () => isMounted,
      });
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [loadThread]);

  useEffect(() => {
    if (!matchId || isLoading || error) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void loadThread();
    }, 5_000);

    return () => window.clearInterval(intervalId);
  }, [error, isLoading, loadThread, matchId]);

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
        apiClient
          .markChatThreadRead(matchId)
          .then(() => markMatchMessagesRead(matchId))
          .catch(() => {});
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
                    deliveryStatus: getLatestDeliveryStatus(
                      message.deliveryStatus,
                      getReceiptStatus(message, receipt),
                    ),
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
  }, [markMatchMessagesRead, matchId, thread?.match.id]);

  const handleSendMessage = useCallback(
    async (text: string) => {
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
    },
    [matchId],
  );

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
      onProfileClick={(profileMatchId) =>
        navigate(`/people/${profileMatchId}`, {
          state: { from: `/messages/${profileMatchId}` },
        })
      }
      onSendMessage={handleSendMessage}
      thread={thread}
    />
  );
}
