import { Box, Flex, Text } from "@chakra-ui/react";

import { LoadingPill } from "src/components/LoadingPill";
import { ChatMessagesList } from "src/features/messages/components/ChatMessagesList";
import { MessageComposer } from "src/features/messages/components/MessageComposer";
import { ChatThreadHeader } from "src/features/messages/components/ChatThreadHeader";
import type { ChatThread } from "src/services/api";

type ChatThreadScreenProps = {
  error: string | null;
  isLoading: boolean;
  isSending: boolean;
  onBack: () => void;
  onProfileClick: (matchId: string) => void;
  onSendMessage: (text: string) => Promise<void>;
  thread: ChatThread | null;
};

const styles = {
  root: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    h: "calc(100dvh - 64px)",
    minH: 0,
    overflow: "hidden",
    px: { base: "12px", sm: "16px" },
    pb: "18px",
  },
  status: {
    py: "34px",
    color: "app.text",
    fontSize: "sm",
    fontWeight: "extrabold",
    textAlign: "center",
  },
  loadingStatus: {
    justify: "center",
    py: "34px",
  },
} as const;

export function ChatThreadScreen({
  error,
  isLoading,
  isSending,
  onBack,
  onProfileClick,
  onSendMessage,
  thread,
}: ChatThreadScreenProps) {
  return (
    <Box {...styles.root}>
      <ChatThreadHeader
        match={thread?.match ?? null}
        onBack={onBack}
        onProfileClick={onProfileClick}
      />

      {isLoading && (
        <Flex {...styles.loadingStatus}>
          <LoadingPill text="Načítavam konverzáciu." />
        </Flex>
      )}
      {error && <Text {...styles.status}>{error}</Text>}

      {!isLoading && !error && thread && (
        <>
          <ChatMessagesList messages={thread.messages} />
          <MessageComposer
            isSending={isSending}
            onSendMessage={onSendMessage}
          />
        </>
      )}
    </Box>
  );
}
