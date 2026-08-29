import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { ChatThreadScreen } from "src/features/messages";
import { apiClient, type ChatThread } from "src/services/api";

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

  if (!matchId) {
    return <Navigate to="/messages" replace />;
  }

  const handleSendMessage = async (text: string) => {
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
  };

  return (
    <ChatThreadScreen
      error={error}
      isLoading={isLoading}
      isSending={isSending}
      onBack={() => navigate("/messages")}
      onSendMessage={handleSendMessage}
      thread={thread}
    />
  );
}
