import { useEffect, useRef } from "react";
import { Box, Text } from "@chakra-ui/react";

import type { ChatMessage } from "src/services/api";

type ChatMessagesListProps = {
  messages: ChatMessage[];
};

const styles = {
  root: {
    flex: "1 1 0",
    minH: 0,
    overflowY: "auto",
    pt: { base: "22px", sm: "28px" },
    pr: "10px",
    pb: "16px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: "10px",
    minH: "100%",
  },
  bubble: (sender: ChatMessage["sender"]) =>
    ({
      maxW: "82%",
      px: "13px",
      py: "10px",
      borderRadius: "14px",
      bg: sender === "current-user" ? "app.base" : "app.bgAux",
      color: sender === "current-user" ? "app.white" : "app.text",
      fontSize: "sm",
      lineHeight: 1.4,
      whiteSpace: "pre-wrap",
    }) as const,
  messageWrap: (sender: ChatMessage["sender"]) =>
    ({
      display: "grid",
      flexShrink: 0,
      justifyItems: sender === "current-user" ? "end" : "start",
      w: "100%",
    }) as const,
  deliveryStatus: {
    mt: "4px",
    pr: "4px",
    color: "rgba(53, 87, 45, 0.62)",
    fontSize: "11px",
    fontWeight: "bold",
    lineHeight: 1,
  },
  status: {
    py: "34px",
    color: "app.text",
    fontSize: "sm",
    fontWeight: "extrabold",
    textAlign: "center",
  },
} as const;

function getDeliveryStatusLabel(status: ChatMessage["deliveryStatus"]) {
  if (status === "seen") {
    return "Videné";
  }

  if (status === "delivered") {
    return "Doručené";
  }

  return "Odoslané";
}

function getLastOutgoingMessageId(messages: ChatMessage[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].sender === "current-user") {
      return messages[index].id;
    }
  }

  return undefined;
}

export function ChatMessagesList({ messages }: ChatMessagesListProps) {
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const lastOutgoingMessageId = getLastOutgoingMessageId(messages);

  useEffect(() => {
    const messagesElement = messagesRef.current;

    if (!messagesElement) {
      return;
    }

    messagesElement.scrollTop = messagesElement.scrollHeight;
  }, [messages.length]);

  return (
    <Box ref={messagesRef} {...styles.root}>
      <Box {...styles.content}>
        {messages.length === 0 && (
          <Text {...styles.status}>Zatiaľ tu nie sú žiadne správy.</Text>
        )}
        {messages.map((message) => {
          const shouldShowDeliveryStatus =
            message.sender === "current-user" &&
            message.id === lastOutgoingMessageId;

          return (
            <Box key={message.id} {...styles.messageWrap(message.sender)}>
              <Text {...styles.bubble(message.sender)}>{message.text}</Text>
              {shouldShowDeliveryStatus && (
                <Text {...styles.deliveryStatus}>
                  {getDeliveryStatusLabel(message.deliveryStatus)}
                </Text>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
